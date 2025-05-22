// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Family",
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "families",
      timestamps: false,
    }
  );
};
