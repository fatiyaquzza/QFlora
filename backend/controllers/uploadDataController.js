const xlsx = require("xlsx");
const fs = require("fs");

const {
  SpecificPlant,
  SpecificPlantVerse,
  GeneralCategory,
  GeneralCategoryVerse,
  SpecificPlantClassification,
} = require("../models");

const importSpecificPlantClassifications = async (req, res) => {
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
        const name = row["Nama Tumbuhan"]?.trim();
        if (!name) {
          console.warn(`❗ Baris ke-${index + 2}: Nama Tumbuhan kosong`);
          continue;
        }

        const plant = await SpecificPlant.findOne({ where: { name } });
        if (!plant) {
          console.warn(
            `❗ Baris ke-${index + 2}: Tumbuhan "${name}" tidak ditemukan`
          );
          continue;
        }

        const existingClassification =
          await SpecificPlantClassification.findOne({
            where: { specific_plant_id: plant.id },
          });

        if (existingClassification) {
          console.warn(
            `❗ Baris ke-${index + 2}: Klasifikasi untuk "${name}" sudah ada`
          );
          continue;
        }

        await SpecificPlantClassification.create({
          specific_plant_id: plant.id,
          kingdom: row["kingdom"] || "Plantae",
          subkingdom: row["subkingdom"] || "",
          superdivision: row["superdivision"] || "",
          division: row["division"] || "",
          class: row["class"] || "",
          subclass: row["subclass"] || "",
          order: row["order"] || "",
          family: row["family"] || "",
          genus: row["genus"] || "",
          species: row["species"] || "",
        });
      } catch (rowErr) {
        console.error(`❌ Gagal proses baris ${index + 2}:`, rowErr);
      }
    }

    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: "Import klasifikasi berhasil!" });
  } catch (err) {
    console.error("❌ ERROR IMPORT KLASIFIKASI:", err);
    res
      .status(500)
      .json({ message: "Gagal import klasifikasi.", error: err.message });
  }
};

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

        const existingVerse = await SpecificPlantVerse.findOne({
          where: {
            specific_plant_id: plant.id,
            surah: row["Surah"],
            verse_number: row["Nomor Ayat"],
          },
        });

        if (existingVerse) {
          console.warn(
            `⚠️ Baris ${index + 2}: Ayat ${row["Surah"]}:${
              row["Nomor Ayat"]
            } sudah ada untuk "${plantName}", dilewati.`
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
        const categoryName = row["Nama Kategori Umum"]?.trim();
        const surah = row["Surah"]?.trim();
        const verse_number = row["Nomor Ayat"];

        if (!categoryName || !surah || !verse_number) {
          console.warn(`❗ Baris ${index + 2}: Data tidak lengkap`);
          continue;
        }

        const category = await GeneralCategory.findOne({
          where: { name: categoryName },
        });

        if (!category) {
          console.warn(
            `❗ Baris ${index + 2}: Kategori "${categoryName}" tidak ditemukan`
          );
          continue;
        }

        // 🔍 Cek apakah kombinasi sudah ada
        const existingVerse = await GeneralCategoryVerse.findOne({
          where: {
            general_category_id: category.id,
            surah: surah,
            verse_number: verse_number,
          },
        });

        if (existingVerse) {
          console.warn(
            `⚠️ Baris ${index + 2}: Ayat "${surah} - ${verse_number}" untuk kategori "${categoryName}" sudah ada`
          );
          continue;
        }

        await GeneralCategoryVerse.create({
          general_category_id: category.id,
          surah,
          verse_number,
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

    res.status(200).json({ message: "Import berhasil!" });
  } catch (err) {
    console.error("❌ ERROR IMPORT:", err);
    res.status(500).json({
      message: "Gagal import. Pastikan format Excel sesuai.",
      error: err.message,
    });
  }
};


const importSpecificPlants = async (req, res) => {
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
        const name = row["name"]?.trim();
        if (!name) {
          console.warn(`❗ Baris ke-${index + 2}: Nama kosong`);
          continue;
        }

        const existing = await SpecificPlant.findOne({ where: { name } });
        if (existing) {
          console.warn(
            `❗ Baris ke-${index + 2}: Tumbuhan "${name}" sudah ada`
          );
          continue;
        }

        await SpecificPlant.create({
          name,
          latin_name: row["latin_name"] || "",
          image_url: row["image_url"] || "",
          plant_type: row["plant_type"] || "Buah",
          overview: row["overview"] || "",
          description: row["description"] || "",
          benefits: row["benefits"] || "",
          characteristics: row["characteristics"] || "",
          origin: row["origin"] || "",
          chemical_comp: row["chemical_comp"] || "",
          cultivation: row["cultivation"] || "",
          source_ref: row["source_ref"] || "",
          eng_name: row["eng_name"] || "",
          arab_name: row["arab_name"] || "",
        });
      } catch (err) {
        console.error(`❌ Baris ${index + 2} gagal diproses:`, err);
      }
    }

    fs.unlinkSync(req.file.path); // hapus file setelah proses
    res.status(200).json({ message: "Import tanaman spesifik berhasil!" });
  } catch (err) {
    console.error("❌ ERROR IMPORT TANAMAN:", err);
    res
      .status(500)
      .json({ message: "Gagal import tanaman.", error: err.message });
  }
};

const importGeneralPlants = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "File tidak ditemukan." });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "File kosong atau tidak valid." });
    }

    for (const [index, row] of data.entries()) {
      try {
        const name = row["name"]?.trim();
        if (!name) {
          console.warn(`❗ Baris ${index + 2}: Nama kosong`);
          continue;
        }

        const existing = await GeneralCategory.findOne({ where: { name } });
        if (existing) {
          console.warn(`❗ Baris ${index + 2}: "${name}" sudah ada`);
          continue;
        }

        await GeneralCategory.create({
          name,
          latin_name: row["latin_name"] || "",
          image_url: row["image_url"] || "",
          overview: row["overview"] || "",
        });
      } catch (err) {
        console.error(`❌ Baris ${index + 2} gagal:`, err);
      }
    }

    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: "Berhasil import kategori umum!" });
  } catch (err) {
    console.error("❌ ERROR IMPORT:", err);
    res
      .status(500)
      .json({ message: "Gagal import kategori umum", error: err.message });
  }
};

module.exports = {
  importGeneralVerses,
  importSpecificPlantVerses,
  importSpecificPlants,
  importSpecificPlantClassifications,
  importGeneralPlants,
};
