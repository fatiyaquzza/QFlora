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
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Masukan Pengguna</h1>

        <table className="w-full text-sm border border-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">Nama</th>
              <th className="px-2 py-1 border">Email</th>
              <th className="px-2 py-1 border">Tipe</th>
              <th className="px-2 py-1 border">Deskripsi</th>
              <th className="px-2 py-1 border">Status</th>
              <th className="px-2 py-1 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-2 py-1 border">{s.User?.name || "-"}</td>
                <td className="px-2 py-1 border">{s.User?.email || "-"}</td>
                <td className="px-2 py-1 border">{s.type}</td>
                <td className="px-2 py-1 border">{s.description}</td>
                <td className="px-2 py-1 border">
                  {s.status === "Ditanggapi" ? (
                    <span className="font-semibold text-green-600">
                      Sudah ✔
                    </span>
                  ) : (
                    <span className="font-semibold text-yellow-600">Belum</span>
                  )}
                </td>
                <td className="px-2 py-1 border">
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
      </div>
    </AdminLayout>
  );
}

export default SuggestionsPage;
