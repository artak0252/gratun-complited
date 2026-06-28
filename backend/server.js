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
import { adminOnly } from './middleware/adminMiddleware.js'; 



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

// Brevo-ի կարգավորումներ
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525, // Փորձիր այս պորտը
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Ադմինի ստուգում .env-ով
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, message: 'Մուտքը հաջողված է' });
        }

        // 2. Բազայի օգտատիրոջ ստուգում
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Սխալ մուտքանուն' });

        // Եթե բազայում գաղտնաբառը հեշավորված չէ, ստուգում ենք ուղիղ (plain text)
        // Բայց ցանկալի է բազայում ունենալ հեշավորված տարբերակը
        const isMatch = user.password.startsWith('$2b$')
            ? await bcrypt.compare(password, user.password)
            : (password === user.password);

        if (!isMatch) return res.status(401).json({ message: 'Սխալ գաղտնաբառ' });

        // Փոխիր այս տողը (մոտավորապես 67-րդ տողում)
        const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Մուտքը հաջողված է' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ' });
    }
});

app.use('/api/books', adminOnly, bookRoutes);
app.use('/api/posts', adminOnly, postRoutes);

app.post('/api/orders', async (req, res) => {
    console.log("--- Պատվեր ստացվեց, սկսում եմ մշակումը ---");
    try {
        const { name, phone, address, cartItems, total } = req.body;
        const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');

        const mailOptions = {
            from: "safaryanartak81@gmail.com", // Օգտագործում ենք էլփոստը որպես ուղարկող
            to: "safaryanartak81@gmail.com",
            subject: "Նոր պատվեր!",
            text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
        };

        console.log("Փորձում եմ ուղարկել նամակ Brevo-ի միջոցով...");

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("!!! SMTP ERROR (Brevo):", error);
            } else {
                console.log("!!! EMAIL SENT SUCCESSFULLY (Brevo) - ID:", info.messageId);
            }
        });

        res.status(200).json({ message: 'Պատվերն ընդունված է!' });
    } catch (error) {
        console.error("!!! ORDER CATCH ERROR:", error);
        res.status(500).json({ message: "Սխալ պատվերի ժամանակ" });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Սերվերը պտտվում է ${PORT} պորտի վրա... 🚀`);
});