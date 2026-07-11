import express from 'express';
import multer from 'multer';
import ImageKit from 'imagekit';
import Book from '../models/Book.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ԿԱՐԵՎՈՐ. fallback key-եր չկան միտումնավոր. եթե env փոփոխականները
// բացակայում են, upload-ը պիտի հստակ ձախողվի, ոչ թե լուռ սխալ key-երով աշխատի
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Multer (memoryStorage-ը կարևոր է, որպեսզի ֆայլը չպահվի սերվերի վրա)
// Սահմանափակում ենք միայն նկարներով և առավելագույնը 5ՄԲ, որպեսզի admin token-ի leak-ի դեպքում էլ
// չկարողանան վնասակար կամ չափազանց մեծ ֆայլեր վերբեռնել
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5ՄԲ
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Թույլատրվում են միայն նկարներ (jpg, png, webp, gif)'));
        }
    }
});

// 1. GET: Ստանալ բոլոր գրքերը
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ', error: error.message });
    }
});

// 2. GET: Ստանալ մեկ գիրք ըստ ID-ի (դիտման էջի համար)
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Գիրքը չգտնվեց' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ', error: error.message });
    }
});

// 3. POST: Ավելացնել նոր գիրք
router.post('/', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, author, price, genre, description } = req.body;
        if (!title || !author || !price || !genre || !req.file) {
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
            genre,
            description: description || '',
            image: uploadResponse.url // Պահում ենք ImageKit-ի ուղիղ հղումը
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Գիրքը չհաջողվեց ավելացնել', error: error.message });
    }
});

// 4. PUT: Խմբագրել առկա գիրքը (նկարը փոխելը ընտրովի է)
router.put('/:id', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, author, price, genre, description } = req.body;
        if (!title || !author || !price || !genre) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

        const updateData = { title, author, price, genre, description: description || '' };

        // Եթե admin-ը վերբեռնել է նոր նկար, փոխարինում ենք հինը, հակառակ դեպքում թողնում ենք ինչպես կար
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`
            });
            updateData.image = uploadResponse.url;
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedBook) return res.status(404).json({ message: 'Գիրքը չգտնվեց' });

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ խմբագրելիս', error: error.message });
    }
});

// 5. DELETE: Ջնջել գիրքը
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