// 📁 src/pages/GeneralCategoriesPage.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";

function GeneralCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    overview: "",
  });
  const [showForm, setShowForm] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingVerse, setEditingVerse] = useState(null);
  const [showVerseForm, setShowVerseForm] = useState(false);

  const [newVerse, setNewVerse] = useState({
    surah: "",
    verse_number: "",
    quran_verse: "",
    translation: "",
    audio_url: "",
  });

  const fetchCategories = async () => {
    const res = await axiosClient.get("/general-categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axiosClient.post("/general-categories", form);
    setForm({ name: "", latin_name: "", image_url: "", overview: "" });
    setShowForm(false);
    fetchCategories();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosClient.put(`/general-categories/${editing.id}`, editing);
    setEditing(null);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await axiosClient.delete(`/general-categories/${id}`);
    fetchCategories();
  };

  const handleAddVerse = async (e) => {
    e.preventDefault();
    if (editingVerse) {
      await axiosClient.put(
        `/general-categories/${selectedCategoryId}/verses/${editingVerse.id}`,
        newVerse
      );
    } else {
      await axiosClient.post(
        `/general-categories/${selectedCategoryId}/verses`,
        newVerse
      );
    }
    setNewVerse({
      surah: "",
      verse_number: "",
      quran_verse: "",
      translation: "",
      audio_url: "",
    });
    setEditingVerse(null);
    setShowVerseForm(false);
    fetchCategories();
  };

  const handleDeleteVerse = async (categoryId, verseId) => {
    await axiosClient.delete(
      `/general-categories/${categoryId}/verses/${verseId}`
    );
    fetchCategories();
  };

  return (
    <AdminLayout>
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
              <th className="px-2 py-1 text-left border">Name</th>
              <th className="px-2 py-1 text-left border">Latin Name</th>
              <th className="px-2 py-1 text-left border">Image</th>
              <th className="px-2 py-1 text-left border">Overview</th>
              <th className="px-2 py-1 text-left border">Ayat Al-Qur'an</th>
              <th className="px-2 py-1 text-center border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-2 py-1 border">{cat.name}</td>
                <td className="px-2 py-1 border">{cat.latin_name}</td>
                <td className="px-2 py-1 border">
                  <img
                    src={cat.image_url}
                    alt="img"
                    className="object-cover w-20 h-20"
                  />
                </td>
                <td className="px-2 py-1 border">{cat.overview}</td>
                <td className="px-2 py-1 border">
                  {cat.verses?.length > 0 ? (
                    cat.verses.map((v) => (
                      <div key={v.id} className="pb-2 mb-3">
                        <p>
                          📖{" "}
                          <b>
                            {v.surah} - {v.verse_number}
                          </b>
                        </p>
                        <p className="text-sm italic">🕋 {v.quran_verse}</p>
                        <p className="text-sm">📘 {v.translation}</p>
                        <audio controls className="w-full">
                          <source src={v.audio_url} type="audio/mpeg" />
                        </audio>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => {
                              setSelectedCategoryId(cat.id);
                              setEditingVerse(v);
                              setNewVerse(v);
                              setShowVerseForm(true);
                            }}
                            className="px-2 py-1 text-xs text-white bg-blue-500 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVerse(cat.id, v.id)}
                            className="px-2 py-1 text-xs text-white bg-red-500 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm italic text-gray-400">
                      Belum ada ayat
                    </span>
                  )}
                </td>
                <td className="justify-center px-2 py-1 border whitespace-nowrap">
                  <div className="flex flex-row justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setEditingVerse(null);
                        setNewVerse({
                          surah: "",
                          verse_number: "",
                          quran_verse: "",
                          translation: "",
                          audio_url: "",
                        });
                        setShowVerseForm(true);
                      }}
                      className="px-3 py-1 text-white bg-green-600 rounded"
                    >
                      Tambah Ayat
                    </button>
                    <button
                      onClick={() => setEditing(cat)}
                      className="px-3 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded"
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
          show={showForm}
          title="Tambah Kategori Umum"
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleAdd} className="space-y-3">
            {Object.keys(form).map((key) => (
              <input
                key={key}
                type="text"
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
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded"
              >
                Tambah
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          show={!!editing}
          title={`Edit Kategori: ${editing?.name}`}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            {Object.keys(form).map((key) => (
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
            ))}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditing(null)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          show={showVerseForm}
          title={editingVerse ? "Edit Ayat Al-Qur'an" : "Tambah Ayat Al-Qur'an"}
          onClose={() => {
            setShowVerseForm(false);
            setEditingVerse(null);
            setNewVerse({
              surah: "",
              verse_number: "",
              quran_verse: "",
              translation: "",
              audio_url: "",
            });
          }}
        >
          <form onSubmit={handleAddVerse} className="space-y-3">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Surah"
              value={newVerse.surah}
              onChange={(e) =>
                setNewVerse({ ...newVerse, surah: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Nomor Ayat"
              value={newVerse.verse_number}
              onChange={(e) =>
                setNewVerse({ ...newVerse, verse_number: e.target.value })
              }
            />
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Ayat Al-Qur'an"
              value={newVerse.quran_verse}
              onChange={(e) =>
                setNewVerse({ ...newVerse, quran_verse: e.target.value })
              }
            ></textarea>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Terjemahan"
              value={newVerse.translation}
              onChange={(e) =>
                setNewVerse({ ...newVerse, translation: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Audio URL"
              value={newVerse.audio_url}
              onChange={(e) =>
                setNewVerse({ ...newVerse, audio_url: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowVerseForm(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default GeneralCategoriesPage;
