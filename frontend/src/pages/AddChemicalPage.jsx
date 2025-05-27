import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { FaTrash } from "react-icons/fa"; 

function AddChemicalPage() {
  const [chemComp, setchemComp] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchChemComp();
  }, []);

  const fetchChemComp = async () => {
    try {
      const res = await axiosClient.get("/api/chemical-components");
      setchemComp(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data Komposisi Kimia:", err);
      setErrorMessage("Gagal mengambil data Komposisi Kimia.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await axiosClient.post("/api/chemical-components", form);
    setForm({ name: "" });
    setShowForm(false);
    fetchChemComp();
  };

  const handleDeleteClick = (component) => {
    setComponentToDelete(component);
    setShowDeleteModal(true);
  };

  const confirmDeleteComponent = async () => {
    if (!componentToDelete) return;

    try {
      await axiosClient.delete(
        `/api/chemical-components/${componentToDelete.id}`
      );
      setShowDeleteModal(false);
      setComponentToDelete(null);
      fetchChemComp();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal menghapus");
    }
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-6 shadow font-Poppins">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-black">
            Daftar Komposisi Kimia
          </h1>
          <button
            className="px-4 py-2 text-sm text-white bg-[#004E1D] rounded hover:bg-green-700"
            onClick={() => setShowForm(true)}
          >
            Tambah
          </button>
        </div>

        <div className="border-t border-gray-300 mb-6"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {chemComp.map((c, i) => (
            <div
              key={c.id}
              className="bg-green-50 p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-semibold text-black">{c.name}</p>
              </div>
              <button
                onClick={() => handleDeleteClick(c)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="p-3 mt-4 text-red-800 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}
      </div>

      <Modal
        show={showDeleteModal}
        title="Konfirmasi Hapus"
        onClose={() => {
          setShowDeleteModal(false);
          setComponentToDelete(null);
        }}
      >
        <div className="space-y-4">
          <p>
            Apakah Anda yakin ingin menghapus komponen{" "}
            <span className="font-semibold text-red-600">
              {componentToDelete?.name}
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
              onClick={confirmDeleteComponent}
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>

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
              className="w-full p-2 border rounded capitalize"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={key.replace(/_/g, " ")}
            />
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowForm(false)}
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
    </AdminLayout>
  );
}

export default AddChemicalPage;
