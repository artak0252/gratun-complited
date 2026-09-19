// routes/sitemap.js
import express from 'express';
import Book from '../models/Book.js';
import Post from '../models/Post.js';
import Literature from '../models/Literature.js';
import Armenian from '../models/Armenian.js';
import Quote from '../models/Quote.js';

const router = express.Router();

const SITE_URL = 'https://www.gratunhub.am';

router.get('/sitemap.xml', async (req, res) => {
    try {
        // Երկուսն էլ զուգահեռ, որ ավելի արագ լինի
        const [books, posts, literatureItems, armenianItems, quotes] = await Promise.all([
            Book.find({}, '_id updatedAt'),
            Post.find({}, '_id updatedAt'),
            Literature.find({}, '_id updatedAt'),
            Armenian.find({}, '_id updatedAt'),
            Quote.find({}, 'author updatedAt')
        ]);

        const staticUrls = [
            { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
            { loc: `${SITE_URL}/shop`, priority: '0.9', changefreq: 'daily' },
            { loc: `${SITE_URL}/blog`, priority: '0.9', changefreq: 'daily' },
            { loc: `${SITE_URL}/quotes`, priority: '0.7', changefreq: 'weekly' },
            { loc: `${SITE_URL}/literature`, priority: '0.8', changefreq: 'daily' },
            { loc: `${SITE_URL}/armenian`, priority: '0.8', changefreq: 'daily' },
            { loc: `${SITE_URL}/thematic`, priority: '0.7', changefreq: 'weekly' },
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

        const literatureUrls = literatureItems.map(item => ({
            loc: `${SITE_URL}/literature/${item._id}`,
            lastmod: item.updatedAt ? item.updatedAt.toISOString() : undefined,
            priority: '0.6',
            changefreq: 'weekly'
        }));

        const armenianUrls = armenianItems.map(item => ({
            loc: `${SITE_URL}/armenian/${item._id}`,
            lastmod: item.updatedAt ? item.updatedAt.toISOString() : undefined,
            priority: '0.6',
            changefreq: 'weekly'
        }));

        // Հեղինակների անհատական էջեր (/quotes/:author). Դեդուպլիկացնում ենք
        // author անունով (case-insensitive), ինչպես quoteRoutes.js /authors/list-ում
        const authorsMap = new Map();
        quotes.forEach(quote => {
            const key = quote.author.trim().toLowerCase();
            const existing = authorsMap.get(key);
            if (!existing || (quote.updatedAt && quote.updatedAt > existing.updatedAt)) {
                authorsMap.set(key, { author: quote.author.trim(), updatedAt: quote.updatedAt });
            }
        });
        const authorUrls = Array.from(authorsMap.values()).map(({ author, updatedAt }) => ({
            loc: `${SITE_URL}/quotes/${encodeURIComponent(author)}`,
            lastmod: updatedAt ? updatedAt.toISOString() : undefined,
            priority: '0.5',
            changefreq: 'monthly'
        }));

        const allUrls = [...staticUrls, ...bookUrls, ...postUrls, ...literatureUrls, ...armenianUrls, ...authorUrls];

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