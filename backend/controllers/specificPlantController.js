const {
  SpecificPlant,
  SpecificPlantVerse,
  SpecificPlantClassification,
} = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await SpecificPlant.findAll({
      include: [
        { model: SpecificPlantVerse, as: "verses" },
        { model: SpecificPlantClassification, as: "classifications" },
      ],
    });
    res.json(data);
  } catch (err) {
    console.error("❌ ERROR getAll:", err); // Tambahkan ini
    res.status(500).json({ error: "Gagal mengambil data tumbuhan spesifik" });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await SpecificPlant.findByPk(req.params.id, {
      include: [
        { model: SpecificPlantVerse, as: "verses" },
        { model: SpecificPlantClassification, as: "classifications" },
      ],
    });

    if (!data)
      return res.status(404).json({ error: "Tumbuhan tidak ditemukan" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await SpecificPlant.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambah tanaman spesifik" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await SpecificPlant.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Data diperbarui", updated });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengupdate data" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SpecificPlant.destroy({
      where: { id: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus data" });
  }
};

// Tambah ayat
exports.addVerse = async (req, res) => {
  try {
    const { specific_plant_id } = req.params;
    const verse = await SpecificPlantVerse.create({
      ...req.body,
      specific_plant_id,
    });
    res.status(201).json(verse);
  } catch (err) {
    console.error("❌ Gagal menambah ayat:", err);
    res.status(500).json({ error: "Gagal menambah ayat" });
  }
};

// Hapus ayat
exports.deleteVerse = async (req, res) => {
  try {
    const { specific_plant_id, verseId } = req.params;
    const deleted = await SpecificPlantVerse.destroy({
      where: { id: verseId, specific_plant_id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Ayat tidak ditemukan" });
    res.json({ message: "Ayat berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus ayat" });
  }
};

// Update ayat
exports.updateVerse = async (req, res) => {
  try {
    const { specific_plant_id, verseId } = req.params;
    const updated = await SpecificPlantVerse.update(req.body, {
      where: { id: verseId, specific_plant_id },
    });
    res.json({ message: "Ayat berhasil diperbarui", updated });
  } catch (err) {
    res.status(500).json({ error: "Gagal memperbarui ayat" });
  }
};

exports.addClassification = async (req, res) => {
  try {
    const { specific_plant_id } = req.params;
    const newData = await SpecificPlantClassification.create({
      ...req.body,
      specific_plant_id,
    });
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambahkan klasifikasi" });
  }
};

exports.updateClassification = async (req, res) => {
  try {
    const { specific_plant_id, classificationId } = req.params;
    const updated = await SpecificPlantClassification.update(req.body, {
      where: { id: classificationId, specific_plant_id },
    });
    res.json({ message: "Klasifikasi diperbarui", updated });
  } catch (err) {
    res.status(500).json({ error: "Gagal memperbarui klasifikasi" });
  }
};

exports.deleteClassification = async (req, res) => {
  try {
    const { specific_plant_id, classificationId } = req.params;
    const deleted = await SpecificPlantClassification.destroy({
      where: { id: classificationId, specific_plant_id },
    });
    if (!deleted) return res.status(404).json({ error: "Tidak ditemukan" });
    res.json({ message: "Klasifikasi dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus klasifikasi" });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await SpecificPlant.destroy({ where: {}, cascade: true }); // tanpa truncate
    res.json({ message: "Semua data berhasil dihapus." });
  } catch (err) {
    console.error("❌ Gagal deleteAll:", err);
    res.status(500).json({ error: "Gagal menghapus semua tumbuhan: " + err.message });
  }
};

