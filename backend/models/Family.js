// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define(
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

  Family.associate = (models) => {
    Family.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
    Family.hasMany(models.Genus, {
      foreignKey: 'family_id',
      as: 'genera'
    });
  };

  return Family;
};
