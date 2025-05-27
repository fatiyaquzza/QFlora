const { SpecificPlant, SpecificPlantVerse, ChemicalComponent, SpecificPlantChemicalComponent } = require("../models");
const db = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await SpecificPlant.findAll({
      include: [
        { model: SpecificPlantVerse, as: "verses" },
        { model: db.ChemicalComponent, as: "chemical_components", through: { attributes: [] } }
      ],
    });
    res.json(data);
  } catch (err) {
    console.error("❌ ERROR getAll:", err);
    res.status(500).json({ error: "Gagal mengambil data tumbuhan spesifik" });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await SpecificPlant.findByPk(req.params.id, {
      include: [
        { model: SpecificPlantVerse, as: "verses" },
        { model: db.ChemicalComponent, as: "chemical_components", through: { attributes: [] } }
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
    const { chemical_component_ids, ...plantData } = req.body;
    const data = await SpecificPlant.create(plantData);

    if (chemical_component_ids && chemical_component_ids.length > 0) {
      await data.setChemical_components(chemical_component_ids);
    }

    // To return the created plant with its associations
    const result = await SpecificPlant.findByPk(data.id, {
      include: [
        { model: SpecificPlantVerse, as: "verses" },
        { model: db.ChemicalComponent, as: "chemical_components", through: { attributes: [] } }
      ],
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Error create specific plant:", err);
    res.status(500).json({ error: "Gagal menambah tanaman spesifik" });
  }
};

exports.update = async (req, res) => {
  try {
    const { chemical_component_ids, ...plantData } = req.body;
    const plant = await SpecificPlant.findByPk(req.params.id);

    if (!plant) {
      return res.status(404).json({ error: "Tumbuhan tidak ditemukan" });
    }

    await plant.update(plantData);

    if (chemical_component_ids) { // Allows sending empty array to remove all
      await plant.setChemical_components(chemical_component_ids);
    }

    // To return the updated plant with its associations
    const result = await SpecificPlant.findByPk(req.params.id, {
      include: [
        { model: SpecificPlantVerse, as: "verses" },
        { model: db.ChemicalComponent, as: "chemical_components", through: { attributes: [] } }
      ],
    });

    res.json({ message: "Data diperbarui", data: result });
  } catch (err) {
    console.error("Error update specific plant:", err);
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

exports.deleteAll = async (req, res) => {
  try {
    await SpecificPlant.destroy({ where: {}, cascade: true }); // tanpa truncate
    res.json({ message: "Semua data berhasil dihapus." });
  } catch (err) {
    console.error("❌ Gagal deleteAll:", err);
    res
      .status(500)
      .json({ error: "Gagal menghapus semua tumbuhan: " + err.message });
  }
};
