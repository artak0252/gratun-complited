import express from 'express';
import Quote from '../models/Quote.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ բոլոր մեջբերումները
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ մեջբերումները ստանալիս', error: error.message });
    }
});

// 2. GET: Ստանալ մեկ մեջբերում ըստ ID-ի
router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ message: 'Մեջբերումը չգտնվեց' });
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ', error: error.message });
    }
});

// 3. POST: Ավելացնել նոր մեջբերում (միայն admin, նկարը՝ ընտրովի, ImageKit-ով)
router.post('/', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { text, author } = req.body;
        if (!text || !author) {
            return res.status(400).json({ message: 'Լրացրու մեջբերումը և հեղինակի անունը' });
        }

        let authorImage = '';
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`
            });
            authorImage = uploadResponse.url;
        }

        const newQuote = new Quote({ text, author, authorImage });
        const savedQuote = await newQuote.save();
        res.status(201).json(savedQuote);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ ավելացնելիս', error: error.message });
    }
});

// 4. PUT: Խմբագրել առկա մեջբերումը (նկարը փոխելը ընտրովի է)
router.put('/:id', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { text, author } = req.body;
        if (!text || !author) {
            return res.status(400).json({ message: 'Լրացրու մեջբերումը և հեղինակի անունը' });
        }

        const updateData = { text, author };

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`
            });
            updateData.authorImage = uploadResponse.url;
        }

        const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedQuote) return res.status(404).json({ message: 'Մեջբերումը չգտնվեց' });

        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ խմբագրելիս', error: error.message });
    }
});

// 5. DELETE: Ջնջել մեջբերումը
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) return res.status(404).json({ message: 'Մեջբերումը չգտնվեց' });

        res.status(200).json({ message: 'Մեջբերումը հաջողությամբ ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
    }
});

export default router;
