const express = require("express");
const router = express.Router();
const { PlantType } = require("../models");

// Get all plant types
router.get("/", async (req, res) => {
  try {
    const plantTypes = await PlantType.findAll();
    res.json(plantTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plant types", error });
  }
});

// Create a new plant type
router.post("/", async (req, res) => {
  try {
    const plantType = await PlantType.create(req.body);
    res.status(201).json(plantType);
  } catch (error) {
    res.status(500).json({ message: "Error creating plant type", error });
  }
});

// Update a plant type
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

// Delete a plant type
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