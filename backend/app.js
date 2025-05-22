const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const db = require("./models");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.get("/", (req, res) => {
  res.send("QFLORA API is running...");
});

// Test DB
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected.");

    // Sync model secara berurutan berdasarkan foreign key
    await db.Subkingdom.sync();
    await db.Superdivision.sync();
    await db.Division.sync();
    await db.Class.sync();
    await db.Subclass.sync();
    await db.Order.sync();
    await db.Family.sync();
    await db.Genus.sync();
    await db.Species.sync();

    await db.SpecificPlant.sync({ alter: true });
    await db.SpecificPlantVerse.sync();
    await db.GeneralCategory.sync();
    await db.GeneralCategoryVerse.sync();
    await db.GeneralFavorite.sync();
    await db.Favorite.sync();
    await db.Suggestion.sync();
    await db.User.sync();

    console.log("✅ Semua model berhasil disinkronkan secara berurutan.");
  } catch (error) {
    console.error("❌ Gagal sync model ke DB:", error);
  }
})();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const generalCategoryRoutes = require("./routes/generalCategories");
app.use("/general-categories", generalCategoryRoutes);

const specificPlantRoutes = require("./routes/specificPlants");
app.use("/specific-plants", specificPlantRoutes);

const favoriteRoutes = require("./routes/favorite");
app.use("/favorites", favoriteRoutes);

const userRoutes = require("./routes/users");
app.use("/users", require("./routes/users"));

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
