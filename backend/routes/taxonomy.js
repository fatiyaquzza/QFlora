const express = require("express");
const router = express.Router();
const {
  createFullTaxonomy,
  getAllFull,
  deleteSpecies,
  deleteGenus,
  deleteFamily,
  deleteOrder,
  deleteSubclass,
  deleteClass,
  deleteDivision,
  deleteSuperdivision,
  deleteSubkingdom,
} = require("../controllers/taxonomyController");

/**
 * @swagger
 * /api/taxonomy/full:
 *   post:
 *     summary: Create full taxonomy
 *     responses:
 *       201:
 *         description: Full taxonomy created
 */
router.post("/taxonomy/full", createFullTaxonomy);

/**
 * @swagger
 * /api/taxonomy/full:
 *   get:
 *     summary: Get all full taxonomy
 *     responses:
 *       200:
 *         description: List of full taxonomy
 */
router.get("/taxonomy/full", getAllFull);

// Delete endpoints
/**
 * @swagger
 * /api/taxonomy/species/{id}:
 *   delete:
 *     summary: Delete species
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Species deleted
 */
router.delete("/taxonomy/species/:id", deleteSpecies);

/**
 * @swagger
 * /api/taxonomy/genus/{id}:
 *   delete:
 *     summary: Delete genus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genus deleted
 */
router.delete("/taxonomy/genus/:id", deleteGenus);

/**
 * @swagger
 * /api/taxonomy/family/{id}:
 *   delete:
 *     summary: Delete family
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Family deleted
 */
router.delete("/taxonomy/family/:id", deleteFamily);

/**
 * @swagger
 * /api/taxonomy/order/{id}:
 *   delete:
 *     summary: Delete order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.delete("/taxonomy/order/:id", deleteOrder);

/**
 * @swagger
 * /api/taxonomy/subclass/{id}:
 *   delete:
 *     summary: Delete subclass
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subclass deleted
 */
router.delete("/taxonomy/subclass/:id", deleteSubclass);

/**
 * @swagger
 * /api/taxonomy/class/{id}:
 *   delete:
 *     summary: Delete class
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted
 */
router.delete("/taxonomy/class/:id", deleteClass);

/**
 * @swagger
 * /api/taxonomy/division/{id}:
 *   delete:
 *     summary: Delete division
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Division deleted
 */
router.delete("/taxonomy/division/:id", deleteDivision);

/**
 * @swagger
 * /api/taxonomy/superdivision/{id}:
 *   delete:
 *     summary: Delete superdivision
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Superdivision deleted
 */
router.delete("/taxonomy/superdivision/:id", deleteSuperdivision);

/**
 * @swagger
 * /api/taxonomy/subkingdom/{id}:
 *   delete:
 *     summary: Delete subkingdom
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subkingdom deleted
 */
router.delete("/taxonomy/subkingdom/:id", deleteSubkingdom);

module.exports = router;
