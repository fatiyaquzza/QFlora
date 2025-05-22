// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Species",
    {
      genus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "species",
      timestamps: false,
    }
  );
};
