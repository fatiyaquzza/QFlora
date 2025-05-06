const { GeneralCategory } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await GeneralCategory.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data kategori umum" });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await GeneralCategory.findByPk(id);

    if (!data) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await GeneralCategory.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambah kategori" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await GeneralCategory.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0)
      return res.status(404).json({ error: "Tidak ditemukan" });
    res.json({ message: "Kategori dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await GeneralCategory.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Kategori berhasil diperbarui", updated });
  } catch (err) {
    res.status(500).json({ error: "Gagal memperbarui kategori" });
  }
};
