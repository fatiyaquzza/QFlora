const express = require("express");
const multer = require("multer");
const {
  importGeneralVerses,
  importSpecificPlantVerses,
  importSpecificPlants,
  importGeneralPlants
} = require("../controllers/uploadDataController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /api/import-general-verses:
 *   post:
 *     summary: Import general verses (upload file)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: General verses imported
 */
router.post(
  "/import-general-verses",
  upload.single("file"),
  importGeneralVerses
);

/**
 * @swagger
 * /api/import-specific-verses:
 *   post:
 *     summary: Import specific plant verses (upload file)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Specific plant verses imported
 */
router.post(
  "/import-specific-verses",
  upload.single("file"),
  importSpecificPlantVerses
);

/**
 * @swagger
 * /api/import-specific-plants:
 *   post:
 *     summary: Import specific plants (upload file)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Specific plants imported
 */
router.post(
  "/import-specific-plants",
  upload.single("file"),
  importSpecificPlants
);

/**
 * @swagger
 * /api/import-general-plants:
 *   post:
 *     summary: Import general plants (upload file)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: General plants imported
 */
router.post(
  "/import-general-plants",
  upload.single("file"),
  importGeneralPlants
);

module.exports = router;
