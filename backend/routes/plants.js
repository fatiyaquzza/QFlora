const express = require("express");
const router = express.Router();
const controller = require("../controllers/plantController");

/**
 * @swagger
 * /plants/all:
 *   get:
 *     summary: Get all plants
 *     responses:
 *       200:
 *         description: List of all plants
 */
router.get("/all", controller.getAllPlants);

/**
 * @swagger
 * /plants/popular:
 *   get:
 *     summary: Get popular plants
 *     responses:
 *       200:
 *         description: List of popular plants
 */
router.get("/popular", controller.getPopularPlants);

module.exports = router;
