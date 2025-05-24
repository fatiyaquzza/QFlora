import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { FaLayerGroup, FaLeaf, FaUsers } from "react-icons/fa";

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

  const cards = [
    {
      title: "Kategori Umum",
      value: stats.totalGeneral,
      to: "/general-categories",
      icon: <FaLayerGroup size={28} className="text-white" />,
    },
    {
      title: "Kategori Spesifik",
      value: stats.totalSpecific,
      to: "/specific-plants",
      icon: <FaLeaf size={28} className="text-white" />,
    },
    {
      title: "Pengguna",
      value: stats.totalUsers,
      to: "/users",
      icon: <FaUsers size={28} className="text-white" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className="flex items-center p-6 bg-white border-2 rounded-xl shadow-md hover:shadow-lg transition min-w-[120px]"
          >
            {/* Icon box */}
            <div
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg mr-6"
              style={{
                background: "linear-gradient(135deg, #1b5e20, #76ff03)",
              }}
            >
              {card.icon}
            </div>

            {/* Text */}
            <div>
              <h2 className="text-xl font-semibold text-green-900">
                {card.title}
              </h2>
              <p className="text-2xl font-bold text-lime-500 mt-1">
                {card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;
