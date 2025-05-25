import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";

function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [statusValue, setStatusValue] = useState("");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axiosClient.get("/suggestions");
      setSuggestions(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data saran:", err);
      setErrorMessage("Gagal mengambil data saran.");
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

  return (
    <>
      <AdminLayout>
        <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
          <div className="px-2 pt-2">
            <h1 className="mb-6 text-xl font-bold text-black">
              Masukan Pengguna
            </h1>
            <div className="border-t border-gray-300 mb-4"></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-y-4">
                <thead className="text-gray-600">
                  <tr>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Tipe</th>
                    <th className="px-4 py-2">Deskripsi</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">{s.user?.name || "-"}</td>
                      <td className="px-4 py-4">{s.user?.email || "-"}</td>
                      <td className="px-4 py-4">{s.suggestion_type?.name || "-"}</td>
                      <td className="px-4 py-4">{s.description}</td>
                      <td className="px-4 py-4">
                        {s.status === "Ditanggapi" ? (
                          <span className="font-semibold text-green-600">
                            Sudah ✔
                          </span>
                        ) : (
                          <span className="font-semibold text-yellow-600">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className="px-3 py-1 text-white bg-blue-600 rounded"
                          onClick={() => {
                            setEditingSuggestion(s);
                            setStatusValue(s.status || "Belum");
                          }}
                        >
                          Ubah
                        </button>
                      </td>
                    </tr>
                  ))}
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
