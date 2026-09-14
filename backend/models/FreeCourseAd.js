import mongoose from 'mongoose';

// «Անվճար դասընթաց» popup գովազդը. singleton (միշտ միայն մեկ ակտիվ
// տարբերակ, ինչպես DailyDigest-ը) — admin-ը կարող է թարմացնել
// նկարը/վերնագիրը/տեքստը/գրանցման հղումը (Google Docs) admin panel-ից։
const freeCourseAdSchema = new mongoose.Schema({
          image: { type: String, required: true },
          title: { type: String, trim: true, default: '' },
          description: { type: String, trim: true, default: '' },
          // Գրանցման հղումը (Google Docs/Forms)
          link: { type: String, trim: true, required: true }
}, { timestamps: true });

export default mongoose.model('FreeCourseAd', freeCourseAdSchema);