import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminHeader from "../components/AdminHeader";
import { Link } from "react-router-dom";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGeneral: 0,
    totalSpecific: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, generalRes, specificRes] = await Promise.all([
          axiosClient.get("/users"),
          axiosClient.get("/general-categories"),
          axiosClient.get("/specific-plants"),
        ]);

        setStats({
          totalUsers: userRes.data.users.length,
          totalGeneral: generalRes.data.length,
          totalSpecific: specificRes.data.length,
        });
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Dashboard QFLORA Admin</h1>

        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <Link
            to="/users"
            className="p-4 bg-white border border-green-200 rounded shadow hover:bg-green-50"
          >
            <h2 className="text-lg font-semibold text-green-800">Total Akun Pengguna</h2>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </Link>

          <Link
            to="/general-categories"
            className="p-4 bg-white border border-blue-200 rounded shadow hover:bg-blue-50"
          >
            <h2 className="text-lg font-semibold text-blue-800">
              Kategori Umum
            </h2>
            <p className="text-3xl font-bold">{stats.totalGeneral}</p>
          </Link>

          <Link
            to="/specific-plants"
            className="p-4 bg-white border border-purple-200 rounded shadow hover:bg-purple-50"
          >
            <h2 className="text-lg font-semibold text-purple-800">
              Kategori Spesifik
            </h2>
            <p className="text-3xl font-bold">{stats.totalSpecific}</p>
          </Link>
        </div>

        <p className="text-gray-600">
          Selamat datang di dashboard QFLORA. Silakan gunakan menu di atas untuk
          mengelola data.
        </p>
      </div>
    </>
  );
}

export default DashboardPage;
