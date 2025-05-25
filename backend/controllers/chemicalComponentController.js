const { ChemicalComponent } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await ChemicalComponent.findAll({
      order: [["name", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching chemical components:", err);
    res.status(500).json({ error: "Gagal mengambil data komponen kimia" });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ChemicalComponent.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ error: "Komponen kimia tidak ditemukan" });
    res.json(data);
  } catch (err) {
    console.error("Error fetching chemical component by ID:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nama komponen kimia wajib diisi" });
    }
    const existing = await ChemicalComponent.findOne({ where: { name } });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Komponen kimia dengan nama ini sudah ada" });
    }
    const data = await ChemicalComponent.create({ name });
    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating chemical component:", err);
    res.status(500).json({ error: "Gagal menambah komponen kimia" });
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nama komponen kimia wajib diisi" });
    }
    // Check if new name already exists (excluding current item)
    const existing = await ChemicalComponent.findOne({
      where: { name, id: { [require("sequelize").Op.ne]: req.params.id } },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Komponen kimia dengan nama ini sudah ada" });
    }

    const [updatedCount] = await ChemicalComponent.update(
      { name },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ error: "Komponen kimia tidak ditemukan" });
    }
    const updatedData = await ChemicalComponent.findByPk(req.params.id);
    res.json({ message: "Data diperbarui", data: updatedData });
  } catch (err) {
    console.error("Error updating chemical component:", err);
    res.status(500).json({ error: "Gagal mengupdate data" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await ChemicalComponent.destroy({
      where: { id: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Komponen kimia tidak ditemukan" });
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting chemical component:", err);
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: "Gagal menghapus: Komponen kimia ini masih digunakan oleh tumbuhan." });
    }
    res.status(500).json({ error: "Gagal menghapus data" });
  }
}; 