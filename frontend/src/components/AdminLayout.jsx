import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/general-categories", label: "Kategori Umum" },
  { path: "/specific-plants", label: "Kategori Spesifik" },
  { path: "/users", label: "Akun Pengguna" },
];

function AdminLayout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 gap-4 p-6 text-white bg-green-900">
        <h1 className="mb-6 text-xl font-bold">QFLORA Admin</h1>
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-green-800 ${
                location.pathname === item.path ? "bg-green-800" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="px-3 py-2 mt-auto text-white bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}

export default AdminLayout;
