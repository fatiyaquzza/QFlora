// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Class",
      {
        name: DataTypes.STRING,
      },
      {
        tableName: "subkingdoms",
        timestamps: false,
      }
    );
  };
  