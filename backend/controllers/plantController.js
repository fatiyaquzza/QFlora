const {
  SpecificPlant,
  GeneralCategory,
  Favorite,
  GeneralFavorite,
  sequelize,
} = require("../models");

const isValidUrl = (url) => typeof url === "string" && url.startsWith("http");

exports.getAllPlants = async (req, res) => {
  try {
    const specifics = await SpecificPlant.findAll();
    const generals = await GeneralCategory.findAll();

    const specificPlants = specifics
      .filter((p) => isValidUrl(p.image_url))
      .map((p) => ({ ...p.toJSON(), type: "specific" }));

    const generalPlants = generals
      .filter((p) => isValidUrl(p.image_url))
      .map((p) => ({ ...p.toJSON(), type: "general" }));

    const combined = [...specificPlants, ...generalPlants];

    res.json(combined);
  } catch (err) {
    console.error("❌ Gagal ambil tumbuhan:", err);
    res.status(500).json({ error: "Gagal mengambil data tumbuhan" });
  }
};

exports.getPopularPlants = async (req, res) => {
  try {
    const topSpecific = await Favorite.findAll({
      attributes: [
        "specific_plant_id",
        [sequelize.fn("COUNT", sequelize.col("specific_plant_id")), "likes"],
      ],
      include: [
        {
          model: SpecificPlant,
          as: "SpecificPlant", // ⬅️ sesuai dengan alias di relasi model
          required: true,
        },
      ],
      group: ["specific_plant_id", "SpecificPlant.id"],
      order: [[sequelize.literal("likes"), "DESC"]],
      limit: 10,
    });

    const topGeneral = await GeneralFavorite.findAll({
      attributes: [
        "general_category_id",
        [sequelize.fn("COUNT", sequelize.col("general_category_id")), "likes"],
      ],
      include: [
        {
          model: GeneralCategory,
          as: "GeneralCategory", // ⬅️ sesuai dengan alias di relasi model
          required: true,
        },
      ],
      group: ["general_category_id", "GeneralCategory.id"],
      order: [[sequelize.literal("likes"), "DESC"]],
      limit: 10,
    });

    const specificMapped = topSpecific.map((fav) => ({
      ...fav.SpecificPlant.toJSON(),
      type: "specific",
      likes: parseInt(fav.dataValues.likes),
    }));

    const generalMapped = topGeneral.map((fav) => ({
      ...fav.GeneralCategory.toJSON(),
      type: "general",
      likes: parseInt(fav.dataValues.likes),
    }));

    const combined = [...specificMapped, ...generalMapped].sort(
      (a, b) => b.likes - a.likes
    );

    res.json(combined);
  } catch (err) {
    console.error("❌ Error getPopularPlants:", err);
    res.status(500).json({ error: "Gagal mengambil tumbuhan populer" });
  }
};
