import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";

function SpecificPlantsPage() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    plant_type: "Buah",
    overview: "",
    description: "",
    benefits: "",
    characteristics: "",
    origin: "",
    chemical_comp: "",
    cultivation: "",
    source_ref: "",
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);

  const [showVerseForm, setShowVerseForm] = useState(false);
  const [verseEditing, setVerseEditing] = useState(null);
  const [newVerse, setNewVerse] = useState({
    surah: "",
    verse_number: "",
    quran_verse: "",
    translation: "",
    audio_url: "",
    keyword_arab: "",
  });

  const [showClassificationForm, setShowClassificationForm] = useState(false);
  const [newClassification, setNewClassification] = useState({
    kingdom: "",
    subkingdom: "",
    superdivision: "",
    division: "",
    class: "",
    subclass: "",
    order: "",
    family: "",
    genus: "",
    species: "",
  });
  const [classificationEditing, setClassificationEditing] = useState(null);

  useEffect(() => {
    axiosClient.get("/specific-plants").then((res) => setPlants(res.data));
  }, []);

  const refreshData = () => {
    axiosClient.get("/specific-plants").then((res) => setPlants(res.data));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    axiosClient.post("/specific-plants", form).then(() => {
      setForm({
        name: "",
        latin_name: "",
        image_url: "",
        plant_type: "Buah",
        overview: "",
        description: "",
        benefits: "",
        characteristics: "",
        origin: "",
        chemical_comp: "",
        cultivation: "",
        source_ref: "",
      });
      refreshData();
      setShowForm(false);
    });
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

  const handleAddVerse = async (e) => {
    e.preventDefault();
    await axiosClient.post(
      `/specific-plants/${selectedPlantId}/verses`,
      newVerse
    );
    refreshData();
    setShowVerseForm(false);
    setNewVerse({
      surah: "",
      verse_number: "",
      quran_verse: "",
      translation: "",
      audio_url: "",
      keyword_arab: "",
    });
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

  const handleAddClassification = async (e) => {
    e.preventDefault();
    await axiosClient.post(
      `/specific-plants/${selectedPlantId}/classifications`,
      newClassification
    );
    refreshData();
    setShowClassificationForm(false);
    setNewClassification({
      kingdom: "",
      subkingdom: "",
      superdivision: "",
      division: "",
      class: "",
      subclass: "",
      order: "",
      family: "",
      genus: "",
      species: "",
    });
  };

  const handleUpdateClassification = async (e) => {
    e.preventDefault();
    await axiosClient.put(
      `/specific-plants/${selectedPlantId}/classifications/${classificationEditing.id}`,
      classificationEditing
    );
    refreshData();
    setClassificationEditing(null);
  };

  const handleDeleteClassification = async (plantId, id) => {
    await axiosClient.delete(
      `/specific-plants/${plantId}/classifications/${id}`
    );
    refreshData();
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white rounded-xl p-4 shadow overflow-x-auto  font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="mb-6 text-xl font-bold text-black">
              Daftar Kategori Spesifik
            </h1>
            <button
              className="px-4 py-2 text-sm text-white bg-[#004E1D] rounded hover:bg-green-700"
              onClick={() => setShowForm(true)}
            >
              Tambah
            </button>
          </div>
          <div className="border-t border-gray-300 mb-4"></div>

          <div className="overflow-x-auto ">
            <table className="w-full text-sm text-left border-separate border-spacing-y-4">
              <thead className="text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Latin</th>
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
                    <td className="px-4 py-4 w-44 min-w-44">
                      <img
                        src={plant.image_url}
                        className="w-40 h-40 object-cover rounded-md"
                        alt="img"
                      />
                    </td>
                    <td className="px-4 py-4 w-28">{plant.plant_type}</td>
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
                        {plant.classifications?.map((cls) => (
                          <div
                            key={cls.id}
                            className="mb-2 border-b border-gray-200 pb-2 last:border-none"
                          >
                            <p className="text-sm italic">
                              🔬 {cls.kingdom}, {cls.family}, {cls.genus},{" "}
                              {cls.species}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <button
                                className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={() => {
                                  setSelectedPlantId(plant.id);
                                  setClassificationEditing(cls);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                                onClick={() =>
                                  handleDeleteClassification(plant.id, cls.id)
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
                          className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                          onClick={() => {
                            setSelectedPlantId(plant.id);
                            setShowVerseForm(true);
                          }}
                        >
                          Tambah Ayat
                        </button>
                        <button
                          className="px-3 py-1 text-white bg-green-700 rounded hover:bg-green-800"
                          onClick={() => {
                            setSelectedPlantId(plant.id);
                            setShowClassificationForm(true);
                          }}
                        >
                          Tambah Klasifikasi
                        </button>
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
        show={showClassificationForm}
        title="Tambah Klasifikasi"
        onClose={() => setShowClassificationForm(false)}
      >
        <form onSubmit={handleAddClassification} className="space-y-3">
          {Object.keys(newClassification).map((key) => (
            <input
              key={key}
              type="text"
              className="w-full p-2 border rounded"
              placeholder={key.replace(/_/g, " ")}
              value={newClassification[key]}
              onChange={(e) =>
                setNewClassification({
                  ...newClassification,
                  [key]: e.target.value,
                })
              }
            />
          ))}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded"
          >
            Simpan
          </button>
        </form>
      </Modal>

      <Modal
        show={!!classificationEditing}
        title="Edit Klasifikasi"
        onClose={() => setClassificationEditing(null)}
      >
        <form onSubmit={handleUpdateClassification} className="space-y-3">
          {Object.keys(newClassification).map((key) => (
            <input
              key={key}
              type="text"
              className="w-full p-2 border rounded"
              placeholder={key.replace(/_/g, " ")}
              value={classificationEditing?.[key] || ""}
              onChange={(e) =>
                setClassificationEditing({
                  ...classificationEditing,
                  [key]: e.target.value,
                })
              }
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

      <Modal
        show={showForm}
        title="Tambah Tumbuhan"
        onClose={() => setShowForm(false)}
      >
        <form
          onSubmit={handleAdd}
          className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
        >
          {Object.keys(form).map((key) =>
            key !== "plant_type" ? (
              <input
                key={key}
                type="text"
                className="w-full p-2 border rounded"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={key.replace(/_/g, " ")}
              />
            ) : (
              <select
                key={key}
                className="w-full p-2 border rounded"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              >
                <option value="Buah">Buah</option>
                <option value="Sayur">Sayur</option>
                <option value="Bunga">Bunga</option>
              </select>
            )
          )}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded"
          >
            Simpan
          </button>
        </form>
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
            key !== "plant_type" ? (
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
              <select
                key={key}
                className="w-full p-2 border rounded"
                value={editing?.[key] || "Buah"}
                onChange={(e) =>
                  setEditing({ ...editing, [key]: e.target.value })
                }
              >
                <option value="Buah">Buah</option>
                <option value="Sayur">Sayur</option>
                <option value="Bunga">Bunga</option>
              </select>
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
        show={showVerseForm}
        title="Tambah Ayat"
        onClose={() => setShowVerseForm(false)}
      >
        <form onSubmit={handleAddVerse} className="space-y-3">
          {Object.keys(newVerse).map((key) => (
            <input
              key={key}
              type="text"
              className="w-full p-2 border rounded"
              value={newVerse[key]}
              onChange={(e) =>
                setNewVerse({ ...newVerse, [key]: e.target.value })
              }
              placeholder={key.replace(/_/g, " ")}
            />
          ))}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded"
          >
            Simpan
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
    </AdminLayout>
  );
}

export default SpecificPlantsPage;
