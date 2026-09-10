import express from 'express';
import DailyDigest from '../models/DailyDigest.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import imagekit from '../utils/imagekit.js';
import upload from '../utils/upload.js';

const router = express.Router();

// 1. GET: Ստանալ ընթացիկ (միակ ակտիվ) "Օրը մեկ էջում"-ը
router.get('/', async (req, res) => {
          try {
                    const digest = await DailyDigest.findOne().sort({ createdAt: -1 });
                    // Եթե դեռ ոչինչ չի հրապարակվել, վերադարձնում ենք null — frontend-ը
                    // այդ դեպքում պարզապես չի ցուցադրի բլոկը, առանց սխալի
                    res.status(200).json(digest);
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ տվյալները ստանալիս', error: error.message });
          }
});

// 2. POST: Հրապարակել նոր "Օրը մեկ էջում" (միայն admin) — 2 նկար (ձախ + աջ)
// Կարևոր. նոր տարբերակը հրապարակելիս նախորդն ամբողջությամբ ջնջվում է,
// որպեսզի կայքում միշտ երևա միայն մեկ, ամենաթարմ տարբերակը
router.post('/', adminOnly, (req, res, next) => {
          upload.fields([{ name: 'left', maxCount: 1 }, { name: 'right', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                              return res.status(400).json({ message: err.message || 'Ֆայլի վերբեռնման սխալ' });
                    }
                    next();
          });
}, async (req, res) => {
          try {
                    const leftFile = req.files?.left?.[0];
                    const rightFile = req.files?.right?.[0];

                    if (!leftFile || !rightFile) {
                              return res.status(400).json({ message: 'Պետք է վերբեռնել երկու նկարն էլ (ձախ և աջ)' });
                    }

                    const [leftUpload, rightUpload] = await Promise.all([
                              imagekit.upload({ file: leftFile.buffer, fileName: `${Date.now()}_left_${leftFile.originalname}` }),
                              imagekit.upload({ file: rightFile.buffer, fileName: `${Date.now()}_right_${rightFile.originalname}` })
                    ]);

                    // Singleton-պես վարքագիծ. նոր "Օրը մեկ էջում" ավելացնելիս հին տարբերակը ջնջվում է
                    await DailyDigest.deleteMany({});
                    const newDigest = new DailyDigest({
                              date: req.body.date || '',
                              leftImage: leftUpload.url,
                              rightImage: rightUpload.url
                    });
                    const saved = await newDigest.save();

                    res.status(201).json(saved);
          } catch (error) {
                    res.status(400).json({ message: 'Սխալ հրապարակելիս', error: error.message });
          }
});

// 3. DELETE: Ամբողջությամբ հեռացնել ընթացիկ "Օրը մեկ էջում"-ը (միայն admin)
router.delete('/', adminOnly, async (req, res) => {
          try {
                    await DailyDigest.deleteMany({});
                    res.status(200).json({ message: 'Օրվա էջը ջնջվեց' });
          } catch (error) {
                    res.status(500).json({ message: 'Սխալ ջնջելիս', error: error.message });
          }
});

export default router;