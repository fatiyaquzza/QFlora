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
