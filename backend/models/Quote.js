import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    // Ընտրովի է. եթե admin-ը հեղինակի նկար չի վերբեռնում, frontend-ը
    // ցույց կտա generic icon/avatar
    authorImage: { type: String, default: '' },
    // Ընտրովի է. հեղինակի մասին կարճ կենսագրական տեղեկություն, օգտագործվում է
    // «Հեղինակներ» մանրամասն էջում (/quotes/:author)
    authorBio: { type: String, default: '', trim: true },
    // Ընտրովի է. հեղինակի ազգությունը (օր.՝ «Ֆրանսիացի»)
    authorNationality: { type: String, default: '', trim: true },
    // Ընտրովի է. հեղինակի ապրած ժամանակաշրջանը (օր.՝ «1883–1924»)
    authorEra: { type: String, default: '', trim: true }
}, { timestamps: true });

export default mongoose.model('Quote', quoteSchema);