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

router.post("/taxonomy/full", createFullTaxonomy);
router.get("/taxonomy/full", getAllFull);

// Delete endpoints
router.delete("/taxonomy/species/:id", deleteSpecies);
router.delete("/taxonomy/genus/:id", deleteGenus);
router.delete("/taxonomy/family/:id", deleteFamily);
router.delete("/taxonomy/order/:id", deleteOrder);
router.delete("/taxonomy/subclass/:id", deleteSubclass);
router.delete("/taxonomy/class/:id", deleteClass);
router.delete("/taxonomy/division/:id", deleteDivision);
router.delete("/taxonomy/superdivision/:id", deleteSuperdivision);
router.delete("/taxonomy/subkingdom/:id", deleteSubkingdom);

module.exports = router;
