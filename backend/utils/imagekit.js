import ImageKit from 'imagekit';

// Մեկ, ընդհանուր ImageKit instance ամբողջ backend-ի համար՝ որպեսզի
// bookRoutes.js և postRoutes.js կրկնված init կոդ չունենան։
// ԿԱՐԵՎՈՐ. fallback key-եր չկան միտումնավոր. եթե env փոփոխականները
// բացակայում են, upload-ը պիտի հստակ ձախողվի, ոչ թե լուռ սխալ key-երով աշխատի
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit;
