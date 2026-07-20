import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.gratunhub.am';
const SITE_NAME = 'Գրատուն';
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;
const DEFAULT_DESCRIPTION =
          'Գրատուն — առցանց գրախանութ, որտեղ կարող եք գտնել և պատվիրել գրքեր տարբեր ժանրերով, ինչպես նաև կարդալ հոդվածներ գրականության, փիլիսոփայության և հոգևոր թեմաներով։';

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
 * Ընդունում է build-ի index.html template-ը և տրված placeholder comment-ի տեղում
 * ներդնում է title/description/OG/Twitter tags-ը՝ crawler-ների համար։
 * (index.html-ը այլևս static SEO tags չունի՝ որպեսզի client-side-ում
 * react-helmet-async-ը կրկնակի <title> չստեղծի)
 */
export const renderSocialHtml = (buildDir, { title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, url = SITE_URL, type = 'website' }) => {
          const template = getTemplate(buildDir);
          const safeTitle = escapeHtml(title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Գրախանութ Online`);
          const safeDescription = escapeHtml(
                    description && description.length > 160 ? `${description.slice(0, 157)}...` : description
          );
          const safeImage = escapeHtml(image);
          const safeUrl = escapeHtml(url);

          const metaBlock = `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:locale" content="hy_AM" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    `;

          // Եթե placeholder comment-ը կա (նոր build), ներդնում ենք հենց այնտեղ.
          // հակառակ դեպքում (հին build/cache) ապահով fallback՝ </head>-ից առաջ ներդնել
          const placeholder = '<!-- SEO_META_PLACEHOLDER: title/description/canonical/OG/Twitter tags are injected\n         here — client-side by react-helmet-async (see src/components/Seo.jsx), and\n         server-side for social crawlers (see backend/utils/socialMeta.js) -->';

          if (template.includes(placeholder)) {
                    return template.replace(placeholder, metaBlock);
          }
          return template.replace('</head>', `${metaBlock}\n  </head>`);
};

export { SITE_URL };