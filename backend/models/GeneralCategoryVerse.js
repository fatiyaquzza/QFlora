// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "GeneralCategoryVerse",
    {
      general_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      surah: DataTypes.STRING,
      verse_number: DataTypes.INTEGER,
      quran_verse: DataTypes.TEXT,
      audio_url: DataTypes.TEXT,
      translation: DataTypes.TEXT,
      keyword_arab: DataTypes.TEXT,
    },
    {
      tableName: "general_category_verses",
      timestamps: true,
    }
  );
};
