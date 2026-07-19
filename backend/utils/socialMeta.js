import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.gratunhub.am';
const SITE_NAME = 'Գրատուն';

// User-Agent-ներ, որոնք ՉԵՆ կատարում JavaScript, ուստի պետք է
// server-side-ում իսկ ստանան ճիշտ meta tags-ը (link preview-ի համար)
const CRAWLER_UA_REGEX =
          /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Pinterest|Discordbot|SkypeUriPreview|vkShare|viber/i;

export const isSocialCrawler = (userAgent = '') => CRAWLER_UA_REGEX.test(userAgent);

const escapeHtml = (str = '') =>
          String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');

let cachedTemplate = null;
const getTemplate = (buildDir) => {
          if (cachedTemplate) return cachedTemplate;
          const indexPath = path.join(buildDir, 'index.html');
          cachedTemplate = fs.readFileSync(indexPath, 'utf-8');
          return cachedTemplate;
};

/**
 * Ընդունում է build-ի index.html template-ը և փոխարինում է title/description/OG/Twitter
 * tags-ը՝ տրված գրքի կամ հոդվածի տվյալներով, crawler-ների համար։
 */
export const renderSocialHtml = (buildDir, { title, description, image, url, type = 'website' }) => {
          const template = getTemplate(buildDir);
          const safeTitle = escapeHtml(`${title} | ${SITE_NAME}`);
          const safeDescription = escapeHtml(
                    description && description.length > 160 ? `${description.slice(0, 157)}...` : description
          );
          const safeImage = escapeHtml(image);
          const safeUrl = escapeHtml(url);

          let html = template;

          html = html.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`);
          html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${safeDescription}" />`);
          html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${safeUrl}" />`);
          html = html.replace(/<meta property="og:type" content=".*?"\s*\/>/, `<meta property="og:type" content="${type}" />`);
          html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${safeTitle}" />`);
          html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${safeDescription}" />`);
          html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${safeUrl}" />`);
          html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="${safeImage}" />`);
          html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${safeTitle}" />`);
          html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${safeDescription}" />`);
          html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="${safeImage}" />`);

          return html;
};

export { SITE_URL };