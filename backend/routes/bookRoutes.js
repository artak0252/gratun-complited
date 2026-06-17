import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Book from '../models/Book.js';
import { adminOnly } from '../middleware/adminMiddleware.js'; // Ներմուծում ենք ադմինի պահակին

const router = express.Router();

// Ճիշտ ստուգում և ստեղծում ենք uploads թղթապանակը
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer-ի կոնֆիգուրացիա
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// 1. GET: Ստանալ բոլոր գրքերը (Բոլորի համար)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ գրքերը ստանալիս', error: error.message });
    }
});

// 2. POST: Ավելացնել նոր գիրք (Միայն ադմինը)
router.post('/', adminOnly, upload.single('image'), async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price || !req.file) {
            return res.status(400).json({ message: 'Խնդրում ենք լրացնել բոլոր դաշտերը և ընտրել նկար' });
        }

        const imagePath = `uploads/${req.file.filename}`;

        const newBook = new Book({
            title,
            author,
            price,
            image: imagePath
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Գիրքը չհաջողվեց ավելացնել', error: error.message });
    }
});

// 3. DELETE: Ջնջել գիրքը (Միայն ադմինը)
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Գիրքը չգտնվեց' });
        }

        // Ջնջում ենք նկարը
        if (book.image && book.image.startsWith('uploads/')) {
            const absoluteImagePath = path.join(process.cwd(), book.image);
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlinkSync(absoluteImagePath);
            }
        }

        await Book.findByIdAndDelete(id);
        res.status(200).json({ message: 'Գիրքը հաջողությամբ ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ ջնջելիս', error: error.message });
    }
});

export default router;