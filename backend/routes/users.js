const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const firebaseAuth = require("../middleware/firebaseAuth");
const path = require("path");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: string
 *                       email:
 *                         type: string
 *                       displayName:
 *                         type: string
 */
router.get("/", async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers(1000);
    const users = listUsers.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || "-",
    }));
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
});

/**
 * @swagger
 * /users/{uid}:
 *   patch:
 *     summary: Update a user's display name
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       500:
 *         description: Failed to update user
 */
router.patch("/:uid", async (req, res) => {
  try {
    const { displayName } = req.body;
    const updatedUser = await admin.auth().updateUser(req.params.uid, {
      displayName,
    });
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengupdate user" });
  }
});

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       500:
 *         description: Failed to delete user
 */
router.delete("/:uid", async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid);
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus user" });
  }
});

module.exports = router;
