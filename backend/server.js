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
import quoteRoutes from './routes/quoteRoutes.js';
import sitemapRouter from './routes/sitemap.js';
import Post from './models/Post.js';
import { isSocialCrawler, renderSocialHtml, SITE_URL } from './utils/socialMeta.js';
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
    origin: ["https://gratunhub.am", "https://www.gratunhub.am", "https://gratun-frontend.onrender.com"],
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

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Անվավեր տվյալներ' });
    }

    const invalidCredsMsg = { message: 'Սխալ օգտանուն կամ գաղտնաբառ' };
    try {
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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json(invalidCredsMsg);

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie(COOKIE_NAME, token, cookieOptions);
        res.json({ role: user.role, message: 'Մուտքը հաջողված է' });
    } catch (error) {
        res.status(500).json({ message: 'Սերվերի սխալ' });
    }
});

app.get('/api/me', checkAuth, (req, res) => {
    res.json({ role: req.user.role || null });
});

app.post('/api/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
    res.json({ message: 'Դուրս եկաք' });
});

app.post('/api/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }

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
app.use('/api/quotes', quoteRoutes);
app.use('/', sitemapRouter);

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

        if (!name || !phone || !address) {
            return res.status(400).json({ message: 'Լրացրու բոլոր դաշտերը' });
        }
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'Զամբյուղը դատարկ է' });
        }

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
            console.error('Email ուղարկելու սխալ (պատվերը պահված է DB-ում):', mailError.message);
        }

        res.status(200).json({ message: 'Պատվերն ընդունված է!', total, orderId: newOrder._id });
    } catch (error) {
        console.error('Պատվերի սխալ:', error.message);
        res.status(500).json({ message: "Սխալ պատվերի ժամանակ" });
    }
});

const FRONTEND_BUILD_DIR = path.join(__dirname, '../frontend/build');

// Այս 2 route-երը միայն social-media crawler-ների համար են (Facebook, WhatsApp,
// Twitter/X, Telegram, LinkedIn և այլն), որոնք JavaScript չեն կատարում, ուստի
// React-ի client-side meta tags-ը (react-helmet-async) նրանց համար անտեսանելի են։
// Իրական users-ի (և Google-ի, որը JS-ը render է անում) համար next()-ով
// անցնում ենք սովորական static+SPA serving-ին ներքևում։
app.get('/shop/:id', async (req, res, next) => {
    if (!isSocialCrawler(req.headers['user-agent'])) return next();
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return next();
        const image = book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`;
        const html = renderSocialHtml(FRONTEND_BUILD_DIR, {
            title: `${book.title} — ${book.author}`,
            description: book.description || `${book.title}, հեղինակ՝ ${book.author}։ Պատվիրեք հիմա Գրատուն առցանց գրախանութից։`,
            image,
            url: `${SITE_URL}/shop/${book._id}`,
            type: 'product',
        });
        res.send(html);
    } catch (error) {
        next();
    }
});

app.get('/blog/:id', async (req, res, next) => {
    if (!isSocialCrawler(req.headers['user-agent'])) return next();
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return next();
        const image = post.image.startsWith('http') ? post.image : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`;
        const html = renderSocialHtml(FRONTEND_BUILD_DIR, {
            title: post.title,
            description: post.excerpt || post.content?.slice(0, 160),
            image,
            url: `${SITE_URL}/blog/${post._id}`,
            type: 'article',
        });
        res.send(html);
    } catch (error) {
        next();
    }
});

// Homepage/listing էջերի (/, /shop, /blog, /about, /contact) համար crawler-ներին
// ուղարկում ենք default site-wide meta tags-ով HTML (նույն template-ը, առանց
// կոնկրետ գրքի/հոդվածի տվյալների)
app.get(['/', '/shop', '/blog', '/about', '/contact'], (req, res, next) => {
    if (!isSocialCrawler(req.headers['user-agent'])) return next();
    const html = renderSocialHtml(FRONTEND_BUILD_DIR, { url: `${SITE_URL}${req.path === '/' ? '/' : req.path}` });
    res.send(html);
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(FRONTEND_BUILD_DIR));
    app.get('*', (req, res) => {
        res.sendFile(path.join(FRONTEND_BUILD_DIR, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Սերվերը պտտվում է ${PORT} պորտի վրա...`);
});