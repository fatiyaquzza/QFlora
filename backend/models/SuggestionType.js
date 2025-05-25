module.exports = (sequelize, DataTypes) => {
    const SuggestionType = sequelize.define(
      "SuggestionType",
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "suggestion_types",
        timestamps: true,
      }
    );
  
    return SuggestionType;
  }; 