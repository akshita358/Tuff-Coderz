module.exports = (sequelize, DataTypes) => {
    const Priority = sequelize.define('Priority', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        settingId: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        rank: { type: DataTypes.INTEGER, allowNull: false }
    });
    return Priority;
};
