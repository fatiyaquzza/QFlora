// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    "Class",
    {
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: "classes",
      timestamps: false,
    }
  );

  Class.associate = (models) => {
    Class.belongsTo(models.Division, {
      foreignKey: 'division_id',
      as: 'division'
    });
    Class.hasMany(models.Subclass, {
      foreignKey: 'class_id',
      as: 'subclasses'
    });
  };

  return Class;
};
