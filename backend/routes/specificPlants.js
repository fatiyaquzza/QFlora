const express = require("express");
const router = express.Router();
const controller = require("../controllers/specificPlantController");

router.get("/", controller.getAll);
router.delete("/all", controller.deleteAll);

router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// Verses
router.post("/:specific_plant_id/verses", controller.addVerse);
router.delete("/:specific_plant_id/verses/:verseId", controller.deleteVerse);
router.put("/:specific_plant_id/verses/:verseId", controller.updateVerse);

// router.post(
//   "/:specific_plant_id/classifications",
//   controller.addClassification
// );
// router.put(
//   "/:specific_plant_id/classifications/:classificationId",
//   controller.updateClassification
// );
// router.delete(
//   "/:specific_plant_id/classifications/:classificationId",
//   controller.deleteClassification
// );


module.exports = router;
