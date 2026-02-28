const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize SQLite Database with Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false, // Set to console.log to see SQL queries
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.User = require('./User')(sequelize, DataTypes);
db.Setting = require('./Setting')(sequelize, DataTypes);
db.Event = require('./Event')(sequelize, DataTypes);
db.Priority = require('./Priority')(sequelize, DataTypes);

// Associations

// 1 User has 1 Setting
db.User.hasOne(db.Setting, { foreignKey: 'userId', as: 'settings', onDelete: 'CASCADE' });
db.Setting.belongsTo(db.User, { foreignKey: 'userId' });

// 1 User has Many Events
db.User.hasMany(db.Event, { foreignKey: 'userId', as: 'events', onDelete: 'CASCADE' });
db.Event.belongsTo(db.User, { foreignKey: 'userId' });

// 1 Setting has Many Priorities (Max 3 usually)
db.Setting.hasMany(db.Priority, { foreignKey: 'settingId', as: 'priorities', onDelete: 'CASCADE' });
db.Priority.belongsTo(db.Setting, { foreignKey: 'settingId' });

module.exports = db;
