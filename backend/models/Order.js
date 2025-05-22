// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Order",
    {
      subclass_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "orders",
      timestamps: false,
    }
  );
};
