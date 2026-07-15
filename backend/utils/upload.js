import multer from 'multer';

// Մեկ, ընդհանուր multer կարգավորում ամբողջ backend-ի համար (bookRoutes.js-ի
// և postRoutes.js-ի կրկնված կոդի փոխարեն)։
// memoryStorage-ը կարևոր է, որպեսզի ֆայլը չպահվի սերվերի վրա, այլ ուղիղ
// փոխանցվի ImageKit-ին։ Սահմանափակում ենք միայն նկարներով և առավելագույնը
// 5ՄԲ, որպեսզի admin token-ի leak-ի դեպքում էլ չկարողանան վնասակար կամ
// չափազանց մեծ ֆայլեր վերբեռնել։
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5ՄԲ
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Թույլատրվում են միայն նկարներ (jpg, png, webp, gif)'));
        }
    }
});

export default upload;
