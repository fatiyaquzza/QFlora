const express = require("express");
const multer = require("multer");
const {
    importGeneralVerses,
    importSpecificPlantVerses,
  } = require("../controllers/verseImportController");
  

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/import-general-verses", upload.single("file"), importGeneralVerses);
router.post("/import-specific-verses", upload.single("file"), importSpecificPlantVerses);


module.exports = router;
