// routes/sitemap.js
import express from 'express';
import Book from '../models/Book.js';
import Post from '../models/Post.js';

const router = express.Router();

const SITE_URL = 'https://www.gratunhub.am';

router.get('/sitemap.xml', async (req, res) => {
    try {
        // Երկուսն էլ զուգահեռ, որ ավելի արագ լինի
        const [books, posts] = await Promise.all([
            Book.find({}, '_id updatedAt'),
            Post.find({}, '_id updatedAt')
        ]);

        const staticUrls = [
            { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
            { loc: `${SITE_URL}/shop`, priority: '0.9', changefreq: 'daily' },
            { loc: `${SITE_URL}/blog`, priority: '0.9', changefreq: 'daily' },
            { loc: `${SITE_URL}/about`, priority: '0.5', changefreq: 'monthly' },
            { loc: `${SITE_URL}/contact`, priority: '0.5', changefreq: 'monthly' },
        ];

        // ԿԱՐԵՎՈՐ. URL-ը պիտի ճշգրիտ համընկնի frontend-ի ռոուտների հետ
        // (App.jsx-ում՝ /shop/:id և /blog/:id), այլապես Google-ը կինդեքսավորի
        // 404 արտադրող հասցեներ
        const bookUrls = books.map(book => ({
            loc: `${SITE_URL}/shop/${book._id}`,
            lastmod: book.updatedAt ? book.updatedAt.toISOString() : undefined,
            priority: '0.8',
            changefreq: 'weekly'
        }));

        const postUrls = posts.map(post => ({
            loc: `${SITE_URL}/blog/${post._id}`,
            lastmod: post.updatedAt ? post.updatedAt.toISOString() : undefined,
            priority: '0.7',
            changefreq: 'weekly'
        }));

        const allUrls = [...staticUrls, ...bookUrls, ...postUrls];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        allUrls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${url.loc}</loc>\n`;
            if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
            xml += `    <priority>${url.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap generation error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
