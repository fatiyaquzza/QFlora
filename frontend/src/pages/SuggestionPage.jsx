import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";

function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [suggestionToDelete, setSuggestionToDelete] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/suggestions");
      setSuggestions(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data saran:", err);
      setErrorMessage("Gagal mengambil data saran.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async () => {
    try {
      await axiosClient.put(`/suggestions/${editingSuggestion.id}/note`, {
        status: statusValue,
      });
      fetchSuggestions();
      setEditingSuggestion(null);
    } catch (err) {
      console.error("❌ Gagal menyimpan status:", err);
      setErrorMessage("Gagal menyimpan status.");
    }
  };

  const handleDeleteClick = (suggestion) => {
    setSuggestionToDelete(suggestion);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!suggestionToDelete) return;

    try {
      await axiosClient.delete(`/suggestions/${suggestionToDelete.id}`);
      setShowDeleteModal(false);
      setSuggestionToDelete(null);
      fetchSuggestions();
    } catch (err) {
      console.error("❌ Gagal menghapus saran:", err);
      setErrorMessage("Gagal menghapus saran.");
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="p-6 pb-10">
          <div className="bg-white rounded-xl shadow border px-6 py-4 font-Poppins">
            <h1 className="text-xl font-semibold text-gray-800 mb-6 py-2">
              Masukan Pengguna
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Tipe</th>
                    <th className="px-4 py-3">Deskripsi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <div className="flex justify-center items-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                          <span className="ml-2 text-gray-600">
                            Memuat data saran...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : suggestions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500"
                      >
                        Tidak ada data saran.
                      </td>
                    </tr>
                  ) : (
                    suggestions.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{s.user?.name || "-"}</td>
                        <td className="px-4 py-3">{s.user?.email || "-"}</td>
                        <td className="px-4 py-3">
                          {s.suggestion_type?.name || "-"}
                        </td>
                        <td className="px-4 py-3">{s.description}</td>
                        <td className="px-4 py-3">
                          {s.status === "Ditanggapi" ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
                              Sudah
                            </span>
                          ) : (
                            <span className="text-yellow-600 font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>{" "}
                              Belum
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                              onClick={() => {
                                setEditingSuggestion(s);
                                setStatusValue(s.status || "Belum");
                              }}
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
                              Ubah
                            </button>
                            <button
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                              onClick={() => handleDeleteClick(s)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* Modal Edit */}
      {editingSuggestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h2 className="mb-4 text-lg font-bold">
              Ubah Status Saran #{editingSuggestion.id}
            </h2>
            <select
              className="w-full p-2 border rounded"
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
            >
              <option value="Belum">Belum</option>
              <option value="Ditanggapi">Sudah Ditanggapi</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingSuggestion(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 text-white bg-green-600 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <Modal
        show={showDeleteModal}
        title="Konfirmasi Hapus"
        onClose={() => {
          setShowDeleteModal(false);
          setSuggestionToDelete(null);
        }}
      >
        <div className="space-y-4">
          <p>
            Apakah Anda yakin ingin menghapus saran dari{" "}
            <span className="font-semibold text-red-600">
              {suggestionToDelete?.user?.name || "Pengguna"}
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
              onClick={confirmDelete}
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 mt-4 text-red-800 bg-red-100 rounded">
          {errorMessage}
        </div>
      )}
    </>
  );
}

export default SuggestionsPage;
