import jwt from 'jsonwebtoken';

export const adminOnly = (req, res, next) => {
          // Ստանում ենք թոքենը header-ից
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
                    return res.status(403).json({ message: "Մուտքը մերժված է, թոքենը բացակայում է" });
          }

          try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

                    // Ստուգում ենք՝ արդյո՞ք դերը 'admin' է
                    if (decoded.role !== 'admin') {
                              return res.status(403).json({ message: "Միայն ադմինը կարող է կատարել այս գործողությունը" });
                    }

                    // Պահում ենք օգտատիրոջ տվյալները req-ի մեջ, որպեսզի հասանելի լինի հաջորդ ֆունկցիաներին
                    req.user = decoded;

                    // Եթե ադմին է, շարունակում ենք
                    next();
          } catch (err) {
                    return res.status(401).json({ message: "Անվավեր կամ ժամկետանց թոքեն" });
          }
};