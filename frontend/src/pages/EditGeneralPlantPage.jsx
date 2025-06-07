import React, { useState, useRef, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

function EditGeneralPlantPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    overview: "",
  });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const inputRefs = {
    name: useRef(null),
    latin_name: useRef(null),
    image_url: useRef(null),
    overview: useRef(null),
  };

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setIsLoading(true);
        const res = await axiosClient.get(`/general-categories/${id}`);
        setForm(res.data);
      } catch (err) {
        setError("Gagal memuat data tanaman.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const fieldsToUpdate = {
      name: form.name,
      latin_name: form.latin_name,
      image_url: form.image_url,
      overview: form.overview,
    };

    const emptyField = Object.entries(fieldsToUpdate).find(([, value]) => !(value || "").trim());
    if (emptyField) {
      const [firstEmptyKey] = emptyField;
      inputRefs[firstEmptyKey].current?.focus();
      setTouched((prev) => ({ ...prev, [firstEmptyKey]: true }));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await axiosClient.put(`/general-categories/${id}`, fieldsToUpdate);
      navigate("/general-categories");
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-black">
              Edit Tumbuhan General
            </h1>
            <button
              className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
              onClick={() => navigate("/general-categories")}
            >
              Kembali
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            {['name', 'latin_name', 'image_url', 'overview'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                {key === 'overview' ? (
                  <textarea
                    ref={inputRefs[key]}
                    id={key}
                    name={key}
                    rows="4"
                    className={`w-full p-2 border rounded transition-colors ${
                      touched[key] && !(form[key] || "").trim()
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    }`}
                    value={form[key] || ""}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, [key]: true }))
                    }
                    placeholder={`Masukkan ${key.replace(/_/g, " ")}`}
                  />
                ) : (
                  <input
                    ref={inputRefs[key]}
                    id={key}
                    name={key}
                    type="text"
                    className={`w-full p-2 border rounded transition-colors ${
                      touched[key] && !(form[key] || "").trim()
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    }`}
                    value={form[key] || ""}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, [key]: true }))
                    }
                    placeholder={`Masukkan ${key.replace(/_/g, " ")}`}
                  />
                )}
                {touched[key] && !(form[key] || "").trim() && (
                  <p className="text-sm text-red-500 mt-1">
                    {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} wajib diisi.
                  </p>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-400"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditGeneralPlantPage; 