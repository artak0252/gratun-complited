import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    // Ընտրովի է. եթե admin-ը հեղինակի նկար չի վերբեռնում, frontend-ը
    // ցույց կտա generic icon/avatar
    authorImage: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Quote', quoteSchema);
