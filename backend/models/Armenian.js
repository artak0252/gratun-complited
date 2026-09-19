import mongoose from 'mongoose';

// "Հայ և հայկական" բաժնի նյութեր. Ընդհանուր, Գրականություն, Պատմություն,
// Երաժշտություն, Արվեստ, Մշակույթ (հոգևոր), Հայ հայտնիներ։ Կառուցվածքով
// ամբողջությամբ նման է Literature.js-ին (title/excerpt/content/image),
// միայն category enum-ը տարբեր է։
const armenianSchema = new mongoose.Schema({
          title: { type: String, required: true, trim: true },
          category: {
                    type: String,
                    required: true,
                    // Այստեղ դնում ենք այն ID-ները, որոնք օգտագործում ենք ֆրոնտենդում
                    enum: ['general', 'literature', 'history', 'music', 'art', 'culture', 'celebrities']
          },
          author: { type: String, default: '', trim: true },
          excerpt: { type: String, required: true, trim: true },
          content: { type: String, required: true },
          image: { type: String, required: true },
          date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Armenian', armenianSchema);