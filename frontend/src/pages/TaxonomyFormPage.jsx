import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";

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
  const [taxonomyData, setTaxonomyData] = useState({});
  const [selected, setSelected] = useState({});
  const [newEntries, setNewEntries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputModes, setInputModes] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const res = await axiosClient.get("/api/taxonomy/full");
        setTaxonomyData(res.data);

        // Set default input modes to "existing" for all levels that have data
        const defaultModes = {};
        TAXONOMY_LEVELS.forEach(({ key, plural }) => {
          defaultModes[key] = res.data[plural]?.length > 0 ? "existing" : "new";
        });
        setInputModes(defaultModes);
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

    // Check fields one by one in reverse order (from species to subkingdom)
    for (const { key } of TAXONOMY_LEVELS.slice().reverse()) {
      if (inputModes[key] === "existing") {
        if (!selected[key]) {
          setTouched((prev) => ({ ...prev, [key]: true }));
          setError(`${key.replace(/_/g, " ")} wajib dipilih`);
          setIsLoading(false);
          return;
        }
        const list =
          taxonomyData[TAXONOMY_LEVELS.find((t) => t.key === key).plural];
        const found = list.find((item) => item.id === selected[key]);
        payload[key] = found.name;
      } else {
        if (!newEntries[key] || newEntries[key].trim() === "") {
          setTouched((prev) => ({ ...prev, [key]: true }));
          setError(`${key.replace(/_/g, " ")} wajib diisi`);
          setIsLoading(false);
          return;
        }
        payload[key] = newEntries[key].trim();
      }
    }

    try {
      await axiosClient.post("/api/taxonomy/full", payload);
      alert("✅ Semua data berhasil disimpan!");
      setSelected({});
      setNewEntries({});
      setTouched({});
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
    setTouched({});
    const defaultModes = {};
    TAXONOMY_LEVELS.forEach(({ key, plural }) => {
      defaultModes[key] = taxonomyData[plural]?.length > 0 ? "existing" : "new";
    });
    setInputModes(defaultModes);
  };

  const handleInputModeChange = (key, mode) => {
    setInputModes((prev) => ({
      ...prev,
      [key]: mode,
    }));
    if (mode === "existing") {
      setNewEntries((prev) => ({ ...prev, [key]: "" }));
    } else {
      setSelected((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const isFieldEmpty = (key) => {
    if (inputModes[key] === "existing") {
      return !selected[key];
    }
    return !newEntries[key] || newEntries[key].trim() === "";
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-black">
              Tambah Klasifikasi Taksonomi
            </h1>
          </div>

          <div className="border-t border-gray-300 mb-4"></div>

          <div className="space-y-6 mx-auto">
            <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
              <h3 className="text-green-800 font-medium">
                Petunjuk Penambahan Klasifikasi
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Untuk setiap level taksonomi, pilih salah satu: gunakan data
                yang sudah ada atau tambahkan data baru.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TAXONOMY_LEVELS.map(({ key, label, plural }) => (
                <div
                  key={key}
                  className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>

                  {/* Radio button selection */}
                  {taxonomyData[plural]?.length > 0 && (
                    <div className="flex gap-4 mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-green-600"
                          name={`input-mode-${key}`}
                          checked={inputModes[key] === "existing"}
                          onChange={() =>
                            handleInputModeChange(key, "existing")
                          }
                        />
                        <span className="ml-2 text-sm">
                          Pilih yang sudah ada
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-green-600"
                          name={`input-mode-${key}`}
                          checked={inputModes[key] === "new"}
                          onChange={() => handleInputModeChange(key, "new")}
                        />
                        <span className="ml-2 text-sm">Tambah baru</span>
                      </label>
                    </div>
                  )}

                  {/* Existing data selection */}
                  {taxonomyData[plural]?.length > 0 &&
                    inputModes[key] === "existing" && (
                      <div>
                        <select
                          className={`w-full p-2 border rounded transition-colors ${
                            touched[key] && isFieldEmpty(key)
                              ? "border-red-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          value={selected[key] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelected((prev) => ({
                              ...prev,
                              [key]: parseInt(value),
                            }));
                            setTouched((prev) => ({ ...prev, [key]: true }));

                            // If previous selectedClass is still valid, keep it
                            if (key === "division") {
                              const filteredClasses = taxonomyData.classes.filter(
                                (c) => c.division_id === parseInt(value)
                              );
                              if (!filteredClasses.find((c) => c.id === parseInt(selected.class_))) {
                                setSelected((prev) => ({
                                  ...prev,
                                  class_: "",
                                  subclass: "",
                                  order: "",
                                  family: "",
                                  genus: "",
                                  species: "",
                                  selectedSpeciesId: null,
                                }));
                              }
                            }
                          }}
                          onBlur={() =>
                            setTouched((prev) => ({ ...prev, [key]: true }))
                          }
                        >
                          <option value="">-- Pilih {label} --</option>
                          {taxonomyData[plural].map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {touched[key] && isFieldEmpty(key) && (
                          <p className="text-sm text-red-500 mt-1">
                            {label} wajib diisi
                          </p>
                        )}
                      </div>
                    )}

                  {/* New entry input */}
                  {(!taxonomyData[plural]?.length ||
                    inputModes[key] === "new") && (
                    <div>
                      <input
                        type="text"
                        value={newEntries[key] || ""}
                        onChange={(e) => {
                          setNewEntries((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                          setTouched((prev) => ({ ...prev, [key]: true }));
                        }}
                        onBlur={() =>
                          setTouched((prev) => ({ ...prev, [key]: true }))
                        }
                        placeholder={`Masukkan ${label} baru`}
                        className={`w-full p-2 border rounded transition-colors ${
                          touched[key] && isFieldEmpty(key)
                            ? "border-red-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                      {touched[key] && isFieldEmpty(key) && (
                        <p className="text-sm text-red-500 mt-1">
                          {label} wajib diisi
                        </p>
                      )}
                    </div>
                  )}
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
