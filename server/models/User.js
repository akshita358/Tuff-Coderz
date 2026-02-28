import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  priorities: { type: [String], default: ['Academics', 'Skills', 'Co-Curricular'] },
  weeklyBudget: { type: Number, default: 100 },
  pointsUsed: { type: Number, default: 0 },
  pointsLeft: { type: Number, default: 100 },
  eventsAttended: [{
    name: String,
    category: String,
    cost: Number,
    bonus: Number,
    attendedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
