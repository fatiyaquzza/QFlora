import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { FaTrash } from "react-icons/fa";

function AddChemicalPage() {
  const [chemComp, setchemComp] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

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
      setLoading(true);
      const res = await axiosClient.get("/api/chemical-components");
      setchemComp(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data Komposisi Kimia:", err);
      setErrorMessage("Gagal mengambil data Komposisi Kimia.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/chemical-components", form);
      setForm({ name: "" });
      setShowForm(false);
      setFormError("");
      fetchChemComp();
    } catch (err) {
      if (err.response?.status === 409) {
        setFormError(`Komposisi kimia "${form.name}" sudah ada dalam daftar`);
      } else {
        setFormError("Terjadi kesalahan saat menambahkan komposisi kimia");
      }
    }
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

  const Pagination = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chemComp.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-6 shadow font-Poppins">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap py-2">
              Daftar Komposisi Kimia
            </h1>
          </div>
          <button
            className="px-4 py-3 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
            onClick={() => setShowForm(true)}
          >
            + Tambah
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">
                Memuat data komposisi kimia...
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentItems.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-green-50 p-4 rounded-md shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {String(indexOfFirstItem + i + 1).padStart(2, "0")}
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
            <Pagination totalItems={chemComp.length} />
            {chemComp.length > 0 && (
              <div className="text-center text-sm text-gray-600 mt-4">
                Menampilkan {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, chemComp.length)} dari{" "}
                {chemComp.length} data
              </div>
            )}
          </>
        )}

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
        onClose={() => {
          setShowForm(false);
          setFormError("");
        }}
      >
        <form onSubmit={handleAdd} className="space-y-3">
          {formError && (
            <div className="p-3 text-red-800 bg-red-100 rounded text-sm">
              {formError}
            </div>
          )}
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
              onClick={() => {
                setShowForm(false);
                setFormError("");
              }}
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
