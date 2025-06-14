const express = require("express");
const router = express.Router();
const controller = require("../controllers/suggestionController");
const authenticate = require("../middleware/firebaseAuth");

/**
 * @swagger
 * /suggestions/types:
 *   get:
 *     summary: Get all suggestion types
 *     responses:
 *       200:
 *         description: List of suggestion types
 */
router.get("/types", controller.getSuggestionTypes);

/**
 * @swagger
 * /suggestions:
 *   post:
 *     summary: Create a suggestion
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Suggestion created
 */
router.post("/", authenticate, controller.createSuggestion);

/**
 * @swagger
 * /suggestions:
 *   get:
 *     summary: Get all suggestions
 *     responses:
 *       200:
 *         description: List of suggestions
 */
router.get("/", controller.getAllSuggestions);

/**
 * @swagger
 * /suggestions/{id}/note:
 *   put:
 *     summary: Update suggestion note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion note updated
 */
router.put("/:id/note", controller.updateSuggestionNote);

/**
 * @swagger
 * /suggestions/{id}:
 *   delete:
 *     summary: Delete a suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion deleted
 */
router.delete("/:id", controller.deleteSuggestion);

module.exports = router;
