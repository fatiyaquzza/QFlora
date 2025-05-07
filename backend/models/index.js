// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User")(sequelize, Sequelize.DataTypes);

const SpecificPlant = require("./SpecificPlant")(
  sequelize,
  Sequelize.DataTypes
);
const Favorite = require("./Favorite")(sequelize, Sequelize.DataTypes);

const GeneralCategory = require("./GeneralCategory")(
  sequelize,
  Sequelize.DataTypes
);

const GeneralCategoryVerse = require("./GeneralCategoryVerse")(
  sequelize,
  Sequelize.DataTypes
);

const SpecificPlantVerse = require("./SpecificPlantVerse")(
  sequelize,
  Sequelize.DataTypes
);

const SpecificPlantClassification = require("./SpecificPlantClassification")(
  sequelize,
  Sequelize.DataTypes
);

// Relasi
GeneralCategory.hasMany(GeneralCategoryVerse, {
  foreignKey: "general_category_id",
  as: "verses",
});

GeneralCategoryVerse.belongsTo(GeneralCategory, {
  foreignKey: "general_category_id",
});

SpecificPlant.hasMany(SpecificPlantVerse, {
  foreignKey: "specific_plant_id",
  as: "verses",
});

SpecificPlantVerse.belongsTo(SpecificPlant, {
  foreignKey: "specific_plant_id",
});

SpecificPlant.hasMany(SpecificPlantClassification, {
  foreignKey: "specific_plant_id",
  as: "classifications",
});

SpecificPlantClassification.belongsTo(SpecificPlant, {
  foreignKey: "specific_plant_id",
});

module.exports = {
  sequelize,
  User,
  SpecificPlant,
  SpecificPlantVerse,
  SpecificPlantClassification,
  Favorite,
  GeneralCategory,
  GeneralCategoryVerse,
};
