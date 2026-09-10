import express from 'express';
import DailyDigest from '../models/DailyDigest.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

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

// 2. POST: Հրապարակել նոր "Օրը մեկ էջում" (միայն admin)
// Կարևոր. նոր տարբերակը հրապարակելիս նախորդն ամբողջությամբ ջնջվում է,
// որպեսզի կայքում միշտ երևա միայն մեկ, ամենաթարմ տարբերակը
router.post('/', adminOnly, async (req, res) => {
          try {
                    const { date, items } = req.body;

                    if (!date || !Array.isArray(items) || items.length === 0) {
                              return res.status(400).json({ message: 'Լրացրու ամսաթիվը և առնվազն մեկ բաժին' });
                    }

                    for (const item of items) {
                              if (!item.category || !item.icon || !item.title || !item.text) {
                                        return res.status(400).json({ message: 'Յուրաքանչյուր բաժին պետք է ունենա category, icon, title և text' });
                              }
                    }

                    await DailyDigest.deleteMany({});
                    const newDigest = new DailyDigest({ date, items });
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