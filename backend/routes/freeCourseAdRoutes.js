import express from 'express';
import FreeCourseAd from '../models/FreeCourseAd.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ ընթացիկ (միակ ակտիվ) popup գովազդը
router.get('/', async (req, res) => {
          try {
                    const ad = await FreeCourseAd.findOne().sort({ createdAt: -1 });
                    // Եթե դեռ ոչինչ չի հրապարակվել, վերադարձնում ենք null — frontend-ը
                    // այդ դեպքում պարզապես ցույց չի տա popup-ը, առանց սխալի
                    res.status(200).json(ad);
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ տվյալները ստանալիս', error: error.message });
          }
});

// 2. POST: Հրապարակել/թարմացնել popup գովազդը (միայն admin)
// Նոր տարբերակը հրապարակելիս նախորդն ամբողջությամբ ջնջվում է, որպեսզի
// կայքում միշտ երևա միայն մեկ, ամենաթարմ տարբերակը
router.post('/', adminOnly, (req, res, next) => {
          upload.single('image')(req, res, (err) => {
                    if (err) {
                              return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
                    }
                    next();
          });
}, async (req, res) => {
          try {
                    const { title = '', description = '', link } = req.body;

                    if (!link) {
                              return res.status(400).json({ message: 'Գրանցման հղումը (Google Docs) պարտադիր է' });
                    }

                    const existing = await FreeCourseAd.findOne().sort({ createdAt: -1 });

                    let imageUrl = existing?.image;
                    if (req.file) {
                              const uploaded = await imagekit.upload({
                                        file: req.file.buffer,
                                        fileName: `${Date.now()}_freecourse_${req.file.originalname}`
                              });
                              imageUrl = uploaded.url;
                    }

                    if (!imageUrl) {
                              return res.status(400).json({ message: 'Պետք է վերբեռնել նկար' });
                    }

                    // Singleton-պես վարքագիծ. նոր տարբերակ ավելացնելիս հին տարբերակը ջնջվում է
                    await FreeCourseAd.deleteMany({});
                    const newAd = new FreeCourseAd({ title, description, link, image: imageUrl });
                    const saved = await newAd.save();

                    res.status(201).json(saved);
          } catch (error) {
                    res.status(400).json({ message: 'Սխալ հրապարակելիս', error: error.message });
          }
});

// 3. DELETE: Ամբողջությամբ հեռացնել popup գովազդը (միայն admin)
router.delete('/', adminOnly, async (req, res) => {
          try {
                    await FreeCourseAd.deleteMany({});
                    res.status(200).json({ message: 'Գովազդը ջնջվեց' });
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
          }
});

export default router;