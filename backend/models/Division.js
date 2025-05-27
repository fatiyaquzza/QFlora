// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define(
    "Division",
    {
      superdivision_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "divisions",
      timestamps: false,
    }
  );

  Division.associate = (models) => {
    Division.belongsTo(models.Superdivision, {
      foreignKey: 'superdivision_id',
      as: 'superdivision'
    });
    Division.hasMany(models.Class, {
      foreignKey: 'division_id',
      as: 'classes'
    });
  };

  return Division;
};
