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
