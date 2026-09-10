import mongoose from 'mongoose';

// Մեկ բաժնի (օր.՝ "Կինո", "Սպորտ") տվյալները
const digestItemSchema = new mongoose.Schema({
          category: { type: String, required: true, trim: true },   // օր.՝ "Կինո"
          icon: { type: String, required: true, trim: true },        // բանալի, տես frontend-ի ICONS map-ը
          title: { type: String, required: true, trim: true },       // թավ վերնագիրը
          text: { type: String, required: true, trim: true }         // 1-2 նախադասությամբ նկարագրությունը
}, { _id: false });

const dailyDigestSchema = new mongoose.Schema({
          // Ցուցադրվող ամսաթիվը, ազատ ֆորմատով (օր.՝ "Սեպտեմբեր 10, 2026")
          date: { type: String, required: true, trim: true },
          items: {
                    type: [digestItemSchema],
                    validate: {
                              validator: (arr) => Array.isArray(arr) && arr.length > 0 && arr.length <= 9,
                              message: 'Պետք է լինի 1-ից 9 բաժին'
                    }
          }
}, { timestamps: true });

// "Օրը մեկ էջում" միշտ ունենում է միայն մեկ ակտիվ տարբերակ (singleton).
// ամեն նոր POST-ի ժամանակ նախորդը ավտոմատ ջնջվում է route-ի մակարդակում։
export default mongoose.model('DailyDigest', dailyDigestSchema);