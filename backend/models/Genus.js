module.exports = (sequelize, DataTypes) => {
  const Genus = sequelize.define(
    "Genus",
    {
      family_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "genuses",
      timestamps: false,
    }
  );

  Genus.associate = (models) => {
    Genus.belongsTo(models.Family, {
      foreignKey: 'family_id',
      as: 'family'
    });
    Genus.hasMany(models.Species, {
      foreignKey: 'genus_id',
      as: 'species'
    });
  };

  return Genus;
};
