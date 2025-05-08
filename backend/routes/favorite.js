const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const firebaseAuth = require("../middleware/firebaseAuth");

router.get("/", firebaseAuth, favoriteController.getFavorites);
router.post("/", firebaseAuth, favoriteController.addFavorite);
router.delete("/:id", firebaseAuth, favoriteController.removeFavorite);

module.exports = router;
