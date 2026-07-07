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
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import Book from './models/Book.js';
import Order from './models/Order.js';
import bookRoutes from './routes/bookRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { adminOnly } from './middleware/adminMiddleware.js';
import { checkAuth } from './middleware/checkAuth.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Render/Heroku և նման proxy-ների հետևում ենք, սա անհրաժեշտ է, որպեսզի
// express-rate-limit-ը և secure cookie-ները ճիշտ տեսնեն իրական protocol/IP-ն
app.set('trust proxy', 1);

app.use(cors({
    origin: ["https://gratun.am", "https://gratun-frontend.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());

// Cookie-ի կարգավորումները մեկ տեղում, որ login/logout-ը չտարբերվեն իրարից
const COOKIE_NAME = 'token';
const cookieOptions = {
    httpOnly: true,          // JS-ը (հետևաբար և XSS-ը) չի կարող կարդալ token-ը
    secure: isProd,          // production-ում միայն HTTPS-ով ուղարկվի
    sameSite: isProd ? 'none' : 'lax', // cross-site-ը (gratun.am <-> render backend) պահանջում է 'none'
    maxAge: 60 * 60 * 1000,  // 1 ժամ, նույնը ինչ JWT-ի expiresIn-ը
    path: '/',
};

// Փոքր, բայց կարևոր CSRF պաշտպանություն.
// Քանի որ cookie-ն այժմ ինքնաշխատ ուղարկվում է browser-ի կողմից,
// state-փոփոխող (POST/PUT/DELETE) հարցումների համար պահանջում ենք custom header,
// որը սովորական HTML ֆորմայի submit-ը (հնարավոր CSRF հարձակում) չի կարող դնել,
// բայց մեր frontend-ի axios instance-ը միշտ դնում է։
app.use((req, res, next) => {
    const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (mutatingMethods.includes(req.method) && req.headers['x-requested-with'] !== 'XMLHttpRequest') {
        return res.status(403).json({ message: 'Հայցը մերժված է (անվավեր origin)' });
    }
    next();
});

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

    // ԿԱՐԵՎՈՐ. username/password-ը պարտադիր պիտի string լինեն, այլապես
    // Mongo query object ({ "$ne": null } և նման բան) կարող է հասնել findOne-ին
    // (NoSQL injection ռիսկ)
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Անվավեր տվյալներ' });
    }

    // Երկու դեպքում էլ (username-ը գոյություն չունի, կամ password-ը սխալ է)
    // վերադարձնում ենք ՆՈՒՅՆ հաղորդագրությունը, որպեսզի ոչ ոք չկարողանա
    // հասկանալ՝ արդյոք տվյալ username-ը ընդհանրապես գոյություն ունի (user enumeration)
    const invalidCredsMsg = { message: 'Սխալ օգտանուն կամ գաղտնաբառ' };
    try {
        // ԿԱՐԵՎՈՐ. admin username-ը plain է (գաղտնիք չէ), բայց password-ը
        // այժմ պահվում է որպես bcrypt hash (ADMIN_PASSWORD_HASH), ոչ թե plaintext
        if (username === process.env.ADMIN_USERNAME) {
            const isAdminMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
            if (isAdminMatch) {
                const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie(COOKIE_NAME, token, cookieOptions);
                return res.json({ role: 'admin', message: 'Մուտքը հաջողված է' });
            }
            return res.status(401).json(invalidCredsMsg);
        }
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json(invalidCredsMsg);

        // ԿԱՐԵՎՈՐ. plaintext fallback-ը հեռացված է. բոլոր user-ները պիտի
        // արդեն bcrypt-ով հեշավորված գաղտնաբառ ունենան (տես migrate-passwords.js)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json(invalidCredsMsg);

        // Կարևոր. token-ի role-ը վերցնում ենք user-ի իրական role-ից, ոչ թե hardcoded 'admin'
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie(COOKIE_NAME, token, cookieOptions);
        res.json({ role: user.role, message: 'Մուտքը հաջողված է' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ' });
    }
});

// Frontend-ը սա կանչում է page load-ի ժամանակ, որպեսզի իմանա՝ արդյոք
// օգտատերը արդեն մուտք գործած է (cookie-ն httpOnly է, JS-ը ուղիղ չի կարող կարդալ)
app.get('/api/me', checkAuth, (req, res) => {
    res.json({ role: req.user.role || null });
});

// Դուրս գալը՝ պարզապես մաքրում ենք cookie-ն
app.post('/api/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
    res.json({ message: 'Դուրս եկաք' });
});

// Գրանցման route (Register.jsx-ը սպասում է սրան)
app.post('/api/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

        // ԿԱՐԵՎՈՐ. type ստուգում NoSQL injection-ից պաշտպանվելու համար
        // (այլապես username/email/password կարող են լինել Mongo query object)
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Անվավեր տվյալներ' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Գաղտնաբառը պետք է լինի առնվազն 8 նիշ' });
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

app.use('/api/books', bookRoutes);
app.use('/api/posts', postRoutes);

// Պաշտպանություն spam/flood պատվերներից.
// 15 րոպեում առավելագույնը 5 պատվեր մեկ IP-ից
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 րոպե
    max: 5,
    message: { message: 'Չափազանց շատ պատվերներ են ուղարկվել։ Խնդրում ենք փորձել 15 րոպե անց։' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.post('/api/orders', orderLimiter, async (req, res) => {
    try {
        const { name, phone, address, cartItems } = req.body;

        // Հիմնական validation. name/phone/address պարտադիր են, cartItems պիտի լինի ոչ դատարկ array
        if (!name || !phone || !address) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'Զամբյուղը դատարկ է' });
        }

        // ԿԱՐԵՎՈՐ. գները երբեք չենք վերցնում client-ից, միշտ նոր ենք հանում DB-ից,
        // որպեսզի ոչ ոք չկարողանա գները փոխել DevTools/ուղիղ API կանչով
        const bookIds = cartItems.map(item => item._id);
        const booksFromDb = await Book.find({ _id: { $in: bookIds } });

        let total = 0;
        const orderDetailsLines = [];
        const orderItems = [];

        for (const item of cartItems) {
            const dbBook = booksFromDb.find(b => b._id.toString() === item._id);
            if (!dbBook) {
                return res.status(400).json({ message: `Գիրքը (${item.title || item._id}) այլևս գոյություն չունի` });
            }

            const quantity = Number(item.quantity);
            if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100) {
                return res.status(400).json({ message: `Անվավեր քանակ գրքի համար՝ ${dbBook.title}` });
            }

            const lineTotal = dbBook.price * quantity;
            total += lineTotal;
            orderDetailsLines.push(`- ${dbBook.title} | ${quantity} հատ | ${dbBook.price} ֏ | ընդհանուր՝ ${lineTotal} ֏`);
            orderItems.push({
                book: dbBook._id,
                title: dbBook.title,
                price: dbBook.price,
                quantity
            });
        }

        // ԿԱՐԵՎՈՐ. պատվերը նախ պահվում է DB-ում, որպեսզի email-ի ցանկացած խնդիր
        // (spam folder, SMTP timeout, սխալ credentials) պատվերը չկորցնի
        const newOrder = await Order.create({
            name,
            phone,
            address,
            items: orderItems,
            total
        });

        const orderDetails = orderDetailsLines.join('\n');
        const mailOptions = {
            from: "safaryanartak81@gmail.com",
            to: "safaryanartak81@gmail.com",
            subject: "Նոր պատվեր!",
            text: `Հաճախորդ՝ ${name}\nՀեռախոս՝ ${phone}\nՀասցե՝ ${address}\nԸնդհանուր (հաշվարկված սերվերի կողմից)՝ ${total} ֏\n\nՊատվերներ՝\n${orderDetails}`
        };

        try {
            await transporter.sendMail(mailOptions);
            newOrder.emailSent = true;
            await newOrder.save();
        } catch (mailError) {
            // Email-ը ձախողվեց, բայց պատվերն արդեն DB-ում է՝ ոչինչ չի կորչում
            console.error('Email ուղարկելու սխալ (պատվերը պահված է DB-ում):', mailError.message);
        }

        res.status(200).json({ message: 'Պատվերն ընդունված է!', total, orderId: newOrder._id });
    } catch (error) {
        console.error('Պատվերի սխալ:', error.message);
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