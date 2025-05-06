const { SpecificPlant } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await SpecificPlant.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data tumbuhan spesifik" });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await SpecificPlant.findByPk(id);

    if (!data) {
      return res.status(404).json({ error: "Tumbuhan tidak ditemukan" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
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
