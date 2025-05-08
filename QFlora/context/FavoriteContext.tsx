import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axioxClient";
import { auth } from "../firebase";

interface FavoriteContextType {
  favorites: number[];
  generalFavorites: number[];
  toggleFavorite: (id: number) => void;
  toggleGeneralFavorite: (id: number) => void;
  refreshFavorites: () => void;
}

const FavoriteContext = createContext<FavoriteContextType>({
  favorites: [],
  generalFavorites: [],
  toggleFavorite: () => {},
  toggleGeneralFavorite: () => {},
  refreshFavorites: () => {},
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [generalFavorites, setGeneralFavorites] = useState<number[]>([]);

  const fetchFavorites = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axiosClient.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.map((item: any) => item.specific_plant_id);
      setFavorites(ids);
    } catch (err) {}
  };

  const fetchGeneralFavorites = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Token kosong");

      const res = await axiosClient.get("/general-favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.map((item: any) => item.general_category_id);
      setGeneralFavorites(ids);
    } catch (err) {}
  };

  const toggleFavorite = async (plantId: number) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (favorites.includes(plantId)) {
        await axiosClient.delete(`/favorites/${plantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((id) => id !== plantId));
      } else {
        await axiosClient.post(
          "/favorites",
          { specific_plant_id: plantId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites((prev) => [...prev, plantId]);
      }
    } catch (err) {
      console.error("❌ Toggle favorit gagal:", err);
    }
  };

  const toggleGeneralFavorite = async (categoryId: number) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (generalFavorites.includes(categoryId)) {
        await axiosClient.delete(`/general-favorites/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGeneralFavorites((prev) => prev.filter((id) => id !== categoryId));
      } else {
        await axiosClient.post(
          "/general-favorites",
          { general_category_id: categoryId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGeneralFavorites((prev) => [...prev, categoryId]);
      }
    } catch (err) {
      console.error("❌ Toggle general favorit gagal:", err);
    }
  };

  const refreshFavorites = () => {
    fetchFavorites();
    fetchGeneralFavorites();
  };

  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        generalFavorites,
        toggleFavorite,
        toggleGeneralFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);
