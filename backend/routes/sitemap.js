// routes/sitemap.js
import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
          try {
                    const books = await Book.find({}, '_id updatedAt'); // կամ slug, եթե ունես

                    const staticUrls = [
                              { loc: 'https://www.gratunhub.am/', priority: '1.0', changefreq: 'daily' },
                              { loc: 'https://www.gratunhub.am/books', priority: '0.9', changefreq: 'daily' },
                              // ավելացրու մնացած static էջերը (About, Contact և այլն)
                    ];

                    const bookUrls = books.map(book => ({
                              loc: `https://www.gratunhub.am/book/${book._id}`, // փոխիր, եթե slug ես օգտագործում
                              lastmod: book.updatedAt ? book.updatedAt.toISOString() : undefined,
                              priority: '0.8',
                              changefreq: 'weekly'
                    }));

                    const allUrls = [...staticUrls, ...bookUrls];

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