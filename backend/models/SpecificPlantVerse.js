// models/SpecificPlantVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "SpecificPlantVerse",
    {
      specific_plant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
};
