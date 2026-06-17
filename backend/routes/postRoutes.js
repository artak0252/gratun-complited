import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Post from '../models/Post.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Ճիշտ ստուգում ենք uploads թղթապանակը
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// GET: Հոդվածները բոլորի համար
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ հոդվածները ստանալիս', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Հոդվածը չգտնվեց' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ', error: error.message });
    }
});

// POST: Նոր հոդված (Միայն Ադմին) - adminOnly-ն դրված է առաջինը՝ ավելի անվտանգ է
router.post('/', adminOnly, upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category } = req.body;
        if (!title || !content || !req.file) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }
        const newPost = new Post({
            title, excerpt, content, category,
            image: req.file.path.replace(/\\/g, '/')
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ ավելացնելիս', error: error.message });
    }
});

// DELETE: Հոդվածը ջնջել (Միայն Ադմին)
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Հոդվածը չգտնվեց' });

        // Եթե հոդվածն ունի նկար, ջնջում ենք այն ֆայլային համակարգից
        if (post.image) {
            const absoluteImagePath = path.resolve(post.image);
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlinkSync(absoluteImagePath);
            }
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Հոդվածը հաջողությամբ ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
    }
});

export default router;