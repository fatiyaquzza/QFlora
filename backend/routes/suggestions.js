const express = require("express");
const router = express.Router();
const controller = require("../controllers/suggestionController");
const authenticate = require("../middleware/firebaseAuth");

router.get("/types", controller.getSuggestionTypes);
router.post("/", authenticate, controller.createSuggestion);
router.get("/", controller.getAllSuggestions);
router.put("/:id/note", controller.updateSuggestionNote);
router.delete("/:id", controller.deleteSuggestion);

module.exports = router;
