const express = require("express");
const router = express.Router();
const controller = require("../controllers/chemicalComponentController");

/**
 * @swagger
 * /chemical-components:
 *   get:
 *     summary: Get all chemical components
 *     responses:
 *       200:
 *         description: List of chemical components
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /chemical-components/{id}:
 *   get:
 *     summary: Get chemical component by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chemical component detail
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /chemical-components:
 *   post:
 *     summary: Create a new chemical component
 *     responses:
 *       201:
 *         description: Chemical component created
 */
router.post("/", controller.create);

/**
 * @swagger
 * /chemical-components/{id}:
 *   put:
 *     summary: Update a chemical component
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chemical component updated
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /chemical-components/{id}:
 *   delete:
 *     summary: Delete a chemical component
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chemical component deleted
 */
router.delete("/:id", controller.remove);

module.exports = router; 