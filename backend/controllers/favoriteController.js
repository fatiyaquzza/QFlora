const { Favorite, User, SpecificPlant } = require("../models");

exports.getFavorites = async (req, res) => {
  try {
    const firebase_uid = req.firebase_uid;
    let user = await User.findOne({ where: { firebase_uid } });

    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const favorites = await Favorite.findAll({
      where: { user_id: user.id },
      include: [SpecificPlant],
    });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data favorit" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const firebase_uid = req.firebase_uid;
    const { specific_plant_id } = req.body;

    let user = await User.findOrCreate({ where: { firebase_uid } });
    const user_id = user[0].id;

    const [favorite, created] = await Favorite.findOrCreate({
      where: { user_id, specific_plant_id },
    });

    if (!created)
      return res.status(200).json({ message: "Sudah difavoritkan" });

    res.status(201).json({ message: "Favorit ditambahkan", favorite });
  } catch (err) {
    res.status(500).json({ error: "Gagal menambahkan favorit" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const firebase_uid = req.firebase_uid;
    const specific_plant_id = req.params.id;

    const user = await User.findOne({ where: { firebase_uid } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const deleted = await Favorite.destroy({
      where: { user_id: user.id, specific_plant_id },
    });

    if (deleted === 0)
      return res.status(404).json({ error: "Favorit tidak ditemukan" });

    res.json({ message: "Favorit dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus favorit" });
  }
};
