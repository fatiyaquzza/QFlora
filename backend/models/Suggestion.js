module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define("Suggestion", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Kritik", "Saran", "Pertanyaan"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Belum",
    },
  });

  Suggestion.associate = (models) => {
    Suggestion.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Suggestion;
};
