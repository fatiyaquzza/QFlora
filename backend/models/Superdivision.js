// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Class",
      {
        subkingdom_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: DataTypes.STRING,
      },
      {
        tableName: "superdivisions",
        timestamps: false,
      }
    );
  };
  