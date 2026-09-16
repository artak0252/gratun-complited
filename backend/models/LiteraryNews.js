import mongoose from 'mongoose';

// «Գրական նորություններ» բաժնի մոդելը (նախկին DailyDigest-ի փոխարեն)։
// Ի տարբերություն DailyDigest-ի, սա singleton չէ. ադմինը կարող է հրապարակել
// մի քանի նորություն, և դրանք ցուցադրվում են ցանկով, ամենավերջինը վերևում։
const literaryNewsSchema = new mongoose.Schema({
          // Նորության վերնագիր
          title: { type: String, required: true, trim: true },
          // Նորության տեքստը/բովանդակությունը
          content: { type: String, required: true, trim: true },
          // Ընտրովի ցուցադրվող ամսաթիվ/տեքստ (օր.՝ "Սեպտեմբեր 16, 2026").
          // Եթե դատարկ է թողնված, frontend-ը ցուցադրում է createdAt-ից բխեցված ամիս/օր
          date: { type: String, trim: true, default: '' },
          // Ծածկող նկար՝ ընտրովի (ձախ կողմում ցուցադրվելու համար)
          image: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('LiteraryNews', literaryNewsSchema);