import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MdSpaceDashboard,
  MdInventory2,
  MdDescription,
  MdPerson,
  MdScience,
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
      className={`fixed top-0 left-0 h-screen w-64 bg-green-100 shadow-xl z-20 transition-transform duration-300 ease-in-out transform lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative flex items-center justify-center h-20 px-4">
        <h1 className="text-2xl font-bold text-green-900">QFlora</h1>
        <button
          className="absolute p-2 text-gray-600 rounded-full right-4 lg:hidden hover:bg-green-200"
          onClick={toggleSidebar}
        >
          <MdClose size={24} />
        </button>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleSubmenu(item.label)}
                className={`flex items-center justify-between w-full gap-3 px-3 py-3 rounded-md transition-all text-sm font-medium ${
                  item.children.some((child) => isPathActive(child.path))
                    ? "bg-green-800 text-white shadow-sm"
                    : "text-gray-800 hover:bg-green-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="uppercase">{item.label}</span>
                </div>
                <span className="text-lg">
                  {openSubmenus[item.label] ? "▾" : "▸"}
                </span>
              </button>
              {openSubmenus[item.label] !== false &&
                (openSubmenus[item.label] ||
                  item.children.some((child) => isPathActive(child.path))) && (
                  <div className="ml-1 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`block px-3 py-2 text-sm font-medium rounded-md transition-all ${
                          isPathActive(child.path)
                            ? "bg-green-700 text-white"
                            : "text-gray-800 hover:bg-green-100"
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
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all text-sm font-medium font-Poppin ${
                isPathActive(item.path)
                  ? "bg-green-800 text-white shadow-sm"
                  : "text-gray-800 hover:bg-green-200"
              }`}
            >
              {item.icon}
              <span className="uppercase">{item.label}</span>
            </Link>
          )
        )}
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-4 left-4 right-4 px-3 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
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
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b">
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
