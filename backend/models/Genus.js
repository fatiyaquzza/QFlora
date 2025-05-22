module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Genus",
    {
      family_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "genuses",
      timestamps: false,
    }
  );
};
