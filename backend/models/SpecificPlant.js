module.exports = (sequelize, DataTypes) => {
  const SpecificPlant = sequelize.define(
    "SpecificPlant",
    {
      name: DataTypes.STRING,
      latin_name: DataTypes.STRING,
      image_url: DataTypes.TEXT,
      plant_type: DataTypes.ENUM("Buah", "Sayur", "Bunga"),
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

  return SpecificPlant;
};
