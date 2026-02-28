<<<<<<< HEAD
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
=======
module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Upcoming' },
        action: { type: DataTypes.STRING, defaultValue: '' }
    });
    return Event;
};
>>>>>>> feat/nimmi
