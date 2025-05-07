module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "SpecificPlantClassification",
    {
      specific_plant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      kingdom: {
        type: DataTypes.STRING,
        defaultValue: "Plantae",
      },
      subkingdom: DataTypes.STRING,
      superdivision: DataTypes.STRING,
      division: DataTypes.STRING,
      class: DataTypes.STRING,
      subclass: DataTypes.STRING,
      order: DataTypes.STRING,
      family: DataTypes.STRING,
      genus: DataTypes.STRING,
      species: DataTypes.STRING,
    },
    {
      tableName: "specific_plant_classifications",
      timestamps: true,
    }
  );
};
