// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Superdivision = sequelize.define(
    "Superdivision",
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

  Superdivision.associate = (models) => {
    Superdivision.belongsTo(models.Subkingdom, {
      foreignKey: 'subkingdom_id',
      as: 'subkingdom'
    });
    Superdivision.hasMany(models.Division, {
      foreignKey: 'superdivision_id',
      as: 'divisions'
    });
  };

  return Superdivision;
};
  