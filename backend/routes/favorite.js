const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const firebaseAuth = require("../middleware/firebaseAuth");

/**
 * @swagger
 * /favorite:
 *   get:
 *     summary: Get all favorites (user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get("/", firebaseAuth, favoriteController.getFavorites);

/**
 * @swagger
 * /favorite:
 *   post:
 *     summary: Add a favorite (user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Favorite added
 */
router.post("/", firebaseAuth, favoriteController.addFavorite);

/**
 * @swagger
 * /favorite/{id}:
 *   delete:
 *     summary: Remove a favorite (user)
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
 *         description: Favorite removed
 */
router.delete("/:id", firebaseAuth, favoriteController.removeFavorite);

module.exports = router;
