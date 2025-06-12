const { Suggestion, User, SuggestionType } = require("../models");

exports.createSuggestion = async (req, res) => {
  try {
    const firebase_uid = req.firebase_uid;
    const user = await User.findOne({ where: { firebase_uid } });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User tidak ditemukan di database." });
    }

    const { suggestion_type_id, description } = req.body;

    if (!suggestion_type_id || !description) {
      return res.status(400).json({ error: "Tipe dan deskripsi wajib diisi" });
    }

    const suggestion = await Suggestion.create({
      user_id: user.id,
      suggestion_type_id,
      description,
    });

    // Fetch the created suggestion with user data
    const suggestionWithUser = await Suggestion.findByPk(suggestion.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: SuggestionType,
          as: "suggestion_type",
        },
      ],
    });

    res.status(201).json(suggestionWithUser);
  } catch (err) {
    console.error("❌ Gagal membuat saran:", err);
    res.status(500).json({ error: "Gagal menyimpan saran" });
  }
};

exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["name", "email"],
        },
        {
          model: SuggestionType,
          as: 'suggestion_type',
        },
      ],
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

    const suggestion = await Suggestion.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: SuggestionType,
          as: "suggestion_type",
        },
      ],
    });

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

exports.getSuggestionTypes = async (req, res) => {
  try {
    const types = await SuggestionType.findAll({
      order: [["name", "ASC"]],
    });
    res.json(types);
  } catch (err) {
    console.error("❌ Gagal mengambil tipe saran:", err);
    res.status(500).json({ error: "Gagal mengambil tipe saran" });
  }
};

exports.deleteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const suggestion = await Suggestion.findByPk(id);
    
    if (!suggestion) {
      return res.status(404).json({ error: "Saran tidak ditemukan" });
    }

    await suggestion.destroy();
    res.json({ message: "Saran berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus saran:", err);
    res.status(500).json({ error: "Gagal menghapus saran" });
  }
};
