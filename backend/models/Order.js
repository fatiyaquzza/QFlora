// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
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

  Order.associate = (models) => {
    Order.belongsTo(models.Subclass, {
      foreignKey: 'subclass_id',
      as: 'subclass'
    });
    Order.hasMany(models.Family, {
      foreignKey: 'order_id',
      as: 'families'
    });
  };

  return Order;
};
