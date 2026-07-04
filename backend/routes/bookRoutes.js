

import express from 'express';
import multer from 'multer';
import ImageKit from 'imagekit';
import Book from '../models/Book.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "fallback_key",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "fallback_key",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/fallback"
});

// Multer (memoryStorage-ը կարևոր է, որպեսզի ֆայլը չպահվի սերվերի վրա)
const upload = multer({ storage: multer.memoryStorage() });

// 1. GET: Ստանալ բոլոր գրքերը
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ', error: error.message });
    }
});

// 2. POST: Ավելացնել նոր գիրք
router.post('/', adminOnly, upload.single('image'), async (req, res) => {
    try {
        const { title, author, price } = req.body;
        if (!title || !author || !price || !req.file) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

        // Վերբեռնում ենք ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `${Date.now()}_${req.file.originalname}`
        });

        const newBook = new Book({
            title,
            author,
            price,
            image: uploadResponse.url // Պահում ենք ImageKit-ի ուղիղ հղումը
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Գիրքը չհաջողվեց ավելացնել', error: error.message });
    }
});

// 3. DELETE: Ջնջել գիրքը
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Գիրքը չգտնվեց' });

        res.status(200).json({ message: 'Գիրքը ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ', error: error.message });
    }
});

export default router;