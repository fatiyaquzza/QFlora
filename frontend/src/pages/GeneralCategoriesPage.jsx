import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

function GeneralCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [excelGeneralPlant, setExcelGeneralPlant] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingVerse, setEditingVerse] = useState(null);
  const [showVerseForm, setShowVerseForm] = useState(false);
  const [showVerseDetailsModal, setShowVerseDetailsModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);

  const [newVerse, setNewVerse] = useState({
    surah: "",
    verse_number: "",
    quran_verse: "",
    translation: "",
    audio_url: "",
    keyword_arab: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/general-categories");
      setCategories(res.data.sort((a, b) => a.name.localeCompare(b.name)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim() || categories.length === 0) {
      setFilteredCategories(categories);
      return;
    }

    const fuse = new Fuse(categories, {
      keys: ["name", "verses.surah", "verses.quran_verse"],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });

    const results = fuse.search(searchTerm).map((result) => result.item);
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      await axiosClient.delete(`/general-categories/${categoryToDelete.id}`);
      setCategoryToDelete(null);
      setShowDeleteModal(false);
      fetchCategories();
    }
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
      keyword_arab: "",
    });

    setEditingVerse(null);
    setShowVerseForm(false);
    fetchCategories();
  };

  const handleUploadGeneralPlant = async () => {
    if (!excelGeneralPlant) {
      return alert("Pilih file Excel terlebih dahulu.");
    }

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(excelGeneralPlant.type)) {
      return alert("Tipe file salah. Harap unggah file Excel (.xlsx / .xls).");
    }

    const formData = new FormData();
    formData.append("file", excelGeneralPlant);

    try {
      await axiosClient.post("/api/import-general-verses", formData);
      alert("Berhasil mengimpor kategori umum!");
      fetchCategories();
      setExcelGeneralPlant(null);
    } catch (err) {
      alert("Gagal import: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteVerse = async (categoryId, verseId) => {
    await axiosClient.delete(
      `/general-categories/${categoryId}/verses/${verseId}`
    );
    fetchCategories();
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {/* Judul + Search */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap py-2">
                Daftar Kategori Umum
              </h1>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari Tumbuhan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                className="px-4 py-2 text-xs font-medium text-black bg-green-100 hover:bg-green-200 rounded-md"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Ayat
              </button>
              <button
                className="px-4 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                onClick={() => navigate("/general-categories/add")}
              >
                + Tambah
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">
                  Memuat data kategori...
                </span>
              </div>
            ) : (
              <table className="w-full text-sm text-left table-auto border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Nama Latin</th>
                    <th className="px-4 py-3">Gambar</th>
                    <th className="px-4 py-3">Overview</th>
                    <th className="px-4 py-3">Ayat Al-Qur'an</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{cat.name}</td>
                      <td className="px-4 py-3">{cat.latin_name}</td>
                      <td className="px-4 py-3 min-w-60 w-60">
                        <img
                          src={cat.image_url}
                          alt="img"
                          className="object-cover w-40 h-40 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3">{cat.overview}</td>
                      <td className="px-4 py-3">
                        <div className="max-h-64 overflow-y-auto pr-2 w-60">
                          {cat.verses?.length > 0 ? (
                            cat.verses.map((v) => (
                              <div
                                key={v.id}
                                className="mb-2 pb-2 border-b border-gray-200 last:border-none"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">
                                    {v.surah} - {v.verse_number}
                                  </p>
                                  <button
                                    onClick={() => {
                                      setSelectedCategoryId(cat.id);
                                      setSelectedVerse(v);
                                      setShowVerseDetailsModal(true);
                                    }}
                                    className="text-blue-600 text-xs hover:underline"
                                  >
                                    Detail
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm italic text-gray-400">
                              Belum ada ayat
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/specific-plants/edit/${cat.id}`)
                            }
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536M9 13h6l3.536-3.536a2 2 0 00-2.828-2.828L9 13z"
                              />
                            </svg>
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(cat)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Detail Ayat */}
        <Modal
          show={showVerseDetailsModal}
          title={`Detail Ayat ${selectedVerse?.surah} - ${selectedVerse?.verse_number}`}
          onClose={() => {
            setShowVerseDetailsModal(false);
            setSelectedVerse(null);
          }}
        >
          {selectedVerse && (
            <div className="space-y-4">
              <div className="text-right text-lg mb-2">
                {selectedVerse.quran_verse}
              </div>
              <div className="text-gray-700 mb-2">
                {selectedVerse.translation}
              </div>
              <audio controls className="w-full mb-2">
                <source src={selectedVerse.audio_url} type="audio/mpeg" />
              </audio>
              {selectedVerse.keyword_arab && (
                <div className="text-amber-800 mb-4">
                  🔍 <span className="font-semibold">Kata kunci Arab:</span>{" "}
                  <span className="bg-yellow-100 px-1 py-0.5 rounded text-black">
                    {selectedVerse.keyword_arab}
                  </span>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => {
                    setEditingVerse(selectedVerse);
                    setNewVerse(selectedVerse);
                    setShowVerseForm(true);
                    setShowVerseDetailsModal(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                  onClick={() => {
                    handleDeleteVerse(selectedCategoryId, selectedVerse.id);
                    setShowVerseDetailsModal(false);
                  }}
                >
                  Hapus
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    setShowVerseDetailsModal(false);
                    setSelectedVerse(null);
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal Tambah/Edit Ayat */}
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
              keyword_arab: "",
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
            />
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Terjemahan"
              value={newVerse.translation}
              onChange={(e) =>
                setNewVerse({ ...newVerse, translation: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Audio URL"
              value={newVerse.audio_url}
              onChange={(e) =>
                setNewVerse({ ...newVerse, audio_url: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Kata kunci Arab"
              value={newVerse.keyword_arab}
              onChange={(e) =>
                setNewVerse({ ...newVerse, keyword_arab: e.target.value })
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

        {/* 🔴 Modal Konfirmasi Hapus Kategori */}
        <Modal
          show={showDeleteModal}
          title="Konfirmasi Hapus"
          onClose={() => {
            setShowDeleteModal(false);
            setCategoryToDelete(null);
          }}
        >
          <div className="space-y-4">
            <p>
              Apakah Anda yakin ingin menghapus kategori{" "}
              <span className="font-semibold text-red-600">
                {categoryToDelete?.name}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                onClick={confirmDeleteCategory}
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          show={showUploadModal}
          title="Upload Kategori Umum dari Excel"
          onClose={() => {
            setShowUploadModal(false);
            setExcelGeneralPlant(null);
          }}
        >
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              onClick={() =>
                document.getElementById("uploadGeneralPlantInput")?.click()
              }
            >
              <p className="text-sm font-medium text-gray-700">
                Drag file Excel kamu di sini
              </p>
              <p className="text-xs text-gray-500">atau klik tombol bawah</p>
              <button
                type="button"
                className="mt-2 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md"
              >
                Browse File
              </button>
            </div>
            <input
              id="uploadGeneralPlantInput"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={(e) => setExcelGeneralPlant(e.target.files[0])}
            />
            {excelGeneralPlant && (
              <p className="text-sm text-green-700 font-semibold">
                📄 {excelGeneralPlant.name}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                onClick={() => {
                  setShowUploadModal(false);
                  setExcelGeneralPlant(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                onClick={handleUploadGeneralPlant}
              >
                Selesai
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default GeneralCategoriesPage;
