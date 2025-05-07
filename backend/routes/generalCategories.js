const express = require("express");
const router = express.Router();
const generalCategoryController = require("../controllers/generalCategoryController");

// Rute kategori umum
router.get("/", generalCategoryController.getAll);
router.get("/:id", generalCategoryController.getById);
router.post("/", generalCategoryController.create);
router.delete("/:id", generalCategoryController.remove);
router.put("/:id", generalCategoryController.update);

// Rute ayat untuk kategori umum
router.post("/:general_category_id/verses", generalCategoryController.addVerse);
router.delete(
  "/:general_category_id/verses/:verseId",
  generalCategoryController.deleteVerse
);
router.put("/:general_category_id/verses/:verseId", generalCategoryController.updateVerse);

module.exports = router;
