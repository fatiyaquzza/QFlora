module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define("suggestion", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    suggestion_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Belum",
    },
  });

  Suggestion.associate = (models) => {
    Suggestion.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    Suggestion.belongsTo(models.SuggestionType, {
      foreignKey: "suggestion_type_id",
      as: "suggestion_type",
    });
  };

  return Suggestion;
};
