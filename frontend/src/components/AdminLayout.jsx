import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MdSpaceDashboard,
  MdInventory2,
  MdDescription,
  MdPerson,
  MdScience,
  MdAccountTree,
} from "react-icons/md";

const navItems = [
  { path: "/", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
  {
    path: "/general-categories",
    label: "Kategori Umum",
    icon: <MdInventory2 size={20} />,
  },
  {
    path: "/specific-plants",
    label: "Kategori Spesifik",
    icon: <MdDescription size={20} />,
  },
  {
    path: "/taxonomy",
    label: "Klasifikasi",
    icon: <MdAccountTree size={20} />,
  },
  {
    path: "/chemical-comp",
    label: "Komposisi Kimia",
    icon: <MdScience size={20} />,
  },
  { path: "/users", label: "Pengguna", icon: <MdPerson size={20} /> },
  {
    path: "/suggestions",
    label: "Saran",
    icon: <MdDescription size={20} />,
  },
];

function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isPathActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen font-Poppins">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-green-200 bg-opacity-35 drop-shadow-sm shadow-black py-6 z-10">
        <h1 className="mb-10 text-2xl font-bold text-center text-black">
          QFlora
        </h1>
        <nav className="flex flex-col gap-2 px-4 pb-20">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-4 rounded-md transition-all ${
                isPathActive(item.path)
                  ? "bg-green-900 text-white"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium uppercase">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout button di bawah */}
        <button
          onClick={logout}
          className="absolute bottom-4 left-4 right-4 px-3 py-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Content - offset to right of fixed sidebar */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-end px-6 py-5 bg-white border-b-2 drop-shadow-sm">
          <div className="relative flex items-center gap-3">
            <p className="text-sm font-semibold text-black">
              Halo,{" "}
              <span className="font-medium text-gray-500">
                Admin {user?.displayName}
              </span>
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
