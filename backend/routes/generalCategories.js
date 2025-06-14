const express = require("express");
const router = express.Router();
const generalCategoryController = require("../controllers/generalCategoryController");

/**
 * @swagger
 * /general-categories:
 *   get:
 *     summary: Get all general categories
 *     responses:
 *       200:
 *         description: List of general categories
 */
router.get("/", generalCategoryController.getAll);

/**
 * @swagger
 * /general-categories/{id}:
 *   get:
 *     summary: Get general category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: General category detail
 */
router.get("/:id", generalCategoryController.getById);

/**
 * @swagger
 * /general-categories:
 *   post:
 *     summary: Create a new general category
 *     responses:
 *       201:
 *         description: General category created
 */
router.post("/", generalCategoryController.create);

/**
 * @swagger
 * /general-categories/{id}:
 *   delete:
 *     summary: Delete a general category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: General category deleted
 */
router.delete("/:id", generalCategoryController.remove);

/**
 * @swagger
 * /general-categories/{id}:
 *   put:
 *     summary: Update a general category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: General category updated
 */
router.put("/:id", generalCategoryController.update);

/**
 * @swagger
 * /general-categories/{general_category_id}/verses:
 *   post:
 *     summary: Add a verse to a general category
 *     parameters:
 *       - in: path
 *         name: general_category_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Verse added
 */
router.post("/:general_category_id/verses", generalCategoryController.addVerse);

/**
 * @swagger
 * /general-categories/{general_category_id}/verses/{verseId}:
 *   delete:
 *     summary: Delete a verse from a general category
 *     parameters:
 *       - in: path
 *         name: general_category_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: verseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verse deleted
 */
router.delete(
  "/:general_category_id/verses/:verseId",
  generalCategoryController.deleteVerse
);

/**
 * @swagger
 * /general-categories/{general_category_id}/verses/{verseId}:
 *   put:
 *     summary: Update a verse in a general category
 *     parameters:
 *       - in: path
 *         name: general_category_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: verseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verse updated
 */
router.put("/:general_category_id/verses/:verseId", generalCategoryController.updateVerse);

module.exports = router;
