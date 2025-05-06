module.exports = (sequelize, DataTypes) => {
    const GeneralCategory = sequelize.define('GeneralCategory', {
      name: DataTypes.STRING,
      latin_name: DataTypes.STRING,
      image_url: DataTypes.TEXT,
      quran_verse: DataTypes.TEXT,
      surah: DataTypes.STRING,
      verse_number: DataTypes.INTEGER,
      audio_url: DataTypes.TEXT,
      translation: DataTypes.TEXT,
      overview: DataTypes.TEXT
    }, {
      tableName: 'general_categories',
      timestamps: false
    });
  
    return GeneralCategory;
  };
  