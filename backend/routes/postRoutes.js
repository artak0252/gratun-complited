import express from 'express';
import Post from '../models/Post.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ բոլոր հոդվածները
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ հոդվածները ստանալիս', error: error.message });
    }
});

// 2. GET: Ստանալ հոդվածը ըստ ID-ի
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Հոդվածը չգտնվեց' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ', error: error.message });
    }
});

// 3. POST: Ավելացնել նոր հոդված (ImageKit-ով)
router.post('/', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, excerpt, content, category } = req.body;
        if (!title || !content || !req.file) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը և ընտրիր նկար' });
        }

        // Վերբեռնում ենք ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `${Date.now()}_${req.file.originalname}`
        });

        // Պահում ենք ImageKit-ի տրամադրած URL-ը
        const newPost = new Post({
            title, excerpt, content, category,
            image: uploadResponse.url
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ ավելացնելիս', error: error.message });
    }
});

// 4. PUT: Խմբագրել առկա հոդվածը (նկարը փոխելը ընտրովի է)
router.put('/:id', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, excerpt, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

        const updateData = { title, excerpt, content, category };

        // Եթե admin-ը վերբեռնել է նոր նկար, փոխարինում ենք հինը, հակառակ դեպքում թողնում ենք ինչպես կար
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`
            });
            updateData.image = uploadResponse.url;
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedPost) return res.status(404).json({ message: 'Հոդվածը չգտնվեց' });

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ խմբագրելիս', error: error.message });
    }
});

// 5. DELETE: Ջնջել հոդվածը
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Հոդվածը չգտնվեց' });

        res.status(200).json({ message: 'Հոդվածը հաջողությամբ ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
    }
});

export default router;