import jwt from 'jsonwebtoken';

// Ընդհանուր (ոչ admin-only) middleware. Օգտագործվում է, օրինակ, /api/me-ի համար,
// որպեսզի logged-in ցանկացած օգտատեր (admin կամ author) կարողանա ստուգել իր session-ը։
export const checkAuth = (req, res, next) => {
          // Token-ն այժմ գալիս է httpOnly cookie-ից, ոչ թե Authorization header-ից
          const token = req.cookies?.token;

          if (!token) return res.status(401).json({ message: 'Մուտք չկա' });

          try {
                    // Կարևոր. ոչ մի fallback secret. Եթե JWT_SECRET-ը env-ում սահմանված չէ,
                    // ավելի լավ է սերվերը սխալ նետի, քան լուռ աշխատի կանխատեսելի բանալիով
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    req.user = decoded; // Պահում ենք օգտվողի տվյալները
                    next();
          } catch (err) {
                    return res.status(403).json({ message: 'Անվավեր կամ ժամկետանց մուտք' });
          }
};