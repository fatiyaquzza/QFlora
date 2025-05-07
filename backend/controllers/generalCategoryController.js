const { GeneralCategory, GeneralCategoryVerse } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await GeneralCategory.findAll({
      include: {
        model: GeneralCategoryVerse,
        as: "verses",
      },
    });
    res.json(data);
  } catch (err) {
    console.error("ERROR getAll:", err); // debug log
    res.status(500).json({ error: "Gagal mengambil data kategori umum" });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await GeneralCategory.findByPk(req.params.id, {
      include: {
        model: GeneralCategoryVerse,
        as: "verses",
      },
    });

    if (!data) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Membuat kategori baru
exports.create = async (req, res) => {
  try {
    const data = await GeneralCategory.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambah kategori" });
  }
};

// Menghapus kategori
exports.remove = async (req, res) => {
  try {
    const deleted = await GeneralCategory.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Tidak ditemukan" });
    res.json({ message: "Kategori dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus" });
  }
};

// Update kategori
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

// Tambah ayat untuk kategori tertentu
exports.addVerse = async (req, res) => {
  try {
    const { general_category_id } = req.params;
    const verse = await GeneralCategoryVerse.create({
      ...req.body,
      general_category_id,
    });
    res.status(201).json(verse);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambahkan ayat" });
  }
};

// Hapus ayat tertentu
exports.deleteVerse = async (req, res) => {
  try {
    const { general_category_id, verseId } = req.params;
    const deleted = await GeneralCategoryVerse.destroy({
      where: { id: verseId, general_category_id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Ayat tidak ditemukan" });
    res.json({ message: "Ayat berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus ayat" });
  }
};

exports.updateVerse = async (req, res) => {
  try {
    const { general_category_id, verseId } = req.params;
    const updated = await GeneralCategoryVerse.update(req.body, {
      where: { id: verseId, general_category_id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Ayat tidak ditemukan" });
    }

    res.json({ message: "Ayat berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal update ayat:", err);
    res.status(500).json({ error: "Gagal update ayat" });
  }
};
