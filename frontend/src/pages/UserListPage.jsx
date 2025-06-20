import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true); // mulai loading
    axiosClient
      .get("/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => setErrorMessage("Gagal mengambil data user."))
      .finally(() => setLoading(false)); // selesai loading
  };

  const confirmDelete = (user) => {
    setConfirmDeleteUser(user);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteUser) return;

    axiosClient
      .delete(`/users/${confirmDeleteUser.uid}`)
      .then(() => {
        fetchUsers();
        setConfirmDeleteUser(null);
      })
      .catch(() => {
        setErrorMessage("Gagal menghapus user.");
        setConfirmDeleteUser(null);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .patch(`/users/${editing.uid}`, { displayName: editing.displayName })
      .then(() => {
        fetchUsers();
        setEditing(null);
      })
      .catch(() => setErrorMessage("Gagal mengupdate user."));
  };

  return (
    <>
      <AdminLayout>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow border px-6 py-4 font-Poppins">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-xl font-semibold text-gray-800 py-2">
                Daftar Pengguna
              </h1>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Profile</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <div className="flex justify-center items-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                          <span className="ml-2 text-gray-600">
                            Memuat pengguna...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <tr
                        key={user.uid}
                        className={`border-b hover:bg-gray-50 transition`}
                      >
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 flex items-center gap-3">
                          <span className="font-medium text-gray-800">
                            {user.displayName}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditing(user)}
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
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
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(user)}
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
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
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-500"
                      >
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* Modal Edit */}
      <Modal
        show={!!editing}
        title={`Edit Nama: ${editing?.email}`}
        onClose={() => setEditing(null)}
      >
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={editing?.displayName || ""}
            onChange={(e) =>
              setEditing({ ...editing, displayName: e.target.value })
            }
            placeholder="Nama Pengguna"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setEditing(null)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        show={!!confirmDeleteUser}
        title="Konfirmasi Hapus"
        onClose={() => setConfirmDeleteUser(null)}
      >
        <div className="space-y-4">
          <p>
            Yakin ingin menghapus user dengan email:{" "}
            <strong>{confirmDeleteUser?.email}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmDeleteUser(null)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Error */}
      <Modal
        show={!!errorMessage}
        title="Terjadi Kesalahan"
        onClose={() => setErrorMessage("")}
      >
        <div className="space-y-4">
          <p>{errorMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setErrorMessage("")}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UserListPage;
