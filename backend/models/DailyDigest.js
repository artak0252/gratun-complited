import mongoose from 'mongoose';

const dailyDigestSchema = new mongoose.Schema({
          // Ընտրովի ամսաթվի/վերնագրի տեքստ, ցուցադրվում է նկարների վերևում, եթե լրացված է
          date: { type: String, trim: true, default: '' },
          leftImage: { type: String, required: true },
          rightImage: { type: String, required: true }
}, { timestamps: true });

// "Օրը մեկ էջում" միշտ ունենում է միայն մեկ ակտիվ տարբերակ (singleton).
// ամեն նոր POST-ի ժամանակ նախորդը ավտոմատ ջնջվում է route-ի մակարդակում։
export default mongoose.model('DailyDigest', dailyDigestSchema);