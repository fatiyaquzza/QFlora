// models/GeneralCategory.js
module.exports = (sequelize, DataTypes) => {
  const GeneralCategory = sequelize.define(
    "GeneralCategory",
    {
      name: DataTypes.STRING,
      latin_name: DataTypes.STRING,
      image_url: DataTypes.TEXT,
      overview: DataTypes.TEXT,
    },
    {
      tableName: "general_categories",
      timestamps: false,
    }
  );

  GeneralCategory.associate = (models) => {
    GeneralCategory.hasMany(models.GeneralCategoryVerse, {
      foreignKey: "general_category_id",
      as: "verses",
      onDelete: 'CASCADE',
      hooks: true
    });
    GeneralCategory.hasMany(models.GeneralFavorite, {
      foreignKey: "general_category_id",
      as: "general_favorites"
    });
  };

  return GeneralCategory;
};
