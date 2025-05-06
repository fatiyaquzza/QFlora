module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      firebase_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    }, {
      tableName: 'users',
      timestamps: true
    });
  
    return User;
  };
  