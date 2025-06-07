import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import Fuse from 'fuse.js';

function GeneralCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const navigate = useNavigate();

  const [excelGeneralPlant, setExcelGeneralPlant] = useState(null);
  const [showUploadSelector, setShowUploadSelector] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingVerse, setEditingVerse] = useState(null);
  const [showVerseForm, setShowVerseForm] = useState(false);

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

  const [excelFile, setExcelFile] = useState(null);

  const fetchCategories = async () => {
    const res = await axiosClient.get("/general-categories");
    setCategories(res.data);
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
      keys: [
        'name',
        'verses.surah',
        'verses.quran_verse'
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 3,
      ignoreLocation: true,
    });

    const results = fuse.search(searchTerm).map(result => result.item);
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
    if (!excelGeneralPlant) return alert("Pilih file Excel terlebih dahulu.");
    const formData = new FormData();
    formData.append("file", excelGeneralPlant);
    try {
      await axiosClient.post("/api/import-general-plants", formData);
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

  const handleExcelUpload = async () => {
    if (!excelFile) return alert("Pilih file Excel terlebih dahulu.");
    const formData = new FormData();
    formData.append("file", excelFile);
    try {
      await axiosClient.post("/api/import-general-verses", formData);
      alert("Import berhasil!");
      fetchCategories();
      setExcelFile(null);
    } catch (err) {
      alert("Gagal import. Pastikan format Excel sesuai.");
    }
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h1 className="text-xl font-bold text-black">
              Daftar Kategori Umum
            </h1>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-green-700"
                onClick={() => setShowUploadSelector(true)}
              >
                +
              </button>

              <button
                className="px-4 py-2 text-sm text-white bg-[#004E1D] rounded hover:bg-green-700"
                onClick={() => navigate("/general-categories/add")}
              >
                Tambah
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nama tumbuhan atau ayat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="border-t border-gray-300 mb-4"></div>

            <table className="w-full text-sm text-left border-separate border-spacing-y-4">
              <thead className="text-gray-600">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Latin Name</th>
                  <th className="px-2 py-2">Image</th>
                  <th className="px-2 py-2">Overview</th>
                  <th className="px-2 py-2">Ayat Al-Qur'an</th>
                  <th className="px-2 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="bg-white shadow rounded">
                    <td className="px-2 py-4 min-w-20 w-20">{cat.name}</td>
                    <td className="px-2 py-4 min-w-40 w-40">
                      {cat.latin_name}
                    </td>
                    <td className="px-2 py-4 min-w-44 w-44">
                      <img
                        src={cat.image_url}
                        alt="img"
                        className="object-cover w-40 h-40 rounded-md"
                      />
                    </td>
                    <td className="px-2 py-4 min-w-40 w-40">{cat.overview}</td>
                    <td className="px-2 py-4 min-w-40 w-60">
                      <div className="max-h-64 overflow-y-auto pr-2 w-60">
                        {cat.verses?.length > 0 ? (
                          cat.verses.map((v) => (
                            <div
                              key={v.id}
                              className="mb-2 pb-2 border-b border-gray-200"
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

                              <div className="flex gap-2 mt-2">
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
                                  onClick={() =>
                                    handleDeleteVerse(cat.id, v.id)
                                  }
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
                      </div>
                    </td>
                    <td className="px-2 py-4 min-w-40 w-40 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => navigate(`/general-categories/edit/${cat.id}`)}
                          className="px-3 py-1 text-white bg-blue-500 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cat)}
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
          </div>
        </div>

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
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded"
                onClick={confirmDeleteCategory}
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          show={showUploadModal && uploadType === "plant"}
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
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded"
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
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowUploadModal(false);
                  setExcelGeneralPlant(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
                onClick={handleUploadGeneralPlant}
              >
                Selesai
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          show={showUploadModal && uploadType === "verse"}
          title="Upload Ayat Al-Qur'an dari Excel"
          onClose={() => {
            setShowUploadModal(false);
            setExcelFile(null);
          }}
        >
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              onClick={() =>
                document.getElementById("uploadExcelAyatInput")?.click()
              }
            >
              <p className="text-sm font-medium text-gray-700">
                Tarik file Excel ke sini
              </p>
              <p className="text-xs text-gray-500">atau klik tombol bawah</p>
              <button
                type="button"
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded"
              >
                Pilih File
              </button>
            </div>
            <input
              id="uploadExcelAyatInput"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />
            {excelFile && (
              <p className="text-sm text-green-700 font-semibold">
                📄 {excelFile.name}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowUploadModal(false);
                  setExcelFile(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
                onClick={handleExcelUpload}
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
            Pilih jenis data yang ingin ditambahkan:
          </p>
          <div className="space-y-3">
            <button
              className="w-full py-2 bg-lime-300 rounded hover:bg-lime-400 font-semibold"
              onClick={() => {
                setUploadType("plant");
                setShowUploadSelector(false);
                setShowUploadModal(true);
              }}
            >
              Tambah Data Kategori Umum
            </button>
            <button
              className="w-full py-2 bg-lime-300 rounded hover:bg-lime-400 font-semibold"
              onClick={() => {
                setUploadType("verse");
                setShowUploadSelector(false);
                setShowUploadModal(true);
              }}
            >
              Tambah Ayat Kategori Umum
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setShowUploadSelector(false)}
            >
              Batal
            </button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default GeneralCategoriesPage;
