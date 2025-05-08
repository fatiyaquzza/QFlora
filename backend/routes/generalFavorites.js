const express = require("express");
const router = express.Router();
const controller = require("../controllers/generalFavoriteController");
const firebaseAuth = require("../middleware/firebaseAuth");

router.get("/", firebaseAuth, controller.getGeneralFavorites);
router.post("/", firebaseAuth, controller.addGeneralFavorite);
router.delete("/:id", firebaseAuth, controller.removeGeneralFavorite);

module.exports = router;
