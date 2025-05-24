module.exports = (sequelize, DataTypes) => {
  const PlantType = sequelize.define(
    "PlantType",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "plant_types",
      timestamps: true,
    }
  );

  return PlantType;
}; 