// 📁 src/pages/SpecificPlantsPage.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminHeader from "../components/AdminHeader";

function SpecificPlantsPage() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    quran_verse: "",
    surah: "",
    verse_number: "",
    audio_url: "",
    translation: "",
    plant_type: "Buah",
    overview: "",
    description: "",
    classification: "",
    benefits: "",
    characteristics: "",
    origin: "",
    chemical_comp: "",
    cultivation: "",
    source_ref: "",
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (plant) => {
    setEditing({ ...plant });
  };

  useEffect(() => {
    axiosClient
      .get("/specific-plants")
      .then((res) => setPlants(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    axiosClient
      .post("/specific-plants", form)
      .then(() => {
        setForm({
          name: "",
          latin_name: "",
          image_url: "",
          quran_verse: "",
          surah: "",
          verse_number: "",
          audio_url: "",
          translation: "",
          plant_type: "Buah",
          overview: "",
          description: "",
          classification: "",
          benefits: "",
          characteristics: "",
          origin: "",
          chemical_comp: "",
          cultivation: "",
          source_ref: "",
        });
        return axiosClient.get("/specific-plants");
      })
      .then((res) => {
        setPlants(res.data);
        setShowForm(false);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosClient
      .put(`/specific-plants/${editing.id}`, editing)
      .then(() => axiosClient.get("/specific-plants"))
      .then((res) => {
        setPlants(res.data);
        setEditing(null);
      });
  };

  const handleDelete = (id) => {
    axiosClient
      .delete(`/specific-plants/${id}`)
      .then(() => axiosClient.get("/specific-plants"))
      .then((res) => setPlants(res.data));
  };

  return (
    <>
      <AdminHeader />
      <div className="p-6">
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
              {Object.keys(form).map((key) => (
                <th key={key} className="px-2 py-1 text-left capitalize border">
                  {key.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-2 py-1 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id} className="hover:bg-gray-50">
                {Object.keys(form).map((key) => (
                  <td key={key} className="px-2 py-1 border">
                    {key === "image_url" ? (
                      <img
                        src={plant[key]}
                        alt="plant"
                        className="object-cover w-20 h-20"
                      />
                    ) : (
                      plant[key]
                    )}
                  </td>
                ))}
                <td className="px-2 py-1 border whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plant)}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plant.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          show={!!editing}
          title={`Edit Tanaman: ${editing?.name}`}
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
                  type={key === "verse_number" ? "number" : "text"}
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
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          show={showForm}
          title="Tambah Tanaman Spesifik"
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
                  type={key === "verse_number" ? "number" : "text"}
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
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Tambah
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default SpecificPlantsPage;
