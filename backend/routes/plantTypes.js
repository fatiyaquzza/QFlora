const express = require("express");
const router = express.Router();
const { PlantType } = require("../models");

/**
 * @swagger
 * /api/plant-types:
 *   get:
 *     summary: Get all plant types
 *     responses:
 *       200:
 *         description: List of plant types
 */
router.get("/", async (req, res) => {
  try {
    const plantTypes = await PlantType.findAll();
    res.json(plantTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plant types", error });
  }
});

/**
 * @swagger
 * /api/plant-types:
 *   post:
 *     summary: Create a new plant type
 *     responses:
 *       201:
 *         description: Plant type created
 */
router.post("/", async (req, res) => {
  try {
    const plantType = await PlantType.create(req.body);
    res.status(201).json(plantType);
  } catch (error) {
    res.status(500).json({ message: "Error creating plant type", error });
  }
});

/**
 * @swagger
 * /api/plant-types/{id}:
 *   put:
 *     summary: Update a plant type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plant type updated
 */
router.put("/:id", async (req, res) => {
  try {
    const plantType = await PlantType.findByPk(req.params.id);
    if (!plantType) {
      return res.status(404).json({ message: "Plant type not found" });
    }
    await plantType.update(req.body);
    res.json(plantType);
  } catch (error) {
    res.status(500).json({ message: "Error updating plant type", error });
  }
});

/**
 * @swagger
 * /api/plant-types/{id}:
 *   delete:
 *     summary: Delete a plant type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plant type deleted
 */
router.delete("/:id", async (req, res) => {
  try {
    const plantType = await PlantType.findByPk(req.params.id);
    if (!plantType) {
      return res.status(404).json({ message: "Plant type not found" });
    }
    await plantType.destroy();
    res.json({ message: "Plant type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting plant type", error });
  }
});

module.exports = router; 