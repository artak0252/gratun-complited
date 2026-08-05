import mongoose from 'mongoose';

// Թեմատիկ գրքի երաշխավորություն. "եթե կորցրել եք հույսը, կարդացեք այս գիրքը"
// ձևի բլոկների համար։ Ձախից՝ գրքի նկար, աջից՝ թեմա + տեքստ։
const thematicBookSchema = new mongoose.Schema({
          theme: { type: String, required: true, trim: true }, // օր.՝ "Երբ կորցրել եք հույսը"
          text: { type: String, required: true, trim: true }, // admin-ի բացատրական տեքստը
          bookTitle: { type: String, required: true, trim: true },
          bookAuthor: { type: String, default: '', trim: true },
          image: { type: String, default: '' }, // գրքի կազմի նկար (ImageKit)
          // Ընտրովի հղում խանութի կոնկրետ գրքին (օր.՝ /shop/<bookId>) կամ ցանկացած URL
          link: { type: String, default: '', trim: true }
}, { timestamps: true });

export default mongoose.model('ThematicBook', thematicBookSchema);