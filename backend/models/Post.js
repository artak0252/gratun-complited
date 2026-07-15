
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: {
        type: String,
        required: true,
        // Այստեղ դնում ենք այն ID-ները, որոնք օգտագործում ենք ֆրոնտենդում
        enum: ['history', 'philosophy', 'literature-hy', 'literature-foreign', 'spiritual']
    },
    image: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);