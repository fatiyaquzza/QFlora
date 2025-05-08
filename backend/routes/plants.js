const express = require("express");
const router = express.Router();
const controller = require("../controllers/plantController");

router.get("/all", controller.getAllPlants);
router.get("/popular", controller.getPopularPlants);

module.exports = router;
