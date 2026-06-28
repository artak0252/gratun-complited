import jwt from 'jsonwebtoken';

export const adminOnly = (req, res, next) => {
          const authHeader = req.headers.authorization;

          if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return res.status(401).json({ message: "Մուտքը մերժված է, տոկեն չկա" });
          }

          const token = authHeader.split(' ')[1];

          try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    // Այստեղ ստուգում ենք role-ը
                    if (decoded.role === 'admin') {
                              next(); // Ամեն ինչ նորմալ է, թույլատրում ենք
                    } else {
                              return res.status(403).json({ message: "Միայն ադմինները կարող են" });
                    }
          } catch (err) {
                    return res.status(403).json({ message: "Անվավեր տոկեն" });
          }
};