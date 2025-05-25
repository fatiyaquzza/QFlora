// models/SpecificPlantVerse.js
module.exports = (sequelize, DataTypes) => {
  const SpecificPlantVerse = sequelize.define(
    "SpecificPlantVerse",
    {
      specific_plant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'specific_plants',
          key: 'id'
        }
      },
      surah: DataTypes.STRING,
      verse_number: DataTypes.INTEGER,
      quran_verse: DataTypes.TEXT,
      translation: DataTypes.TEXT,
      audio_url: DataTypes.TEXT,
      keyword_arab: DataTypes.TEXT,
    },
    {
      tableName: "specific_plant_verses",
      timestamps: true,
    }
  );

  SpecificPlantVerse.associate = (models) => {
    SpecificPlantVerse.belongsTo(models.SpecificPlant, {
      foreignKey: "specific_plant_id",
    });
  };

  return SpecificPlantVerse;
};
