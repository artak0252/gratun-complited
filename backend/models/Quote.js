import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    // Ընտրովի է. եթե admin-ը հեղինակի նկար չի վերբեռնում, frontend-ը
    // ցույց կտա generic icon/avatar
    authorImage: { type: String, default: '' },
    // Ընտրովի է. հեղինակի մասին կարճ կենսագրական տեղեկություն, օգտագործվում է
    // նոր «Հեղինակներ» բաժնում (/authors). Չի ազդում ներկայիս մեջբերումների
    // քարտի տեսքի վրա՝ Quotes.jsx-ը այս դաշտը երբեք չի ցուցադրում
    authorBio: { type: String, default: '', trim: true }
}, { timestamps: true });

export default mongoose.model('Quote', quoteSchema);