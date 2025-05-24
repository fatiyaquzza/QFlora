module.exports = (sequelize, DataTypes) => {
  const SpecificPlant = sequelize.define(
    "SpecificPlant",
    {
      species_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plant_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
      latin_name: DataTypes.STRING,
      image_url: DataTypes.TEXT,
      overview: DataTypes.TEXT,
      description: DataTypes.TEXT,
      eng_name:DataTypes.TEXT,
      arab_name:DataTypes.TEXT,
      benefits: DataTypes.TEXT,
      characteristics: DataTypes.TEXT,
      origin: DataTypes.TEXT,
      chemical_comp: DataTypes.TEXT,
      cultivation: DataTypes.TEXT,
      source_ref: DataTypes.TEXT,
    },
    {
      tableName: "specific_plants",
      timestamps: true,
    }
  );

  SpecificPlant.associate = (models) => {
    SpecificPlant.belongsTo(models.PlantType, {
      foreignKey: 'plant_type_id',
      as: 'plant_type'
    });
  };

  return SpecificPlant;
};
