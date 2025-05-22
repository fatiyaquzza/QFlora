// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Class",
    {
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "classes",
      timestamps: false,
    }
  );
};
