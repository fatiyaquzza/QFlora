import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import FavoriteCard, { Plant } from "../../components/Card/FavoriteCard";
import axiosClient from "../../../api/axioxClient";
import { auth } from "../../../firebase";

const Favorite = () => {
  const [mappedPlants, setMappedPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();

      // Fetch specific favorites
      const specificRes = await axiosClient.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const specificPlants: Plant[] = specificRes.data.map((fav: any) => ({
        id: fav.SpecificPlant.id.toString(),
        name: fav.SpecificPlant.name,
        liked: true,
        image: { uri: fav.SpecificPlant.image_url },
        verses: fav.SpecificPlant.verses.map((v: any) => ({
          surah: v.surah,
          ayat: v.quran_verse,
        })),
        type: "specific",
      }));

      // Fetch general favorites
      const generalRes = await axiosClient.get("/general-favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const generalPlants: Plant[] = generalRes.data.map((fav: any) => ({
        id: fav.GeneralCategory.id.toString(),
        name: fav.GeneralCategory.name,
        liked: true,
        image: { uri: fav.GeneralCategory.image_url },
        verses: fav.GeneralCategory.verses.map((v: any) => ({
          surah: v.surah,
          ayat: v.verse_number,
        })),
        type: "general",
      }));

      setMappedPlants([...specificPlants, ...generalPlants]);
    } catch (error) {
      console.error("❌ Gagal fetch semua favorites", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (
    id: string,
    type: "specific" | "general"
  ) => {
    try {
      const token = await auth.currentUser?.getIdToken();

      if (type === "specific") {
        await axiosClient.delete(`/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMappedPlants((prev) =>
          prev.filter((item) => !(item.id === id && item.type === "specific"))
        );
      } else {
        await axiosClient.delete(`/general-favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMappedPlants((prev) =>
          prev.filter((item) => !(item.id === id && item.type === "general"))
        );
      }
    } catch (error) {
      console.error("❌ Gagal menghapus favorit", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0B2D12" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      <View className="flex-row items-end p-4 pt-10 border-b border-gray bg-background">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <Text className="text-2xl font-poppinsSemiBold text-primary">
          Tumbuhan Favorit
        </Text>
      </View>

      <ScrollView>
        <View className="flex-1 px-3 pt-6 bg-background">
          {mappedPlants.length > 0 ? (
            <FavoriteCard
              plants={mappedPlants}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-400 font-poppinsSemiBold">
                Belum ada tumbuhan favorit
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Favorite;
