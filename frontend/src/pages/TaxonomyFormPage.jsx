import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";

const TAXONOMY_LEVELS = [
  { key: "species", label: "Species", plural: "species", parent: "genus" },
  { key: "genus", label: "Genus", plural: "genuses", parent: "family" },
  { key: "family", label: "Family", plural: "families", parent: "order" },
  { key: "order", label: "Order", plural: "orders", parent: "subclass" },
  {
    key: "subclass",
    label: "Subclass",
    plural: "subclasses",
    parent: "class_",
  },
  { key: "class_", label: "Class", plural: "classes", parent: "division" },
  {
    key: "division",
    label: "Division",
    plural: "divisions",
    parent: "superdivision",
  },
  {
    key: "superdivision",
    label: "Superdivision",
    plural: "superdivisions",
    parent: "subkingdom",
  },
  {
    key: "subkingdom",
    label: "Subkingdom",
    plural: "subkingdoms",
    parent: null,
  },
];

function TaxonomyFormPage() {
  const navigate = useNavigate();
  const [taxonomyData, setTaxonomyData] = useState({});
  const [selected, setSelected] = useState({});
  const [newEntries, setNewEntries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const res = await axiosClient.get("/api/taxonomy/full");
        setTaxonomyData(res.data);
      } catch (err) {
        console.error("Gagal ambil taxonomy:", err);
        setError("Gagal memuat data taksonomi. Silakan coba lagi.");
      }
    };
    fetchTaxonomy();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    const payload = {};
    let hasSpecies = false;

    TAXONOMY_LEVELS.slice()
      .reverse()
      .forEach(({ key, plural }) => {
        const newVal = newEntries[key];
        const selectedId = selected[key];
        const list = taxonomyData[plural];

        if (newVal && newVal.trim() !== "") {
          payload[key] = newVal.trim();
        } else if (selectedId && list) {
          const found = list.find((item) => item.id === selectedId);
          if (found) {
            payload[key] = found.name;
          }
        }

        if (key === "species" && payload[key]) hasSpecies = true;
      });

    if (!hasSpecies) {
      setError("Spesies harus diisi (dipilih atau ditambah)");
      setIsLoading(false);
      return;
    }

    try {
      await axiosClient.post("/api/taxonomy/full", payload);
      alert("✅ Semua data berhasil disimpan!");
      setSelected({});
      setNewEntries({});
    } catch (err) {
      setError(
        err.response?.data?.error || "Terjadi kesalahan saat menyimpan data"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelected({});
    setNewEntries({});
    setError("");
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-black">
              Tambah Klasifikasi Taksonomi
            </h1>
            <button
              className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
              onClick={() => navigate(-1)}
            >
              Kembali
            </button>
          </div>

          <div className="border-t border-gray-300 mb-4"></div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
              <h3 className="text-green-800 font-medium">
                Petunjuk Penambahan Klasifikasi
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Anda dapat memilih dari klasifikasi yang sudah ada, atau
                menambahkan entri baru. Pastikan memulai dari Subkingdom hingga
                Spesies secara berurutan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TAXONOMY_LEVELS.map(({ key, label, plural }) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>

                  {/* Dropdown jika data tersedia */}
                  {(taxonomyData[plural] || []).length > 0 && (
                    <select
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                      value={selected[key] || ""}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          [key]: parseInt(e.target.value),
                        }))
                      }
                    >
                      <option value="">-- Pilih {label} --</option>
                      {taxonomyData[plural].map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Tambah entri baru */}
                  <input
                    type="text"
                    value={newEntries[key] || ""}
                    onChange={(e) =>
                      setNewEntries((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={`Atau tambahkan ${label} baru`}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-400"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Klasifikasi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default TaxonomyFormPage;
