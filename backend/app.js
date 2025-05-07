const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");

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
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected."))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const generalCategoryRoutes = require("./routes/generalCategories");
app.use("/general-categories", generalCategoryRoutes);

const specificPlantRoutes = require("./routes/specificPlants");
app.use("/specific-plants", specificPlantRoutes);

const favoriteRoutes = require("./routes/favorites");
app.use("/favorites", favoriteRoutes);

const userRoutes = require("./routes/users");
app.use("/users", require("./routes/users"));
