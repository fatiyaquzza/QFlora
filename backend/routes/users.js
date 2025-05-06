const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const firebaseAuth = require("../middlewares/firebaseAuth");
const path = require("path");

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

// DELETE /users/:uid
router.delete("/:uid", async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid);
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus user" });
  }
});

module.exports = router;
