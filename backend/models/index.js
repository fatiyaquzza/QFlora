// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User")(sequelize, Sequelize.DataTypes);
const PlantType = require("./PlantType")(sequelize, Sequelize.DataTypes);
const SpecificPlant = require("./SpecificPlant")(sequelize, Sequelize.DataTypes);
const Favorite = require("./Favorite")(sequelize, Sequelize.DataTypes);
const GeneralCategory = require("./GeneralCategory")(sequelize, Sequelize.DataTypes);
const GeneralCategoryVerse = require("./GeneralCategoryVerse")(sequelize, Sequelize.DataTypes);
const SpecificPlantVerse = require("./SpecificPlantVerse")(sequelize, Sequelize.DataTypes);
const SpecificPlantClassification = require("./SpecificPlantClassification")(sequelize, Sequelize.DataTypes);
const GeneralFavorite = require("./GeneralFavorite")(sequelize, Sequelize.DataTypes);
const Suggestion = require("./Suggestion")(sequelize, Sequelize.DataTypes);
const Subkingdom = require("./Subkingdom")(sequelize, Sequelize.DataTypes);
const Superdivision = require("./Superdivision")(sequelize, Sequelize.DataTypes);
const Division = require("./Division")(sequelize, Sequelize.DataTypes);
const Class = require("./Class")(sequelize, Sequelize.DataTypes);
const Subclass = require("./Subclass")(sequelize, Sequelize.DataTypes);
const Order = require("./Order")(sequelize, Sequelize.DataTypes);
const Family = require("./Family")(sequelize, Sequelize.DataTypes);
const Genus = require("./Genus")(sequelize, Sequelize.DataTypes);
const Species = require("./Species")(sequelize, Sequelize.DataTypes);

// Relasi PlantType dengan SpecificPlant
PlantType.hasMany(SpecificPlant, {
  foreignKey: "plant_type_id",
  as: "plants"
});

SpecificPlant.belongsTo(PlantType, {
  foreignKey: "plant_type_id",
  as: "plant_type"
});

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

// Relasi SpecificPlant dan SpecificPlantClassification
SpecificPlant.hasMany(SpecificPlantClassification, {
  foreignKey: "specific_plant_id",
  as: "classifications",
});

SpecificPlantClassification.belongsTo(SpecificPlant, {
  foreignKey: "specific_plant_id",
});

// Relasi Favorite dengan SpecificPlant
Favorite.belongsTo(SpecificPlant, {
  foreignKey: "specific_plant_id",
  as: "SpecificPlant",
});

SpecificPlant.hasMany(Favorite, {
  foreignKey: "specific_plant_id",
});

Favorite.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(GeneralFavorite, { foreignKey: "user_id" });
GeneralFavorite.belongsTo(User, { foreignKey: "user_id" });

GeneralFavorite.belongsTo(GeneralCategory, {
  foreignKey: "general_category_id",
  as: "GeneralCategory",
});
GeneralCategory.hasMany(GeneralFavorite, {
  foreignKey: "general_category_id",
});

Suggestion.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Suggestion, { foreignKey: "user_id" });

//KLASIFIKASI

Subkingdom.hasMany(Superdivision, {
  foreignKey: "subkingdom_id",
});

Superdivision.belongsTo(Subkingdom, {
  foreignKey: "subkingdom_id",
  as: "fk_subkingdom",
});

Superdivision.hasMany(Division, {
  foreignKey: "superdivision_id",
});

Division.belongsTo(Superdivision, {
  foreignKey: "superdivision_id",
  as: "fk_superdivision",
});

Division.hasMany(Class, {
  foreignKey: "division_id",
});

Class.belongsTo(Division, {
  foreignKey: "division_id",
  as: "fk_division",
});

Class.hasMany(Subclass, {
  foreignKey: "class_id",
});

Subclass.belongsTo(Class, {
  foreignKey: "class_id",
  as: "fk_class",
});

Subclass.hasMany(Order, {
  foreignKey: "subclass_id",
});

Order.belongsTo(Subclass, {
  foreignKey: "subclass_id",
  as: "fk_subclass",
});

Order.hasMany(Family, {
  foreignKey: "order_id",
});

Family.belongsTo(Order, {
  foreignKey: "order_id",
  as: "fk_order",
});

Family.hasMany(Genus, {
  foreignKey: "family_id",
});

Genus.belongsTo(Family, {
  foreignKey: "family_id",
  as: "fk_family",
});

Genus.hasMany(Species, {
  foreignKey: "genus_id",
});

Species.belongsTo(Genus, {
  foreignKey: "genus_id",
  as: "fk_genus",
});

SpecificPlant.belongsTo(Species, {
  foreignKey: "species_id",
  as: "fk_species",
});

Species.hasMany(SpecificPlant, {
  foreignKey: "species_id",
});

module.exports = {
  sequelize,
  User,
  PlantType,
  SpecificPlant,
  SpecificPlantVerse,
  SpecificPlantClassification,
  Favorite,
  GeneralCategory,
  GeneralCategoryVerse,
  GeneralFavorite,
  Suggestion,
  Class,
  Division,
  Family,
  Genus,
  Order,
  Species,
  Subclass,
  Subkingdom,
  Superdivision,
};
