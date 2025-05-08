const { Suggestion, User } = require("../models");

exports.createSuggestion = async (req, res) => {
  try {
    const firebase_uid = req.firebase_uid;
    const user = await User.findOne({ where: { firebase_uid } });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User tidak ditemukan di database." });
    }

    const { type, description } = req.body;

    if (!type || !description) {
      return res.status(400).json({ error: "Tipe dan deskripsi wajib diisi" });
    }

    const suggestion = await Suggestion.create({
      user_id: user.id,
      type,
      description,
    });

    res.status(201).json(suggestion);
  } catch (err) {
    console.error("❌ Gagal membuat saran:", err);
    res.status(500).json({ error: "Gagal menyimpan saran" });
  }
};

exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll({
      include: {
        model: User,
        attributes: ["name", "email"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(suggestions);
  } catch (err) {
    console.error("❌ Gagal mengambil data saran:", err);
    res.status(500).json({ error: "Gagal mengambil data saran" });
  }
};

exports.updateSuggestionNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const suggestion = await Suggestion.findByPk(id);
    if (!suggestion) {
      return res.status(404).json({ error: "Saran tidak ditemukan" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status wajib diisi" });
    }

    suggestion.status = status;
    await suggestion.save();

    res.json({ message: "Status berhasil diperbarui", suggestion });
  } catch (err) {
    console.error("❌ Gagal update status:", err);
    res.status(500).json({ error: "Gagal update status saran" });
  }
};
