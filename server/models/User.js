<<<<<<< HEAD
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
=======
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        avatar: { type: DataTypes.STRING, defaultValue: 'BB' },
        currentPoints: { type: DataTypes.INTEGER, defaultValue: 100 },
        spentPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
        dailyWellness: { type: DataTypes.INTEGER, defaultValue: 0 },
        lastPointsAllotment: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        needsWeeklyReset: { type: DataTypes.BOOLEAN, defaultValue: false }
    });
    return User;
};
>>>>>>> feat/nimmi
