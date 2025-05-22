import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";

const TAXONOMY_LEVELS = [
    { key: "species", label: "Species", plural: "species", parent: "genus" },
    { key: "genus", label: "Genus", plural: "genuses", parent: "family" },
    { key: "family", label: "Family", plural: "families", parent: "order" },
    { key: "order", label: "Order", plural: "orders", parent: "subclass" },
    { key: "subclass", label: "Subclass", plural: "subclasses", parent: "class_" },
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
  const [taxonomyData, setTaxonomyData] = useState({});
  const [selected, setSelected] = useState({});
  const [newEntries, setNewEntries] = useState({});

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const res = await axiosClient.get("/api/taxonomy/full");
        setTaxonomyData(res.data);
      } catch (err) {
        console.error("Gagal ambil taxonomy:", err);
      }
    };
    fetchTaxonomy();
  }, []);

  const handleSave = async () => {
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
      alert("Spesies harus diisi (dipilih atau ditambah)");
      return;
    }

    try {
      await axiosClient.post("/api/taxonomy/full", payload);
      alert("✅ Semua data berhasil disimpan!");
      setSelected({});
      setNewEntries({});
    } catch (err) {
      alert(
        "❌ Gagal menyimpan: " + (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow space-y-6 font-Poppins">
        <h1 className="text-2xl font-bold">Tambah Klasifikasi Tumbuhan</h1>

        <div className="space-y-6">
          {TAXONOMY_LEVELS.map(({ key, label, plural }) => (
            <div key={key}>
              <p className="text-lg font-semibold">{label}</p>

              {/* Dropdown jika data tersedia */}
              {(taxonomyData[plural] || []).length > 0 && (
                <div className="mt-2">
                  <select
                    className="border px-3 py-2 rounded w-full"
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
                </div>
              )}

              {/* Tambah entri baru */}
              <div className="mt-3">
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
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => {
              setSelected({});
              setNewEntries({});
            }}
          >
            Reset
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSave}
          >
            Simpan Tumbuhan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default TaxonomyFormPage;
