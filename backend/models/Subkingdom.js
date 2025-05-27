// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Subkingdom = sequelize.define(
    "Subkingdom",
    {
      name: DataTypes.STRING,
    },
    {
      tableName: "subkingdoms",
      timestamps: false,
    }
  );

  Subkingdom.associate = (models) => {
    Subkingdom.hasMany(models.Superdivision, {
      foreignKey: 'subkingdom_id',
      as: 'superdivisions'
    });
  };

  return Subkingdom;
};
  