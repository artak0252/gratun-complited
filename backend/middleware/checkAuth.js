import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
          // Ստանում ենք թոքենը Authorization header-ից
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

          if (!token) return res.status(401).json({ message: 'Թոքենը բացակայում է' });

          try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
                    req.user = decoded; // Պահում ենք օգտվողի տվյալները
                    next();
          } catch (err) {
                    return res.status(403).json({ message: 'Թոքենը անվավեր է' });
          }
};