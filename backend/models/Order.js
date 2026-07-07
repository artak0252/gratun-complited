import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
          book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
          title: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
          name: { type: String, required: true },
          phone: { type: String, required: true },
          address: { type: String, required: true },
          items: { type: [orderItemSchema], required: true },
          total: { type: Number, required: true },
          status: {
                    type: String,
                    enum: ['new', 'confirmed', 'shipped', 'completed', 'cancelled'],
                    default: 'new'
          },
          emailSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);