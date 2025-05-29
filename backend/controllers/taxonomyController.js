const db = require("../models");

// 🔁 Ambil semua data taksonomi
exports.getAllFull = async (req, res) => {
  try {
    const data = {
      subkingdoms: await db.Subkingdom.findAll(),
      superdivisions: await db.Superdivision.findAll(),
      divisions: await db.Division.findAll(),
      classes: await db.Class.findAll(),
      subclasses: await db.Subclass.findAll(),
      orders: await db.Order.findAll(),
      families: await db.Family.findAll(),
      genuses: await db.Genus.findAll(),
      species: await db.Species.findAll(),
    };
    res.json(data);
  } catch (err) {
    console.error("❌ Gagal mengambil taxonomy:", err);
    res.status(500).json({ error: "Gagal mengambil data taxonomy" });
  }
};

// 🔄 Update data taksonomi
exports.updateFullTaxonomy = async (req, res) => {
  const {
    subkingdom,
    superdivision,
    division,
    class_: kelas,
    subclass,
    order,
    family,
    genus,
    species,
  } = req.body;

  const t = await db.sequelize.transaction();
  try {
    // Mencari atau membuat data taksonomi secara berurutan
    const [sub] = await db.Subkingdom.findOrCreate({
      where: { name: subkingdom },
      transaction: t,
    });

    const [sup] = await db.Superdivision.findOrCreate({
      where: { name: superdivision },
      defaults: { subkingdom_id: sub.id },
      transaction: t,
    });
    // Update subkingdom_id jika sudah ada
    if (!sup.isNewRecord) {
      await sup.update({ subkingdom_id: sub.id }, { transaction: t });
    }

    const [div] = await db.Division.findOrCreate({
      where: { name: division },
      defaults: { superdivision_id: sup.id },
      transaction: t,
    });
    if (!div.isNewRecord) {
      await div.update({ superdivision_id: sup.id }, { transaction: t });
    }

    const [cls] = await db.Class.findOrCreate({
      where: { name: kelas },
      defaults: { division_id: div.id },
      transaction: t,
    });
    if (!cls.isNewRecord) {
      await cls.update({ division_id: div.id }, { transaction: t });
    }

    const [subc] = await db.Subclass.findOrCreate({
      where: { name: subclass },
      defaults: { class_id: cls.id },
      transaction: t,
    });
    if (!subc.isNewRecord) {
      await subc.update({ class_id: cls.id }, { transaction: t });
    }

    const [ord] = await db.Order.findOrCreate({
      where: { name: order },
      defaults: { subclass_id: subc.id },
      transaction: t,
    });
    if (!ord.isNewRecord) {
      await ord.update({ subclass_id: subc.id }, { transaction: t });
    }

    const [fam] = await db.Family.findOrCreate({
      where: { name: family },
      defaults: { order_id: ord.id },
      transaction: t,
    });
    if (!fam.isNewRecord) {
      await fam.update({ order_id: ord.id }, { transaction: t });
    }

    const [gen] = await db.Genus.findOrCreate({
      where: { name: genus },
      defaults: { family_id: fam.id },
      transaction: t,
    });
    if (!gen.isNewRecord) {
      await gen.update({ family_id: fam.id }, { transaction: t });
    }

    const [spc] = await db.Species.findOrCreate({
      where: { name: species },
      defaults: { genus_id: gen.id },
      transaction: t,
    });
    if (!spc.isNewRecord) {
      await spc.update({ genus_id: gen.id }, { transaction: t });
    }

    await t.commit();
    res.status(200).json({
      message: "Berhasil memperbarui data",
      species_id: spc.id
    });
  } catch (err) {
    await t.rollback();
    console.error("❌ Gagal memperbarui:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createFullTaxonomy = async (req, res) => {
  const {
    subkingdom,
    superdivision,
    division,
    class_: kelas,
    subclass,
    order,
    family,
    genus,
    species,
  } = req.body;

  const t = await db.sequelize.transaction();
  try {
    const [sub] = await db.Subkingdom.findOrCreate({
      where: { name: subkingdom },
      transaction: t,
    });

    const [sup] = await db.Superdivision.findOrCreate({
      where: { name: superdivision, subkingdom_id: sub.id },
      transaction: t,
    });

    const [div] = await db.Division.findOrCreate({
      where: { name: division, superdivision_id: sup.id },
      transaction: t,
    });

    const [cls] = await db.Class.findOrCreate({
      where: { name: kelas, division_id: div.id },
      transaction: t,
    });

    const [subc] = await db.Subclass.findOrCreate({
      where: { name: subclass, class_id: cls.id },
      transaction: t,
    });

    const [ord] = await db.Order.findOrCreate({
      where: { name: order, subclass_id: subc.id },
      transaction: t,
    });

    const [fam] = await db.Family.findOrCreate({
      where: { name: family, order_id: ord.id },
      transaction: t,
    });

    const [gen] = await db.Genus.findOrCreate({
      where: { name: genus, family_id: fam.id },
      transaction: t,
    });

    const [spc] = await db.Species.findOrCreate({
      where: { name: species, genus_id: gen.id },
      transaction: t,
    });

    await t.commit();
    res.status(201).json({ message: "Berhasil menyimpan semua data" });
  } catch (err) {
    await t.rollback();
    console.error("❌ Gagal menyimpan:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete functions for each taxonomy level
exports.deleteSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if species is used in specific_plants
    const specificPlants = await db.SpecificPlant.findAll({
      where: { species_id: id }
    });

    if (specificPlants.length > 0) {
      return res.status(400).json({ 
        error: "Species ini tidak dapat dihapus karena masih digunakan di data tanaman spesifik",
        usedIn: specificPlants.length
      });
    }

    await db.Species.destroy({ where: { id } });
    res.json({ message: "Species berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus species:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGenus = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Genus.destroy({ where: { id } });
    res.json({ message: "Genus berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus genus:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFamily = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Family.destroy({ where: { id } });
    res.json({ message: "Family berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus family:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Order.destroy({ where: { id } });
    res.json({ message: "Order berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus order:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubclass = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Subclass.destroy({ where: { id } });
    res.json({ message: "Subclass berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus subclass:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Class.destroy({ where: { id } });
    res.json({ message: "Class berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus class:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Division.destroy({ where: { id } });
    res.json({ message: "Division berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus division:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSuperdivision = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Superdivision.destroy({ where: { id } });
    res.json({ message: "Superdivision berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus superdivision:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubkingdom = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Subkingdom.destroy({ where: { id } });
    res.json({ message: "Subkingdom berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus subkingdom:", err);
    res.status(500).json({ error: err.message });
  }
};
