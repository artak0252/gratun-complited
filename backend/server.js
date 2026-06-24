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

// 1. Ստեղծել ենք transporter-ը այստեղ
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
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

app.post('/api/orders', async (req, res) => {
    try {
        const { name, phone, address, cartItems, total } = req.body;
        const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');

        const mailOptions = {
            from: 'safaryanartak81@gmail.com',
            to: "safaryanartak81@gmail.com",
            subject: "Նոր պատվեր!",
            text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
        };

        // Նամակի ուղարկում առանց սպասելու (non-blocking)
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("SMTP Error:", error);
            else console.log("Email sent successfully");
        });

        // ԿԱՐԵՎՈՐ՝ ՄԻԱՆԳԱՄԻՑ պատասխանում ենք ֆրոնտենդին, որ չկախվի
        res.status(200).json({ message: 'Պատվերն ընդունված է!' });

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: "Սխալ պատվերի ժամանակ" });
    }
});

// ... Մնացած մասը (register, login, static) թողնում ես նույնը

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Սերվերը պտտվում է ${PORT} պորտի վրա... 🚀`);
});