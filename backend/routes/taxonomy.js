const express = require("express");
const router = express.Router();
const {
  createFullTaxonomy,
  getAllFull,
} = require("../controllers/taxonomyController");

router.post("/taxonomy/full", createFullTaxonomy);
router.get("/taxonomy/full", getAllFull);   

module.exports = router;
