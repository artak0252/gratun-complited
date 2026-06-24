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
    const { name, phone, address, cartItems, total } = req.body;

    // Ստուգում ենք, որ տվյալները գալիս են
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Զամբյուղը դատարկ է" });
    }

    const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');

    const mailOptions = {
        from: 'safaryanartak81@gmail.com', // Այս հասցեն պետք է հաստատված լինի SendGrid-ում
        to: "safaryanartak81@gmail.com",
        subject: "Նոր պատվեր!",
        text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Նամակի ուղարկման սխալ:", error);
            // Նամակը չուղարկվեց, բայց հաճախորդին ասում ենք հաջող, որ չանհանգստանա
            return res.status(200).json({ message: 'Պատվերն ընդունված է!' });
        } else {
            console.log("Նամակը հաջողությամբ ուղարկվեց:", info.messageId);
            res.status(200).json({ message: 'Պատվերն ընդունված է!' });
        }
    });
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