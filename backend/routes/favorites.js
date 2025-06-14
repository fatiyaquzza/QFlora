const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const firebaseAuth = require("../middlewares/firebaseAuth");

/**
 * @swagger
 * /favorites:
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
 * /favorites:
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
 * /favorites/{id}:
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
