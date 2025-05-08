const {
  GeneralFavorite,
  User,
  GeneralCategory,
  GeneralCategoryVerse,
} = require("../models");

exports.getGeneralFavorites = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { firebase_uid: req.firebase_uid },
    });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const favorites = await GeneralFavorite.findAll({
      where: { user_id: user.id },
      include: [{ model: GeneralCategory, include: ["verses"] }],
    });

    res.json(favorites);
  } catch (error) {
    console.error("❌ Gagal get general favorites:", error);
    res.status(500).json({ error: "Gagal mengambil favorit umum" });
  }
};

exports.addGeneralFavorite = async (req, res) => {
  try {
    const { general_category_id } = req.body;
    const [user] = await User.findOrCreate({
      where: { firebase_uid: req.firebase_uid },
    });

    const [favorite, created] = await GeneralFavorite.findOrCreate({
      where: { user_id: user.id, general_category_id },
    });

    res
      .status(201)
      .json({ message: created ? "Ditambahkan" : "Sudah ada", favorite });
  } catch (error) {
    console.error("❌ Gagal menambah favorit umum:", error);
    res.status(500).json({ error: "Gagal tambah favorit umum" });
  }
};

exports.removeGeneralFavorite = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { firebase_uid: req.firebase_uid },
    });
    const { id } = req.params;

    const deleted = await GeneralFavorite.destroy({
      where: { user_id: user.id, general_category_id: id },
    });

    res.json({ message: "Favorit dihapus", deleted });
  } catch (error) {
    console.error("❌ Gagal hapus favorit umum:", error);
    res.status(500).json({ error: "Gagal hapus favorit umum" });
  }
};
