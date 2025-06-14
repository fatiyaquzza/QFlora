const express = require("express");
const router = express.Router();
const controller = require("../controllers/specificPlantController");

/**
 * @swagger
 * /specific-plants:
 *   get:
 *     summary: Get all specific plants
 *     responses:
 *       200:
 *         description: List of specific plants
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /specific-plants/all:
 *   delete:
 *     summary: Delete all specific plants
 *     responses:
 *       200:
 *         description: All specific plants deleted
 */
router.delete("/all", controller.deleteAll);

/**
 * @swagger
 * /specific-plants/{id}:
 *   get:
 *     summary: Get specific plant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specific plant detail
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /specific-plants:
 *   post:
 *     summary: Create a new specific plant
 *     responses:
 *       201:
 *         description: Specific plant created
 */
router.post("/", controller.create);

/**
 * @swagger
 * /specific-plants/{id}:
 *   put:
 *     summary: Update a specific plant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specific plant updated
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /specific-plants/{id}:
 *   delete:
 *     summary: Delete a specific plant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specific plant deleted
 */
router.delete("/:id", controller.remove);

/**
 * @swagger
 * /specific-plants/{specific_plant_id}/verses:
 *   post:
 *     summary: Add a verse to a specific plant
 *     parameters:
 *       - in: path
 *         name: specific_plant_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Verse added
 */
router.post("/:specific_plant_id/verses", controller.addVerse);

/**
 * @swagger
 * /specific-plants/{specific_plant_id}/verses/{verseId}:
 *   delete:
 *     summary: Delete a verse from a specific plant
 *     parameters:
 *       - in: path
 *         name: specific_plant_id
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
router.delete("/:specific_plant_id/verses/:verseId", controller.deleteVerse);

/**
 * @swagger
 * /specific-plants/{specific_plant_id}/verses/{verseId}:
 *   put:
 *     summary: Update a verse in a specific plant
 *     parameters:
 *       - in: path
 *         name: specific_plant_id
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
router.put("/:specific_plant_id/verses/:verseId", controller.updateVerse);

module.exports = router;
