const express = require("express");
const multer = require("multer");
const {
  importGeneralVerses,
  importSpecificPlantVerses,
  importSpecificPlants,
  importSpecificPlantClassifications,
} = require("../controllers/uploadDataController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/import-general-verses",
  upload.single("file"),
  importGeneralVerses
);
router.post(
  "/import-specific-verses",
  upload.single("file"),
  importSpecificPlantVerses
);
router.post(
  "/import-specific-plants",
  upload.single("file"),
  importSpecificPlants
);
router.post(
  "/import-specific-classifications",
  upload.single("file"),
  importSpecificPlantClassifications
);

module.exports = router;
