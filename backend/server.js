import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

// Մոդելներ
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import-ներ ռուտերի համար
import bookRoutes from './routes/bookRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS-ի կարգավորում՝ թույլատրելով հարցումներ ձեր ֆրոնտենդից
app.use(cors({
    origin: ["https://gratun.am", "https://gratun-frontend.onrender.com"], // ավելացրեք ձեր ֆրոնտենդի հասցեները
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Nodemailer-ի կոնֆիգուրացիա
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'safaryanartak81@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

// MongoDB Միացում
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB միացված է հաջողությամբ... 🌱');
    } catch (error) {
        console.error('Բազայի միացման սխալ:', error.message);
        process.exit(1);
    }
};
connectDB();

// Ռուտեր
app.use('/api/books', bookRoutes);
app.use('/api/posts', postRoutes);

// Register ռուտ
app.post('/api/orders', async (req, res) => {
    const { name, phone, address, cartItems, total } = req.body;
    const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');

    try {
        // 1. Նախ փորձում ենք ուղարկել նամակը, բայց այն չենք դնում հիմնական 'await'-ի տակ
        // կամ օգտագործում ենք առանձին try-catch, որպեսզի սխալը չկանգնեցնի պատվերը:
        transporter.sendMail({
            from: '"Իմ Խանութ" <safaryanartak81@gmail.com>',
            to: "safaryanartak81@gmail.com",
            subject: "Նոր պատվեր!",
            text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
        }).catch(err => console.error("Նամակը չուղարկվեց, բայց պատվերը ընդունված է:", err.message));

        // 2. Այստեղ կավելացնես քո MongoDB-ի 'await Order.create(...)' կոդը, եթե ունես

        // 3. Միշտ ուղարկում ենք հաջող պատասխան
        res.status(200).json({ message: 'Պատվերը հաջողությամբ ընդունված է!' });

    } catch (error) {
        res.status(500).json({ message: 'Սխալ պատվերի ժամանակ', error: error.message });
    }
});
// Login ռուտ
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { role: 'admin' },
                process.env.JWT_SECRET || 'secret123',
                { expiresIn: '1h' }
            );
            return res.json({ token });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Սխալ օգտանուն կամ գաղտնաբառ' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Սխալ օգտանուն կամ գաղտնաբառ' });

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ' });
    }
});

// Order ռուտ
app.post('/api/orders', async (req, res) => {
    const { name, phone, address, cartItems } = req.body;
    const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');

    try {
        await transporter.sendMail({
            from: '"Իմ Խանութ" <safaryanartak81@gmail.com>',
            to: "safaryanartak81@gmail.com",
            subject: "Նոր պատվեր!",
            text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\n\nՊատվերներ՝\n${orderDetails}`
        });
        res.status(200).json({ message: 'Պատվերն ուղարկված է!' });
    } catch (error) {
        res.status(500).json({ message: 'Նամակը չուղարկվեց', error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error("ԻՐԱԿԱՆ ՍԽԱԼԸ:", err);
    res.status(500).json({ message: "Սերվերում սխալ տեղի ունեցավ", error: err.message });
});

app.listen(PORT, () => {
    console.log(`Սերվերը պտտվում է ${PORT} պորտի վրա... 🚀`);
});