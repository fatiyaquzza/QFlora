const express = require("express");
const router = express.Router();
const controller = require("../controllers/generalFavoriteController");
const firebaseAuth = require("../middleware/firebaseAuth");

/**
 * @swagger
 * /general-favorites:
 *   get:
 *     summary: Get all general favorites (user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of general favorites
 */
router.get("/", firebaseAuth, controller.getGeneralFavorites);

/**
 * @swagger
 * /general-favorites:
 *   post:
 *     summary: Add a general favorite (user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: General favorite added
 */
router.post("/", firebaseAuth, controller.addGeneralFavorite);

/**
 * @swagger
 * /general-favorites/{id}:
 *   delete:
 *     summary: Remove a general favorite (user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: General favorite removed
 */
router.delete("/:id", firebaseAuth, controller.removeGeneralFavorite);

module.exports = router;
