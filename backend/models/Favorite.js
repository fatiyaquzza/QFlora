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

  return Favorite;
};
