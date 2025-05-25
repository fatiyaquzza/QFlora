module.exports = (sequelize, DataTypes) => {
  const SpecificPlantChemicalComponent = sequelize.define(
    "SpecificPlantChemicalComponent",
    {
      specific_plant_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "specific_plants", 
          key: "id",
        },
        allowNull: false,
        primaryKey: true,
      },
      chemical_component_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "chemical_components", 
          key: "id",
        },
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "specific_plant_chemical_components",
      timestamps: false, 
    }
  );

  return SpecificPlantChemicalComponent;
}; 