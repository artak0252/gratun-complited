import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
          name: { type: String, required: true },
          email: { type: String, required: true },
          subject: { type: String, default: '' },
          text: { type: String, required: true },
          emailSent: { type: Boolean, default: false },
          isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);