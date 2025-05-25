module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      user_id: DataTypes.INTEGER,
      specific_plant_id: DataTypes.INTEGER,
    },
    {
      tableName: "favorites",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.SpecificPlant, {
      foreignKey: "specific_plant_id",
      as: "SpecificPlant"
    });
    Favorite.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  };

  return Favorite;
};
