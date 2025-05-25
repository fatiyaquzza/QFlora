// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

// Define all models and add them to the db object
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.PlantType = require("./PlantType")(sequelize, Sequelize.DataTypes);
db.SpecificPlant = require("./SpecificPlant")(sequelize, Sequelize.DataTypes);
db.Favorite = require("./Favorite")(sequelize, Sequelize.DataTypes);
db.GeneralCategory = require("./GeneralCategory")(sequelize, Sequelize.DataTypes);
db.GeneralCategoryVerse = require("./GeneralCategoryVerse")(sequelize, Sequelize.DataTypes);
db.SpecificPlantVerse = require("./SpecificPlantVerse")(sequelize, Sequelize.DataTypes);
db.SpecificPlantClassification = require("./SpecificPlantClassification")(sequelize, Sequelize.DataTypes);
db.GeneralFavorite = require("./GeneralFavorite")(sequelize, Sequelize.DataTypes);
db.Suggestion = require("./Suggestion")(sequelize, Sequelize.DataTypes);
db.SuggestionType = require("./SuggestionType")(sequelize, Sequelize.DataTypes);
db.Subkingdom = require("./Subkingdom")(sequelize, Sequelize.DataTypes);
db.Superdivision = require("./Superdivision")(sequelize, Sequelize.DataTypes);
db.Division = require("./Division")(sequelize, Sequelize.DataTypes);
db.Class = require("./Class")(sequelize, Sequelize.DataTypes);
db.Subclass = require("./Subclass")(sequelize, Sequelize.DataTypes);
db.Order = require("./Order")(sequelize, Sequelize.DataTypes);
db.Family = require("./Family")(sequelize, Sequelize.DataTypes);
db.Genus = require("./Genus")(sequelize, Sequelize.DataTypes);
db.Species = require("./Species")(sequelize, Sequelize.DataTypes);
db.ChemicalComponent = require("./ChemicalComponent")(sequelize, Sequelize.DataTypes);
db.SpecificPlantChemicalComponent = require("./SpecificPlantChemicalComponent")(sequelize, Sequelize.DataTypes);

// Call associate on each model, ensuring 'db' (the collection of all models) is passed
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db); // This is where associations defined in model files are linked
  }
});

db.sequelize = sequelize; 
db.Sequelize = Sequelize; // Also export Sequelize class for convenience

module.exports = db;
