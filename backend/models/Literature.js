import mongoose from 'mongoose';

// "Գրականություն" բաժնի նյութեր. Պոեզիա, Առակներ, Հեքիաթներ,
// Մանկական բանաստեղծություններ, Հանելուկներ։ Կառուցվածքով նման է Post.js-ին
// (title/excerpt/content/image), միայն category enum-ը տարբեր է, և ունի
// երկու լրացուցիչ ընտրովի դաշտ՝ author (հեղինակ, ժողովրդական դեպքում դատարկ)
// և answer (միայն Հանելուկներ կատեգորիայի համար՝ պատասխանը)։
const literatureSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        // Այստեղ դնում ենք այն ID-ները, որոնք օգտագործում ենք ֆրոնտենդում
        enum: ['poetry', 'fables', 'fairytales', 'childrens-poems', 'riddles']
    },
    author: { type: String, default: '', trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    // Միայն "Հանելուկներ" կատեգորիայի նյութերի համար օգտագործվող՝ ընտրովի պատասխան
    answer: { type: String, default: '', trim: true },
    image: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Literature', literatureSchema);
