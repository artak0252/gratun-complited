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
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

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

// Անվտանգության HTTP header-ներ (helmet)
// crossOriginResourcePolicy-ը դնում ենք 'cross-origin', որպեսզի /uploads-ի նկարները
// արգելափակված չլինեն frontend-ի այլ դոմենից բեռնելիս
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://ik.imagekit.io"],
        },
    },
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB միացված է հաջողությամբ...');
    } catch (error) {
        console.error('Բազայի միացման սխալ:', error.message);
        process.exit(1);
    }
};
connectDB();

// Պաշտպանություն password/username գուշակելու փորձերից.
// 15 րոպեում առավելագույնը 10 փորձ մեկ IP-ից login/register route-երի համար
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 րոպե
    max: 10,
    message: { message: 'Չափազանց շատ փորձեր են արվել։ Խնդրում ենք փորձել 15 րոպե անց։' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.post('/api/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, message: 'Մուտքը հաջողված է' });
        }
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Սխալ մուտքանուն' });

        const isMatch = user.password.startsWith('$2b$')
            ? await bcrypt.compare(password, user.password)
            : (password === user.password);

        if (!isMatch) return res.status(401).json({ message: 'Սխալ գաղտնաբառ' });

        // Կարևոր. token-ի role-ը վերցնում ենք user-ի իրական role-ից, ոչ թե hardcoded 'admin'
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Մուտքը հաջողված է' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ' });
    }
});

// Գրանցման route (Register.jsx-ը սպասում է սրան)
app.post('/api/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Այս օգտանունով կամ էլ. փոստով օգտատեր արդեն կա' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Գրանցումը հաջողվեց' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ գրանցման ժամանակ' });
    }
});

// Փոխիր այսպես
app.use('/api/books', bookRoutes);
app.use('/api/posts', postRoutes);

app.post('/api/orders', async (req, res) => {
    try {
        const { name, phone, address, cartItems, total } = req.body;
        const orderDetails = cartItems.map(item => `- ${item.title} | ${item.quantity} հատ | ${item.price} ֏`).join('\n');
        const mailOptions = {
            from: "safaryanartak81@gmail.com",
            to: "safaryanartak81@gmail.com",
            subject: "Նոր պատվեր!",
            text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
        };
        transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Պատվերն ընդունված է!' });
    } catch (error) {
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
    console.log(`Սերվերը պտտվում է ${PORT} պորտի վրա...`);
});