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

    const combined = [
      ...specifics
        .filter((p) => isValidUrl(p.image_url))
        .map((p) => ({
          ...p.toJSON(),
          type: "specific",
        })),
      ...generals
        .filter((p) => isValidUrl(p.image_url))
        .map((p) => ({
          ...p.toJSON(),
          type: "general",
        })),
    ];

    res.json(combined);
  } catch (err) {
    console.error("❌ Gagal ambil tumbuhan:", err);
    res.status(500).json({ error: "Gagal mengambil data tumbuhan" });
  }
};

exports.getPopularPlants = async (req, res) => {
  try {
    const topSpecific = await Favorite.findAll({
      attributes: ["specific_plant_id", [sequelize.fn("COUNT", "id"), "likes"]],
      group: ["specific_plant_id"],
      order: [[sequelize.literal("likes"), "DESC"]],
      limit: 10,
      include: [{ model: SpecificPlant }],
    });

    const topGeneral = await GeneralFavorite.findAll({
      attributes: [
        "general_category_id",
        [sequelize.fn("COUNT", "id"), "likes"],
      ],
      group: ["general_category_id"],
      order: [[sequelize.literal("likes"), "DESC"]],
      limit: 10,
      include: [{ model: GeneralCategory }],
    });

    const combined = [
      ...topSpecific.map((fav) => ({
        ...fav.SpecificPlant.toJSON(),
        type: "specific",
        likes: fav.dataValues.likes,
      })),
      ...topGeneral.map((fav) => ({
        ...fav.GeneralCategory.toJSON(),
        type: "general",
        likes: fav.dataValues.likes,
      })),
    ];

    res.json(combined.sort((a, b) => b.likes - a.likes));
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil tumbuhan populer" });
  }
};
