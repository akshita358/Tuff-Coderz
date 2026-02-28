import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cost: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  attendedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
