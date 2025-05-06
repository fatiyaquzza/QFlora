import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminHeader from "../components/AdminHeader";
import Modal from "../components/Modal";

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
      <AdminHeader />
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Daftar Akun Firebase</h1>
        <table className="w-full text-sm border border-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">UID</th>
              <th className="px-2 py-1 border">Email</th>
              <th className="px-2 py-1 border">Nama</th>
              <th className="px-2 py-1 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="px-2 py-1 border break-all">{user.uid}</td>
                <td className="px-2 py-1 border">{user.email}</td>
                <td className="px-2 py-1 border">{user.displayName}</td>
                <td className="px-2 py-1 border">
                  <div className="flex gap-2 justify-center">
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

      {/* Modal Edit */}
      <Modal
        show={!!editing}
        title={`Edit Nama: ${editing?.email}`}
        onClose={() => setEditing(null)}
      >
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full border p-2 rounded"
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
