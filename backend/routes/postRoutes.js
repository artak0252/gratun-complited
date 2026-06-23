import express from 'express';
import multer from 'multer';
import ImageKit from 'imagekit';
import Post from '../models/Post.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ImageKit-ի ինիցիալիզացիա
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Multer memoryStorage-ով (ֆայլերը չեն պահվում սերվերի վրա)
const upload = multer({ storage: multer.memoryStorage() });

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
router.post('/', adminOnly, upload.single('image'), async (req, res) => {
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

// 4. DELETE: Ջնջել հոդվածը
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