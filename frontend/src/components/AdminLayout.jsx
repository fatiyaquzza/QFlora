import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MdSpaceDashboard,
  MdInventory2,
  MdDescription,
  MdPerson,
  MdAccountTree,
  MdMenu,
  MdClose,
} from "react-icons/md";

const navItems = [
  { path: "/", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
  {
    path: "/general-categories",
    label: "Kategori Umum",
    icon: <MdInventory2 size={20} />,
  },
  {
    label: "Kategori Spesifik",
    icon: <MdAccountTree size={20} />,
    children: [
      {
        path: "/specific-plants",
        label: "Tumbuhan Spesifik",
      },
      {
        path: "/taxonomy",
        label: "Klasifikasi",
      },
      {
        path: "/chemical-comp",
        label: "Komposisi Kimia",
      },
    ],
  },
  {
    path: "/users",
    label: "Pengguna",
    icon: <MdPerson size={20} />,
  },
  {
    path: "/suggestions",
    label: "Saran",
    icon: <MdDescription size={20} />,
  },
];

function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSubmenus, setOpenSubmenus] = useState({});
  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: prev[label] === false ? true : false,
    }));
  };

  const isPathActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const defaultOpen = {};
    navItems.forEach((item) => {
      if (
        item.children &&
        item.children.some((child) => location.pathname.startsWith(child.path))
      ) {
        defaultOpen[item.label] = true;
      }
    });
    setOpenSubmenus(defaultOpen);
  }, [location.pathname]);

  const Sidebar = () => (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-primary shadow-xl z-20 transition-transform duration-300 ease-in-out transform lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header Logo */}
      <div className="relative flex items-center justify-center h-20 px-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">QFlora</h1>
        <button
          className="absolute p-2 text-white right-4 lg:hidden hover:bg-white/10 rounded-full"
          onClick={toggleSidebar}
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2 p-4 text-sm">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleSubmenu(item.label)}
                className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg transition-all ${
                  item.children.some((child) => isPathActive(child.path))
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-lg">
                  {openSubmenus[item.label] ? "▾" : "▸"}
                </span>
              </button>

              {openSubmenus[item.label] !== false &&
                (openSubmenus[item.label] ||
                  item.children.some((child) => isPathActive(child.path))) && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`px-3 py-2 rounded-md transition-all ${
                          isPathActive(child.path)
                            ? "bg-white/10 text-white"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-Poppins ${
                isPathActive(item.path)
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        )}
      </nav>

      {/* Logout - Modern Style */}
      <div
        onClick={logout}
        className="absolute bottom-6 left-4 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg cursor-pointer transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
          />
        </svg>
        <span className="font-medium">Keluar</span>
      </div>
    </aside>
  );

  // Overlay for mobile when sidebar is open
  const Overlay = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-10 lg:hidden transition-opacity duration-300 ${
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleSidebar}
    />
  );

  return (
    <div className="min-h-screen font-Poppins bg-gray-50">
      <Overlay />
      <Sidebar />

      {/* Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b drop-shadow-md">
          <button
            className="p-2 -ml-2 text-gray-600 rounded-md lg:hidden hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <MdMenu size={24} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <p className="text-sm font-semibold text-black">
              Halo,{" "}
              <span className="font-medium text-gray-600">
                Admin {user?.displayName}
              </span>
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        <footer className="px-6 py-4 mt-auto text-center bg-white border-t">
          <p className="text-sm text-gray-600">
            © 2025 QFlora. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
