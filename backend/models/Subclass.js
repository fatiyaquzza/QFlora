// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Subclass",
      {
        class_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: DataTypes.STRING,
      },
      {
        tableName: "subclasses",
        timestamps: false,
      }
    );
  };
  