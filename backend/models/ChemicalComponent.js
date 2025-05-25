module.exports = (sequelize, DataTypes) => {
  const ChemicalComponent = sequelize.define(
    "ChemicalComponent",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "chemical_components",
      timestamps: true, // or false if you don't need createdAt/updatedAt
    }
  );

  ChemicalComponent.associate = (models) => {
    ChemicalComponent.belongsToMany(models.SpecificPlant, {
      through: models.SpecificPlantChemicalComponent,
      foreignKey: "chemical_component_id",
      otherKey: "specific_plant_id",
      as: "specific_plants",
    });
  };

  return ChemicalComponent;
}; 