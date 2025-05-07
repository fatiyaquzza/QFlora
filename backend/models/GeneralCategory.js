// models/GeneralCategory.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "GeneralCategory",
    {
      name: DataTypes.STRING,
      latin_name: DataTypes.STRING,
      image_url: DataTypes.TEXT,
      overview: DataTypes.TEXT,
    },
    {
      tableName: "general_categories",
      timestamps: false,
    }
  );
};
