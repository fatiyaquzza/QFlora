module.exports = (sequelize, DataTypes) => {
  const SpecificPlantChemicalComponent = sequelize.define(
    "SpecificPlantChemicalComponent",
    {
      specific_plant_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "specific_plants", // table name
          key: "id",
        },
        allowNull: false,
        primaryKey: true,
      },
      chemical_component_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "chemical_components", // table name
          key: "id",
        },
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "specific_plant_chemical_components",
      timestamps: false, // Junction tables often don't need timestamps
    }
  );

  return SpecificPlantChemicalComponent;
}; 