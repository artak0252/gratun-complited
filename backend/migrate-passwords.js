// Մեկանգամյա միգրացիոն սկրիպտ.
// Ստուգում է DB-ի բոլոր user-ներին, և ում password-ը դեռ bcrypt-ով
// հեշավորված չէ (չի սկսվում '$2b$'-ով), հեշավորում է և պահպանում։
//
// Գործարկում.
//   cd backend
//   node migrate-passwords.js
//
// Աշխատացրու սա ՄԻ ԱՆԳԱՄ, մինչև /api/login-ից plaintext fallback-ը հեռացնելը,
// հետո կարող ես այս ֆայլը ջնջել։

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';

const run = async () => {
          try {
                    await mongoose.connect(process.env.MONGO_URI);
                    console.log('MongoDB միացված է...');

                    const users = await User.find({});
                    let migratedCount = 0;

                    for (const user of users) {
                              if (!user.password.startsWith('$2b$')) {
                                        user.password = await bcrypt.hash(user.password, 10);
                                        await user.save();
                                        migratedCount++;
                                        console.log(`Հեշավորվեց: ${user.username}`);
                              }
                    }

                    console.log(`Ավարտված է։ ${migratedCount} user(ներ) միգրացվեցին։`);
                    process.exit(0);
          } catch (error) {
                    console.error('Միգրացիայի սխալ:', error.message);
                    process.exit(1);
          }
};

run();