// models/GeneralCategoryVerse.js
module.exports = (sequelize, DataTypes) => {
    const Subclass = sequelize.define(
      "Subclass",
      {
        class_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: DataTypes.STRING,
      },
      {
        tableName: "subclasses",
        timestamps: false,
      }
    );

    Subclass.associate = (models) => {
      Subclass.belongsTo(models.Class, {
        foreignKey: 'class_id',
        as: 'class'
      });
      Subclass.hasMany(models.Order, {
        foreignKey: 'subclass_id',
        as: 'orders'
      });
    };

    return Subclass;
  };
  