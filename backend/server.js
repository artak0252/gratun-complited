import 'dotenv/config';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

import User from './models/User.js';
import bookRoutes from './routes/bookRoutes.js';
import postRoutes from './routes/postRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["https://gratun.am", "https://gratun-frontend.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com', // Ավելացրու host-ը
    port: 465,              // Ավելացրու port-ը
    secure: true,           // Ավելացրու secure-ը
    family: 4,              // <--- ԱՅՍ ՏՈՂԸ ԱՎԵԼԱՑՐՈՒ
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
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

app.use('/api/books', bookRoutes);
app.use('/api/posts', postRoutes);

// Միակ և ճիշտ Order ռուտը
app.post('/api/orders', async (req, res) => {
    const { name, phone, address, cartItems, total } = req.body;
    const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');

    // Նամակը ուղարկում ենք առանձին՝ առանց await-ի, որ պատվերը չկանգնի
    transporter.sendMail({
        from: '"Իմ Խանութ" <safaryanartak81@gmail.com>',
        to: "safaryanartak81@gmail.com",
        subject: "Նոր պատվեր!",
        text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
    }).catch(err => console.error("Նամակի ուղարկման սխալ (անտեսված):", err.message));

    // Միշտ վերադարձնում ենք հաջողություն
    res.status(200).json({ message: 'Պատվերն ընդունված է!' });
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Գրանցումը հաջողվեց!" });
    } catch (error) {
        res.status(500).json({ message: "Սխալ գրանցման ժամանակ", error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
            return res.json({ token });
        }
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Սխալ օգտանուն կամ գաղտնաբառ' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Սխալ օգտանուն կամ գաղտնաբառ' });
        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ' });
    }
});

app.use((err, req, res, next) => {
    console.error("ԻՐԱԿԱՆ ՍԽԱԼԸ:", err);
    res.status(500).json({ message: "Սերվերում սխալ տեղի ունեցավ", error: err.message });
});

if (process.env.NODE_ENV === 'production') {
    // Փորձիր սա առաջինը (սա ամենահավանականն է)
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        // Համապատասխանեցրու նույն ուղին
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Սերվերը պտտվում է ${PORT} պորտի վրա... 🚀`);
});