import express from 'express';
import Literature from '../models/Literature.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ բոլոր նյութերը (ընտրովի՝ ըստ category query պարամետրի)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const items = await Literature.find(filter).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ նյութերը ստանալիս', error: error.message });
    }
});

// 2. GET: Ստանալ մեկ նյութ ըստ ID-ի
router.get('/:id', async (req, res) => {
    try {
        const item = await Literature.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Նյութը չգտնվեց' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ', error: error.message });
    }
});

// 3. POST: Ավելացնել նոր նյութ (միայն admin, ImageKit-ով)
router.post('/', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, category, author, excerpt, content, answer } = req.body;
        if (!title || !category || !excerpt || !content || !req.file) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը և ընտրիր նկար' });
        }

        // Վերբեռնում ենք ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `${Date.now()}_${req.file.originalname}`
        });

        const newItem = new Literature({
            title, category, author, excerpt, content, answer,
            image: uploadResponse.url
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ ավելացնելիս', error: error.message });
    }
});

// 4. PUT: Խմբագրել առկա նյութը (նկարը փոխելը ընտրովի է)
router.put('/:id', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, category, author, excerpt, content, answer } = req.body;
        if (!title || !category || !excerpt || !content) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

        const updateData = { title, category, author, excerpt, content, answer };

        // Եթե admin-ը վերբեռնել է նոր նկար, փոխարինում ենք հինը, հակառակ դեպքում թողնում ենք ինչպես կար
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`
            });
            updateData.image = uploadResponse.url;
        }

        const updatedItem = await Literature.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedItem) return res.status(404).json({ message: 'Նյութը չգտնվեց' });

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ խմբագրելիս', error: error.message });
    }
});

// 5. DELETE: Ջնջել նյութը
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const item = await Literature.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Նյութը չգտնվեց' });

        res.status(200).json({ message: 'Նյութը հաջողությամբ ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
    }
});

export default router;
