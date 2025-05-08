module.exports = (sequelize, DataTypes) => {
  const GeneralFavorite = sequelize.define(
    "GeneralFavorite",
    {
      user_id: DataTypes.INTEGER,
      general_category_id: DataTypes.INTEGER,
    },
    {
      tableName: "general_favorites",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "general_category_id"],
        },
      ],
    }
  );

  return GeneralFavorite;
};
