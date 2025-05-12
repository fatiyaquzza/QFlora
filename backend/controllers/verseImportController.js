const xlsx = require("xlsx");
const fs = require("fs");

const {
  SpecificPlant,
  SpecificPlantVerse,
  GeneralCategory,
  GeneralCategoryVerse,
} = require("../models");

const importSpecificPlantVerses = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File tidak ditemukan dalam request." });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ message: "File Excel kosong atau tidak terbaca." });
    }

    for (const [index, row] of data.entries()) {
      try {
        const plantName = row["Nama Tumbuhan"]?.trim();

        if (!plantName) {
          console.warn(`❗ Baris ${index + 2}: Nama Tumbuhan kosong`);
          continue;
        }

        const plant = await SpecificPlant.findOne({
          where: { name: plantName },
        });

        if (!plant) {
          console.warn(
            `❗ Baris ${index + 2}: Tumbuhan "${plantName}" tidak ditemukan`
          );
          continue;
        }

        await SpecificPlantVerse.create({
          specific_plant_id: plant.id,
          surah: row["Surah"],
          verse_number: row["Nomor Ayat"],
          quran_verse: row["Ayat Al-Qur'an"],
          translation: row["Terjemahan"],
          audio_url: row["Audio URL"],
          keyword_arab: row["Kata Kunci Arab"] || null,
        });
      } catch (rowErr) {
        console.error(`❌ Gagal proses baris ${index + 2}:`, rowErr);
      }
    }

    fs.unlinkSync(req.file.path);
    res
      .status(200)
      .json({ message: "Import ayat tumbuhan spesifik berhasil!" });
  } catch (err) {
    console.error("❌ ERROR IMPORT SPESIFIK:", err);
    res.status(500).json({
      message: "Gagal import ayat tumbuhan spesifik.",
      error: err.message,
    });
  }
};

const importGeneralVerses = async (req, res) => {
  try {
    // Validasi file tersedia
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan dalam request." });
    }

    // Baca file Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Validasi isi
    if (!data || data.length === 0) {
      return res.status(400).json({ message: "File Excel kosong atau tidak terbaca." });
    }

    // Loop setiap baris
    for (const [index, row] of data.entries()) {
      try {
        const categoryName = row["Nama Kategori Umum"]?.trim();

        if (!categoryName) {
          console.warn(`❗ Baris ${index + 2}: Nama Kategori kosong`);
          continue;
        }

        const category = await GeneralCategory.findOne({
          where: { name: categoryName },
        });

        if (!category) {
          console.warn(`❗ Baris ${index + 2}: Kategori "${categoryName}" tidak ditemukan di database`);
          continue;
        }

        await GeneralCategoryVerse.create({
            general_category_id: category.id,
            surah: row["Surah"],
            verse_number: row["Nomor Ayat"],
            quran_verse: row["Ayat Al-Qur'an"],  // cocokkan dengan field model
            translation: row["Terjemahan"],
            audio_url: row["Audio URL"],
            keyword_arab: row["Kata Kunci Arab"] || null,
          });
          
      } catch (rowErr) {
        console.error(`❌ Gagal proses baris ${index + 2}:`, rowErr);
      }
    }

    // Hapus file setelah diproses
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "Import berhasil!" });
  } catch (err) {
    console.error("❌ ERROR IMPORT:", err);
    res.status(500).json({
      message: "Gagal import. Pastikan format Excel sesuai.",
      error: err.message,
    });
  }
};


module.exports = {
  importGeneralVerses,
  importSpecificPlantVerses,
};
