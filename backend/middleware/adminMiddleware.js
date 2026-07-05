import jwt from 'jsonwebtoken';

export const adminOnly = (req, res, next) => {
          // Token-ն այժմ գալիս է httpOnly cookie-ից, ոչ թե Authorization header-ից.
          // Այսպես frontend JS-ը (և հետևաբար XSS-ը) ընդհանրապես մուտք չունի token-ին։
          const token = req.cookies?.token;

          if (!token) {
                    return res.status(401).json({ message: "Մուտքը մերժված է, տոկեն չկա" });
          }

          try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    // Այստեղ ստուգում ենք role-ը
                    if (decoded.role === 'admin') {
                              req.user = decoded;
                              next(); // Ամեն ինչ նորմալ է, թույլատրում ենք
                    } else {
                              return res.status(403).json({ message: "Միայն ադմինները կարող են" });
                    }
          } catch (err) {
                    return res.status(403).json({ message: "Անվավեր տոկեն" });
          }
};