import mongoose from 'mongoose';

// Առանց սրա, սխալ ձևաչափի :id-ով հարցումը (օր.՝ /api/books/abc) Mongoose-ում
// նետում է CastError, որը route-երի generic catch(error)-ը մշակում էր որպես
// 500 (Սերվերի սխալ)՝ user-ին ցույց տալով Mongoose-ի internal error message-ը։
// Իրականում սա user-ի սխալ հարցում է (400 Bad Request), ոչ թե սերվերի խնդիր,
// ուստի ավելի լավ է ստուգել դեռ DB-ին չդիմելուց առաջ։
export const validateObjectId = (req, res, next) => {
          if (!mongoose.isValidObjectId(req.params.id)) {
                    return res.status(400).json({ message: 'Անվավեր ID' });
          }
          next();
};