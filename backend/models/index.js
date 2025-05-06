const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const GeneralCategory = require('./GeneralCategory')(sequelize, Sequelize.DataTypes);
const SpecificPlant = require('./SpecificPlant')(sequelize, Sequelize.DataTypes);
const Favorite = require('./Favorite')(sequelize, Sequelize.DataTypes);

// Relasi
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

SpecificPlant.hasMany(Favorite, { foreignKey: 'specific_plant_id' });
Favorite.belongsTo(SpecificPlant, { foreignKey: 'specific_plant_id' });

module.exports = {
  sequelize,
  User,
  GeneralCategory,
  SpecificPlant,
  Favorite
};
