module.exports = (sequelize, DataTypes) => {
    const SpecificPlant = sequelize.define('SpecificPlant', {
      name: DataTypes.STRING,
      latin_name: DataTypes.STRING,
      image_url: DataTypes.TEXT,
      quran_verse: DataTypes.TEXT,
      surah: DataTypes.STRING,
      verse_number: DataTypes.INTEGER,
      audio_url: DataTypes.TEXT,
      translation: DataTypes.TEXT,
      plant_type: DataTypes.ENUM('Buah', 'Sayur', 'Bunga'),
      overview: DataTypes.TEXT,
      description: DataTypes.TEXT,
      classification: DataTypes.TEXT,
      benefits: DataTypes.TEXT,
      characteristics: DataTypes.TEXT,
      origin: DataTypes.TEXT,
      chemical_comp: DataTypes.TEXT,
      cultivation: DataTypes.TEXT,
      source_ref: DataTypes.TEXT
    }, {
      tableName: 'specific_plants',
      timestamps: true
    });
  
    return SpecificPlant;
  };
  