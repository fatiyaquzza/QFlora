const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const db = require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QFLORA API",
      version: "1.0.0",
      description: "API documentation for QFLORA",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // You can add JSDoc comments in your route files for more details
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req, res) => {
  res.send("QFLORA API is running...");
});

// Test DB and Migrations
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected.");

    // Sync new tables first without forcing, so they exist for foreign keys
    await db.PlantType.sync();
    await db.ChemicalComponent.sync();
    await db.SpecificPlantChemicalComponent.sync();

    // Sync SpecificPlant with alter:true to handle schema changes like column drops
    await db.SpecificPlant.sync({ alter: true });

    // Sync other taxonomy tables (assuming they don't need forced changes for this task)
    await db.Subkingdom.sync();
    await db.Superdivision.sync();
    await db.Division.sync();
    await db.Class.sync();
    await db.Subclass.sync();
    await db.Order.sync();
    await db.Family.sync();
    await db.Genus.sync();
    await db.Species.sync();

    // Sync remaining tables
    await db.SpecificPlantVerse.sync();
    await db.GeneralCategory.sync();
    await db.GeneralCategoryVerse.sync();
    await db.GeneralFavorite.sync();
    await db.Favorite.sync();
    await db.User.sync();
    await db.SuggestionType.sync();
    await db.Suggestion.sync();

    console.log("✅ All models synced.");
  } catch (error) {
    console.error("❌ Gagal sync model ke DB:", error);
    console.error("Detail error:", error.original || error);
  }
})();

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is listening at http://${HOST}:${PORT}`);
});

const generalCategoryRoutes = require("./routes/generalCategories");
app.use("/general-categories", generalCategoryRoutes);

const specificPlantRoutes = require("./routes/specificPlants");
app.use("/specific-plants", specificPlantRoutes);

const favoriteRoutes = require("./routes/favorite");
app.use("/favorites", favoriteRoutes);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const generalFavoriteRoutes = require("./routes/generalFavorites");
app.use("/general-favorites", generalFavoriteRoutes);

const plantRoutes = require("./routes/plants");
app.use("/plants", plantRoutes);

const suggestionRoutes = require("./routes/suggestions");
app.use("/suggestions", suggestionRoutes);

const verseImportRoutes = require("./routes/uploadDataRoutes");
app.use("/api", verseImportRoutes);

const taxonomyRoutes = require("./routes/taxonomy");
app.use("/api", taxonomyRoutes);

// Add plant types routes
const plantTypeRoutes = require("./routes/plantTypes");
app.use("/api/plant-types", plantTypeRoutes);

// Add chemical components routes
const chemicalComponentRoutes = require("./routes/chemicalComponents");
app.use("/api/chemical-components", chemicalComponentRoutes);
