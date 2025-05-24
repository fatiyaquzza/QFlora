import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";

function SpecificPlantsPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [form] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    plant_type_id: "",
    overview: "",
    description: "",
    benefits: "",
    characteristics: "",
    origin: "",
    chemical_comp: "",
    cultivation: "",
    source_ref: "",
    eng_name: "",
    arab_name: "",
  });
  const [editing, setEditing] = useState(null);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);

  const [excelSpecific, setExcelSpecific] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [excelTanaman, setExcelTanaman] = useState(null);
  const [showUploadSelector, setShowUploadSelector] = useState(false);
  const [uploadType, setUploadType] = useState("");

  const [verseEditing, setVerseEditing] = useState(null);
  const [newVerse] = useState({
    surah: "",
    verse_number: "",
    quran_verse: "",
    translation: "",
    audio_url: "",
    keyword_arab: "",
  });

  const [taxonomyData, setTaxonomyData] = useState({});

  const [plantTypes, setPlantTypes] = useState([]);

  const handleUploadPlantExcel = async () => {
    if (!excelTanaman) return alert("Pilih file Excel terlebih dahulu.");
    const formData = new FormData();
    formData.append("file", excelTanaman);

    try {
      await axiosClient.post("/api/import-specific-plants", formData); // endpoint baru
      alert("Berhasil mengimport data tumbuhan!");
      refreshData();
      setExcelTanaman(null);
    } catch (err) {
      alert("Gagal import: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantsRes, typesRes] = await Promise.all([
          axiosClient.get("/specific-plants"),
          axiosClient.get("/api/plant-types"),
        ]);
        setPlants(plantsRes.data);
        setPlantTypes(typesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();

    axiosClient
      .get("/api/taxonomy/full")
      .then((res) => {
        const taxonomyMap = {};

        res.data.species.forEach((species) => {
          const genus = res.data.genuses.find((g) => g.id === species.genus_id);
          if (!genus) return;

          const family = res.data.families.find(
            (f) => f.id === genus.family_id
          );
          if (!family) return;

          const order = res.data.orders.find((o) => o.id === family.order_id);
          if (!order) return;

          const subclass = res.data.subclasses.find(
            (sc) => sc.id === order.subclass_id
          );
          if (!subclass) return;

          const classData = res.data.classes.find(
            (c) => c.id === subclass.class_id
          );
          if (!classData) return;

          const division = res.data.divisions.find(
            (d) => d.id === classData.division_id
          );
          if (!division) return;

          const superdivision = res.data.superdivisions.find(
            (sd) => sd.id === division.superdivision_id
          );
          if (!superdivision) return;

          const subkingdom = res.data.subkingdoms.find(
            (sk) => sk.id === superdivision.subkingdom_id
          );
          if (!subkingdom) return;

          taxonomyMap[species.id] = {
            kingdom: "Plantae",
            subkingdom: subkingdom.name,
            superdivision: superdivision.name,
            division: division.name,
            class: classData.name,
            subclass: subclass.name,
            order: order.name,
            family: family.name,
            genus: genus.name,
            species: species.name,
          };
        });

        setTaxonomyData(taxonomyMap);
      })
      .catch((err) => {
        console.error("Error loading taxonomy data:", err);
      });
  }, []);

  const refreshData = () => {
    axiosClient.get("/specific-plants").then((res) => setPlants(res.data));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosClient.put(`/specific-plants/${editing.id}`, editing).then(() => {
      refreshData();
      setEditing(null);
    });
  };

  const handleDeleteClick = (plant) => {
    setPlantToDelete(plant);
    setShowDeleteModal(true);
  };

  const confirmDeletePlant = async () => {
    if (plantToDelete) {
      await axiosClient.delete(`/specific-plants/${plantToDelete.id}`);
      setShowDeleteModal(false);
      setPlantToDelete(null);
      refreshData();
    }
  };

  const handleUpdateVerse = async (e) => {
    e.preventDefault();
    await axiosClient.put(
      `/specific-plants/${selectedPlantId}/verses/${verseEditing.id}`,
      verseEditing
    );
    refreshData();
    setVerseEditing(null);
  };

  const handleDeleteVerse = async (plantId, verseId) => {
    await axiosClient.delete(`/specific-plants/${plantId}/verses/${verseId}`);
    refreshData();
  };

  const handleDeleteAllPlants = async () => {
    try {
      await axiosClient.delete("/specific-plants/all");
      setShowDeleteAllModal(false);
      refreshData();
      alert("Semua tumbuhan berhasil dihapus.");
    } catch (err) {
      alert(
        "Gagal menghapus semua tumbuhan: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  const handleUploadSpecificExcel = async () => {
    if (!excelSpecific) return alert("Pilih file Excel terlebih dahulu.");
    const formData = new FormData();
    formData.append("file", excelSpecific);

    try {
      await axiosClient.post("/api/import-specific-verses", formData);
      alert("Berhasil mengimport ayat spesifik!");
      refreshData();
      setExcelSpecific(null);
    } catch (err) {
      alert("Gagal import: " + (err.response?.data?.error || err.message));
    }
  };

  const getPlantTypeName = (typeId) => {
    const plantType = plantTypes.find((type) => type.id === typeId);
    return plantType ? plantType.name : "";
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto  font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-black">
              Daftar Kategori Spesifik
            </h1>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm text-white bg-blue-700 rounded hover:bg-green-700"
                onClick={() => setShowUploadSelector(true)}
              >
                +
              </button>

              <button
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-800"
                onClick={() => setShowDeleteAllModal(true)}
              >
                Hapus Semua
              </button>

              <button
                className="px-4 py-2 text-sm text-white bg-[#004E1D] rounded hover:bg-green-700"
                onClick={() => navigate("/specific-plant/add")}
              >
                Tambah
              </button>
            </div>
          </div>
          <div className="border-t border-gray-300 mb-4"></div>

          <div className="overflow-x-auto ">
            <table className="w-full text-sm text-left border-separate border-spacing-y-4">
              <thead className="text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Latin</th>
                  <th className="px-4 py-2">Inggris</th>
                  <th className="px-4 py-2">Arab</th>
                  <th className="px-4 py-2">Gambar</th>
                  <th className="px-4 py-2">Jenis</th>
                  <th className="px-4 py-2">Ayat</th>
                  <th className="px-4 py-2">Klasifikasi</th>
                  <th className="px-4 py-2">Deskripsi</th>
                  <th className="px-4 py-2">Manfaat</th>
                  <th className="px-4 py-2">Ciri-ciri</th>
                  <th className="px-4 py-2">Asal</th>
                  <th className="px-4 py-2">Kandungan Kimia</th>
                  <th className="px-4 py-2">Budidaya</th>
                  <th className="px-4 py-2">Sumber Referensi</th>
                  <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant) => (
                  <tr
                    key={plant.id}
                    className="bg-white shadow rounded align-top"
                  >
                    <td className="px-4 py-4">
                      <div
                        className="min-h-40 overflow-y-auto pr-1"
                        style={{ minHeight: "100px" }}
                      >
                        {plant.name}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="min-h-40 overflow-y-auto pr-1"
                        style={{ minHeight: "100px" }}
                      >
                        {plant.latin_name}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="min-h-40 overflow-y-auto pr-1"
                        style={{ minHeight: "100px" }}
                      >
                        {plant.eng_name}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="min-h-40 overflow-y-auto pr-1"
                        style={{ minHeight: "100px" }}
                      >
                        {plant.arab_name}
                      </div>
                    </td>
                    <td className="px-4 py-4 w-44 min-w-44">
                      <img
                        src={plant.image_url}
                        className="w-40 h-40 object-cover rounded-md"
                        alt="img"
                      />
                    </td>
                    <td className="px-4 py-4 w-28">
                      {getPlantTypeName(plant.plant_type_id)}
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div
                        className="max-h-64 overflow-y-auto pr-2 w-80"
                        style={{ minHeight: "150px" }}
                      >
                        {plant.verses?.map((v) => (
                          <div
                            key={v.id}
                            className="mb-3 border-b border-gray-200 pb-2 last:border-none"
                          >
                            <p>
                              {" "}
                              <b>
                                {v.surah} - {v.verse_number}
                              </b>
                            </p>
                            <p className="text-sm text-right">
                              {v.quran_verse}
                            </p>
                            <p className="text-sm text-gray-700">
                              {v.translation}
                            </p>
                            <audio controls className="w-full mt-1">
                              <source src={v.audio_url} type="audio/mpeg" />
                            </audio>
                            {v.keyword_arab && (
                              <p className="text-sm text-amber-800 mt-1">
                                🔍{" "}
                                <span className="font-semibold">
                                  Kata kunci Arab:
                                </span>{" "}
                                <span className="bg-yellow-100 px-1 py-0.5 rounded text-black">
                                  {v.keyword_arab}
                                </span>
                              </p>
                            )}
                            <div className="flex gap-2 mt-1">
                              <button
                                className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={() => {
                                  setSelectedPlantId(plant.id);
                                  setVerseEditing(v);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                                onClick={() =>
                                  handleDeleteVerse(plant.id, v.id)
                                }
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-64 overflow-y-auto pr-2">
                        {plant.species_id && taxonomyData[plant.species_id] ? (
                          <div className="mb-2 text-sm">
                            <p className="font-semibold text-green-700 mb-1">
                              Klasifikasi Taksonomi:
                            </p>
                            <p>
                              <span className="font-medium">Kingdom:</span>{" "}
                              {taxonomyData[plant.species_id].kingdom}
                            </p>
                            <p>
                              <span className="font-medium">Subkingdom:</span>{" "}
                              {taxonomyData[plant.species_id].subkingdom}
                            </p>
                            <p>
                              <span className="font-medium">
                                Superdivision:
                              </span>{" "}
                              {taxonomyData[plant.species_id].superdivision}
                            </p>
                            <p>
                              <span className="font-medium">Division:</span>{" "}
                              {taxonomyData[plant.species_id].division}
                            </p>
                            <p>
                              <span className="font-medium">Class:</span>{" "}
                              {taxonomyData[plant.species_id].class}
                            </p>
                            <p>
                              <span className="font-medium">Subclass:</span>{" "}
                              {taxonomyData[plant.species_id].subclass}
                            </p>
                            <p>
                              <span className="font-medium">Order:</span>{" "}
                              {taxonomyData[plant.species_id].order}
                            </p>
                            <p>
                              <span className="font-medium">Family:</span>{" "}
                              {taxonomyData[plant.species_id].family}
                            </p>
                            <p>
                              <span className="font-medium">Genus:</span>{" "}
                              {taxonomyData[plant.species_id].genus}
                            </p>
                            <p>
                              <span className="font-medium">Species:</span>{" "}
                              {taxonomyData[plant.species_id].species}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Tidak ada data klasifikasi
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.benefits}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.characteristics}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.origin}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.chemical_comp}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.cultivation}
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-80 w-80">
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {plant.source_ref}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center min-w-40 w-40">
                      <div className="flex flex-col gap-1">
                        <button
                          className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                          onClick={() => setEditing(plant)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                          onClick={() => handleDeleteClick(plant)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        title="Konfirmasi Hapus"
        onClose={() => {
          setShowDeleteModal(false);
          setPlantToDelete(null);
        }}
      >
        <div className="space-y-4">
          <p>
            Apakah Anda yakin ingin menghapus tumbuhan{" "}
            <span className="font-semibold text-red-600">
              {plantToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => {
                setShowDeleteModal(false);
                setPlantToDelete(null);
              }}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 rounded"
              onClick={confirmDeletePlant}
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showDeleteAllModal}
        title="Konfirmasi Hapus Semua"
        onClose={() => setShowDeleteAllModal(false)}
      >
        <div className="space-y-4">
          <p className="text-black">
            Apakah Anda yakin ingin menghapus{" "}
            <span className="text-red-600  font-semibold">
              semua tumbuhan spesifik
            </span>
            ?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowDeleteAllModal(false)}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 rounded"
              onClick={handleDeleteAllPlants}
            >
              Hapus Semua
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showUploadModal && uploadType === "verse"}
        title="Upload Ayat Al-Qur'an"
        onClose={() => {
          setShowUploadModal(false);
          setExcelSpecific(null);
        }}
      >
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => document.getElementById("uploadExcelInput")?.click()}
          >
            <p className="text-sm font-medium text-gray-700">
              Drag your file(s) to start uploading
            </p>
            <p className="text-xs text-gray-500">or</p>
            <button
              type="button"
              className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded"
            >
              Browse files
            </button>
          </div>
          <input
            id="uploadExcelInput"
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={(e) => setExcelSpecific(e.target.files[0])}
          />
          {excelSpecific && (
            <p className="text-sm text-green-700 font-semibold">
              📄 {excelSpecific.name}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => {
                setShowUploadModal(false);
                setExcelSpecific(null);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
              onClick={handleUploadSpecificExcel}
            >
              Selesai
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showUploadModal && uploadType === "plant"}
        title="Upload Data Tumbuhan"
        onClose={() => {
          setShowUploadModal(false);
          setExcelTanaman(null);
        }}
      >
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            onClick={() =>
              document.getElementById("uploadPlantExcelInput")?.click()
            }
          >
            <p className="text-sm font-medium text-gray-700">
              Drag your file(s) to start uploading
            </p>
            <p className="text-xs text-gray-500">or</p>
            <button
              type="button"
              className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded"
            >
              Browse files
            </button>
          </div>
          <input
            id="uploadPlantExcelInput"
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={(e) => setExcelTanaman(e.target.files[0])}
          />
          {excelTanaman && (
            <p className="text-sm text-green-700 font-semibold">
              📄 {excelTanaman.name}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => {
                setShowUploadModal(false);
                setExcelTanaman(null);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
              onClick={handleUploadPlantExcel}
            >
              Selesai
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showUploadSelector}
        title="Tambah Data"
        onClose={() => setShowUploadSelector(false)}
      >
        <p className="mb-4 text-sm text-gray-600">
          Pilih salah satu data yang ingin kamu tambahkan
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setUploadType("plant");
              setShowUploadSelector(false);
              setShowUploadModal(true);
            }}
            className="w-full py-2 bg-lime-300 rounded hover:bg-lime-400 font-semibold"
          >
            Tambah Data Tumbuhan
          </button>

          <button
            onClick={() => {
              setUploadType("verse");
              setShowUploadSelector(false);
              setShowUploadModal(true);
            }}
            className="w-full py-2 bg-lime-300 rounded hover:bg-lime-400 font-semibold"
          >
            Tambah Data Ayat Alquran
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => setShowUploadSelector(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        show={!!editing}
        title="Edit Tumbuhan"
        onClose={() => setEditing(null)}
      >
        <form
          onSubmit={handleUpdate}
          className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
        >
          {Object.keys(form).map((key) =>
            key !== "plant_type_id" ? (
              <input
                key={key}
                type="text"
                className="w-full p-2 border rounded"
                value={editing?.[key] || ""}
                onChange={(e) =>
                  setEditing({ ...editing, [key]: e.target.value })
                }
                placeholder={key.replace(/_/g, " ")}
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Tanaman
                </label>
                <select
                  name="plant_type_id"
                  value={editing?.plant_type_id || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, plant_type_id: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {plantTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            Update
          </button>
        </form>
      </Modal>

      <Modal
        show={!!verseEditing}
        title="Edit Ayat"
        onClose={() => setVerseEditing(null)}
      >
        <form onSubmit={handleUpdateVerse} className="space-y-3">
          {Object.keys(newVerse).map((key) => (
            <input
              key={key}
              type="text"
              className="w-full p-2 border rounded"
              value={verseEditing?.[key] || ""}
              onChange={(e) =>
                setVerseEditing({ ...verseEditing, [key]: e.target.value })
              }
              placeholder={key.replace(/_/g, " ")}
            />
          ))}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            Update
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default SpecificPlantsPage;
