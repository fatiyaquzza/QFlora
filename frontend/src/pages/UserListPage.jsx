import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import AdminLayout from "../components/AdminLayout";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosClient
      .get("/users")
      .then((res) => setUsers(res.data.users))
      .catch((err) => setErrorMessage("Gagal mengambil data user."));
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
        <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
          <div className="px-2 pt-2">
            <h1 className="mb-6 text-xl font-bold text-black">
              Daftar Akun Firebase
            </h1>
            <div className="border-t border-gray-300 mb-4"></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-y-4">
                <thead className="text-gray-600">
                  <tr>
                    <th className="px-4 py-2">UID</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="bg-white shadow rounded">
                      <td className="px-4 py-4 break-all">{user.uid}</td>
                      <td className="px-4 py-4">{user.email}</td>
                      <td className="px-4 py-4">{user.displayName}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditing(user)}
                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(user)}
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        </div>
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
