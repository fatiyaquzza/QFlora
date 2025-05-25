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

  GeneralFavorite.associate = (models) => {
    GeneralFavorite.belongsTo(models.GeneralCategory, {
      foreignKey: "general_category_id",
      as: "GeneralCategory"
    });
    GeneralFavorite.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  };

  return GeneralFavorite;
};
