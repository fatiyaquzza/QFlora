// 📁 src/pages/SpecificPlantsPage.js
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

  const [showVerseForm, setShowVerseForm] = useState(false);
  const [verseEditing, setVerseEditing] = useState(null);
  const [newVerse, setNewVerse] = useState({
    surah: "",
    verse_number: "",
    quran_verse: "",
    translation: "",
    audio_url: "",
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

  const handleDelete = (id) => {
    axiosClient.delete(`/specific-plants/${id}`).then(refreshData);
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
      <div className="p-6 font-Poppins">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Kategori Spesifik</h1>
          <button
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={() => setShowForm(true)}
          >
            Tambah
          </button>
        </div>

        <table className="w-full text-sm border border-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">Nama</th>
              <th className="px-2 py-1 border">Latin</th>
              <th className="px-2 py-1 border">Gambar</th>
              <th className="px-2 py-1 border">Jenis</th>
              <th className="px-2 py-1 border">Ayat</th>
              <th className="px-2 py-1 border">Klasifikasi</th>
              <th className="px-2 py-1 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id} className="hover:bg-gray-50">
                <td className="px-2 py-1 border">{plant.name}</td>
                <td className="px-2 py-1 border">{plant.latin_name}</td>
                <td className="px-2 py-1 border">
                  <img
                    src={plant.image_url}
                    className="object-cover w-20 h-20"
                    alt="img"
                  />
                </td>
                <td className="px-2 py-1 border">{plant.plant_type}</td>
                <td className="px-2 py-1 border">
                  {plant.verses?.map((v) => (
                    <div key={v.id} className="mb-2">
                      <p>
                        📖 {v.surah} - {v.verse_number}
                      </p>
                      <p className="text-sm italic">🕋 {v.quran_verse}</p>
                      <p className="text-sm">📘 {v.translation}</p>
                      <audio controls className="w-full">
                        <source src={v.audio_url} type="audio/mpeg" />
                      </audio>
                      <div className="flex gap-2 mt-1">
                        <button
                          className="px-2 py-1 text-sm text-white bg-blue-600 rounded"
                          onClick={() => {
                            setSelectedPlantId(plant.id);
                            setVerseEditing(v);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 text-sm text-white bg-red-600 rounded"
                          onClick={() => handleDeleteVerse(plant.id, v.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="px-2 py-1 border">
                  {plant.classifications?.map((cls) => (
                    <div key={cls.id} className="mb-2">
                      <p className="text-sm italic">
                        🔬 {cls.kingdom}, {cls.family}, {cls.genus},{" "}
                        {cls.species}
                      </p>
                      <button
                        className="px-2 py-1 mr-2 text-xs text-white bg-blue-600 rounded"
                        onClick={() => {
                          setSelectedPlantId(plant.id);
                          setClassificationEditing(cls);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 text-xs text-white bg-red-600 rounded"
                        onClick={() =>
                          handleDeleteClassification(plant.id, cls.id)
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </td>
                <td className="px-2 py-1 border">
                  <div className="flex flex-col gap-1">
                    <button
                      className="px-3 py-1 text-white bg-green-600 rounded"
                      onClick={() => {
                        setSelectedPlantId(plant.id);
                        setShowVerseForm(true);
                      }}
                    >
                      Tambah Ayat
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-green-700 rounded"
                      onClick={() => {
                        setSelectedPlantId(plant.id);
                        setShowClassificationForm(true);
                      }}
                    >
                      Tambah Klasifikasi
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-blue-600 rounded"
                      onClick={() => setEditing(plant)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-600 rounded"
                      onClick={() => handleDelete(plant.id)}
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
    </AdminLayout>
  );
}

export default SpecificPlantsPage;
