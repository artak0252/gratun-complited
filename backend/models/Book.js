import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  genre: { type: String, required: true, default: "other" },
  image: { type: String, default: "https://via.placeholder.com/150" }
});

export default mongoose.model('Book', bookSchema);