import express from 'express';
import LiteraryNews from '../models/LiteraryNews.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ գրական նորությունների ցանկը՝ ամենավերջինը առաջինը
//    ?limit=4 -- ընտրովի, միայն վերջին N հատը (գլխավոր էջի բաժնի համար)
router.get('/', async (req, res) => {
          try {
                    const limit = Number(req.query.limit) || 0;
                    let query = LiteraryNews.find().sort({ createdAt: -1 });
                    if (limit > 0) query = query.limit(limit);
                    const news = await query;
                    res.status(200).json(news);
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ տվյալները ստանալիս', error: error.message });
          }
});

// 2. POST: Հրապարակել նոր գրական նորություն (միայն admin) — նկարը ընտրովի է
router.post('/', adminOnly, (req, res, next) => {
          upload.fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                              return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
                    }
                    next();
          });
}, async (req, res) => {
          try {
                    const { title, content, date } = req.body;
                    if (!title || !content) {
                              return res.status(400).json({ message: 'Վերնագիրը և տեքստը պարտադիր են' });
                    }

                    let imageUrl = '';
                    const imageFile = req.files?.image?.[0];
                    if (imageFile) {
                              const uploaded = await imagekit.upload({
                                        file: imageFile.buffer,
                                        fileName: `${Date.now()}_news_${imageFile.originalname}`
                              });
                              imageUrl = uploaded.url;
                    }

                    const newsItem = new LiteraryNews({
                              title,
                              content,
                              date: date || '',
                              image: imageUrl
                    });
                    const saved = await newsItem.save();

                    res.status(201).json(saved);
          } catch (error) {
                    res.status(400).json({ message: 'Սխալ հրապարակելիս', error: error.message });
          }
});

// 3. DELETE: Ջնջել կոնկրետ նորություն id-ով (միայն admin)
router.delete('/:id', adminOnly, validateObjectId, async (req, res) => {
          try {
                    const deleted = await LiteraryNews.findByIdAndDelete(req.params.id);
                    if (!deleted) {
                              return res.status(404).json({ message: 'Նորությունը չի գտնվել' });
                    }
                    res.status(200).json({ message: 'Նորությունը ջնջվեց' });
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
          }
});

export default router;