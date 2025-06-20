const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 2306,
    dialect: "mysql",
    logging: false,
  }
);

// Cek koneksi
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Koneksi ke database berhasil.");
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke database:", err.message);
  });

module.exports = sequelize;
