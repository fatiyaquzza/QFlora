// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Species = sequelize.define(
    "Species",
    {
      genus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "species",
      timestamps: false,
    }
  );

  Species.associate = (models) => {
    Species.belongsTo(models.Genus, {
      foreignKey: 'genus_id',
      as: 'genus'
    });
  };

  return Species;
};
