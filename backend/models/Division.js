// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Division",
    {
      superdivision_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "divisions",
      timestamps: false,
    }
  );
};
