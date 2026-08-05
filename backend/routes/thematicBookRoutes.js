import express from 'express';
import ThematicBook from '../models/ThematicBook.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ բոլոր թեմատիկ երաշխավորությունները
router.get('/', async (req, res) => {
          try {
                    const items = await ThematicBook.find().sort({ createdAt: -1 });
                    res.status(200).json(items);
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ թեմատիկ գրքերը ստանալիս', error: error.message });
          }
});

// 2. GET: Ստանալ մեկը՝ ըստ ID-ի
router.get('/:id', async (req, res) => {
          try {
                    const item = await ThematicBook.findById(req.params.id);
                    if (!item) return res.status(404).json({ message: 'Չգտնվեց' });
                    res.status(200).json(item);
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ', error: error.message });
          }
});

// 3. POST: Ավելացնել նոր թեմատիկ գիրք (միայն admin, նկարը՝ ընտրովի, ImageKit-ով)
router.post('/', adminOnly, (req, res, next) => {
          upload.single('image')(req, res, (err) => {
                    if (err) {
                              return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
                    }
                    next();
          });
}, async (req, res) => {
          try {
                    const { theme, text, bookTitle, bookAuthor, link } = req.body;
                    if (!theme || !text || !bookTitle) {
                              return res.status(400).json({ message: 'Լրացրու թեման, տեքստը և գրքի անվանումը' });
                    }

                    let image = '';
                    if (req.file) {
                              const uploadResponse = await imagekit.upload({
                                        file: req.file.buffer,
                                        fileName: `${Date.now()}_${req.file.originalname}`
                              });
                              image = uploadResponse.url;
                    }

                    const newItem = new ThematicBook({
                              theme,
                              text,
                              bookTitle,
                              bookAuthor: bookAuthor || '',
                              link: link || '',
                              image
                    });
                    const saved = await newItem.save();
                    res.status(201).json(saved);
          } catch (error) {
                    res.status(400).json({ message: 'Սխալ ավելացնելիս', error: error.message });
          }
});

// 4. PUT: Խմբագրել առկա գրառումը (նկարը փոխելը ընտրովի է)
router.put('/:id', adminOnly, (req, res, next) => {
          upload.single('image')(req, res, (err) => {
                    if (err) {
                              return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
                    }
                    next();
          });
}, async (req, res) => {
          try {
                    const { theme, text, bookTitle, bookAuthor, link } = req.body;
                    if (!theme || !text || !bookTitle) {
                              return res.status(400).json({ message: 'Լրացրու թեման, տեքստը և գրքի անվանումը' });
                    }

                    const updateData = { theme, text, bookTitle, bookAuthor: bookAuthor || '', link: link || '' };

                    if (req.file) {
                              const uploadResponse = await imagekit.upload({
                                        file: req.file.buffer,
                                        fileName: `${Date.now()}_${req.file.originalname}`
                              });
                              updateData.image = uploadResponse.url;
                    }

                    const updated = await ThematicBook.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
                    if (!updated) return res.status(404).json({ message: 'Չգտնվեց' });

                    res.status(200).json(updated);
          } catch (error) {
                    res.status(400).json({ message: 'Սխալ խմբագրելիս', error: error.message });
          }
});

// 5. DELETE: Ջնջել գրառումը
router.delete('/:id', adminOnly, async (req, res) => {
          try {
                    const item = await ThematicBook.findByIdAndDelete(req.params.id);
                    if (!item) return res.status(404).json({ message: 'Չգտնվեց' });

                    res.status(200).json({ message: 'Հաջողությամբ ջնջվեց' });
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
          }
});

export default router;