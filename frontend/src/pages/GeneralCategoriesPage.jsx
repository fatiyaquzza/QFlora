// 📁 src/pages/GeneralCategoriesPage.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminHeader from "../components/AdminHeader";

function GeneralCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    quran_verse: "",
    surah: "",
    verse_number: "",
    audio_url: "",
    translation: "",
    overview: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (category) => {
    setEditing({ ...category });
  };

  useEffect(() => {
    axiosClient
      .get("/general-categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .put(`/general-categories/${editing.id}`, editing)
      .then(() => axiosClient.get("/general-categories"))
      .then((res) => {
        setCategories(res.data);
        setEditing(null);
      });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    axiosClient
      .post("/general-categories", form)
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
          overview: "",
        });
        return axiosClient.get("/general-categories");
      })
      .then((res) => {
        setCategories(res.data);
        setShowForm(false);
      });
  };

  const handleDelete = (id) => {
    axiosClient
      .delete(`/general-categories/${id}`)
      .then(() => axiosClient.get("/general-categories"))
      .then((res) => setCategories(res.data));
  };

  return (
    <>
      <AdminHeader />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Kategori Umum</h1>
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
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                {Object.keys(form).map((key) => (
                  <td key={key} className="px-2 py-1 border">
                    {key === "image_url" ? (
                      <img
                        src={cat[key]}
                        alt="cat"
                        className="object-cover w-20 h-20"
                      />
                    ) : (
                      cat[key]
                    )}
                  </td>
                ))}
                <td className="px-2 py-1 border whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
          title={`Edit Kategori: ${editing?.name}`}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
          >
            {Object.keys(form).map((key) => (
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
            ))}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditing(null)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          show={showForm}
          title="Tambah Kategori Umum"
          onClose={() => setShowForm(false)}
        >
          <form
            onSubmit={handleAdd}
            className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
          >
            {Object.keys(form).map((key) => (
              <input
                key={key}
                type={key === "verse_number" ? "number" : "text"}
                className="w-full p-2 border rounded"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={key.replace(/_/g, " ")}
              />
            ))}
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

export default GeneralCategoriesPage;
