module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        autoAdjust: { type: DataTypes.BOOLEAN, defaultValue: false },
        emailReminders: { type: DataTypes.BOOLEAN, defaultValue: false },
        eventAlerts: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklySummary: { type: DataTypes.BOOLEAN, defaultValue: false },
        twoFactor: { type: DataTypes.BOOLEAN, defaultValue: false }
    });
    return Setting;
};
