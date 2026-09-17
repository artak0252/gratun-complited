import express from 'express';
import Quote from '../models/Quote.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
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

// 2. GET: Ստանալ բոլոր հեղինակների ցանկը՝ խմբավորված (նոր «Հեղինակներ» բաժնի համար)
// ԿԱՐԵՎՈՐ. այս route-ը պիտի սահմանվի /:id-ից առաջ, հակառակ դեպքում Express-ը
// "authors"-ը կմեկնաբանի որպես :id պարամետր
router.get('/authors/list', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        const byAuthor = new Map();

        quotes.forEach((quote) => {
            const key = quote.author.trim().toLowerCase();
            if (!byAuthor.has(key)) {
                byAuthor.set(key, {
                    author: quote.author.trim(),
                    authorImage: quote.authorImage || '',
                    authorBio: quote.authorBio || '',
                    authorNationality: quote.authorNationality || '',
                    authorEra: quote.authorEra || '',
                    quotesCount: 0
                });
            }
            const entry = byAuthor.get(key);
            entry.quotesCount += 1;
            // Քանի որ quotes-ը արդեն սորտավորված է ամենավերջինից, առաջին
            // ոչ-դատարկ նկարը/կենսագրությունը/ազգությունը/ժամանակաշրջանը որ գտնենք՝ ամենավերջինն է
            if (!entry.authorImage && quote.authorImage) entry.authorImage = quote.authorImage;
            if (!entry.authorBio && quote.authorBio) entry.authorBio = quote.authorBio;
            if (!entry.authorNationality && quote.authorNationality) entry.authorNationality = quote.authorNationality;
            if (!entry.authorEra && quote.authorEra) entry.authorEra = quote.authorEra;
        });

        res.status(200).json(Array.from(byAuthor.values()));
    } catch (error) {
        res.status(500).json({ message: 'Սխալ հեղինակների ցանկը ստանալիս', error: error.message });
    }
});

// 3. GET: Ստանալ մեկ հեղինակի տվյալները (նկար, կենսագրություն) և նրա բոլոր մեջբերումները
router.get('/authors/:author', async (req, res) => {
    try {
        const authorName = req.params.author.trim();
        const quotes = await Quote.find({
            author: { $regex: `^${authorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
        }).sort({ createdAt: -1 });

        if (quotes.length === 0) {
            return res.status(404).json({ message: 'Հեղինակը չգտնվեց' });
        }

        const authorImage = quotes.find(q => q.authorImage)?.authorImage || '';
        const authorBio = quotes.find(q => q.authorBio)?.authorBio || '';
        const authorNationality = quotes.find(q => q.authorNationality)?.authorNationality || '';
        const authorEra = quotes.find(q => q.authorEra)?.authorEra || '';

        res.status(200).json({
            author: quotes[0].author,
            authorImage,
            authorBio,
            authorNationality,
            authorEra,
            quotes
        });
    } catch (error) {
        res.status(500).json({ message: 'Սխալ հեղինակի տվյալները ստանալիս', error: error.message });
    }
});

// 4. GET: Ստանալ մեկ մեջբերում ըստ ID-ի
router.get('/:id', validateObjectId, async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ message: 'Մեջբերումը չգտնվեց' });
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Սխալ', error: error.message });
    }
});

// 5. POST: Ավելացնել նոր մեջբերում (միայն admin, նկարը՝ ընտրովի, ImageKit-ով)
router.post('/', adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { text, author, authorBio, authorNationality, authorEra } = req.body;
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

        const newQuote = new Quote({
            text,
            author,
            authorImage,
            authorBio: authorBio || '',
            authorNationality: authorNationality || '',
            authorEra: authorEra || ''
        });
        const savedQuote = await newQuote.save();
        res.status(201).json(savedQuote);
    } catch (error) {
        res.status(400).json({ message: 'Սխալ ավելացնելիս', error: error.message });
    }
});

// 6. PUT: Խմբագրել առկա մեջբերումը (նկարը փոխելը ընտրովի է)
router.put('/:id', adminOnly, validateObjectId, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { text, author, authorBio, authorNationality, authorEra } = req.body;
        if (!text || !author) {
            return res.status(400).json({ message: 'Լրացրու մեջբերումը և հեղինակի անունը' });
        }

        const updateData = {
            text,
            author,
            authorBio: authorBio || '',
            authorNationality: authorNationality || '',
            authorEra: authorEra || ''
        };

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

// 7. DELETE: Ջնջել մեջբերումը
router.delete('/:id', adminOnly, validateObjectId, async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) return res.status(404).json({ message: 'Մեջբերումը չգտնվեց' });

        res.status(200).json({ message: 'Մեջբերումը հաջողությամբ ջնջվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
    }
});

export default router;