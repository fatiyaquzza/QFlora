module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
      user_id: DataTypes.INTEGER,
      specific_plant_id: DataTypes.INTEGER
    }, {
      tableName: 'favorites',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'specific_plant_id']
        }
      ]
    });
  
    return Favorite;
  };
  