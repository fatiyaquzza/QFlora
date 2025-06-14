import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import TimeCard from "../../components/Card/TimeCard";
import PlantsCard from "../../components/Card/PlantsCard";
import { StatusBar } from "expo-status-bar";
import axiosClient from "../../../api/axioxClient";
import { useAuth } from "../../../context/authContext";
import { useFavorite } from "../../../context/FavoriteContext";

// Define the Plant interface
export interface Plant {
  id: string;
  name: string;
  image: any;
  liked: boolean;
  type: "specific" | "general";
}

const Home: React.FC = () => {
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [popularPlants, setPopularPlants] = useState<Plant[]>([]);
  const { user } = useAuth();
  const { favorites, generalFavorites, toggleFavorite, toggleGeneralFavorite } = useFavorite();
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleFavorite = async (id: string, type: "general" | "specific") => {
    const numericId = Number(id);

    if (type === "general") {
      await toggleGeneralFavorite(numericId);
    } else {
      await toggleFavorite(numericId);
    }

    // Update UI state
    setAllPlants((prev) =>
      prev.map((plant) =>
        plant.id === id ? { ...plant, liked: !plant.liked } : plant
      )
    );
    setPopularPlants((prev) =>
      prev.map((plant) =>
        plant.id === id ? { ...plant, liked: !plant.liked } : plant
      )
    );
  };

  // Remove duplicate plants
  const removeDuplicatePlants = (plants: Plant[]): Plant[] => {
    return Array.from(new Set(plants.map((p) => p.id)))
      .map((id) => plants.find((p) => p.id === id))
      .filter((plant): plant is Plant => plant !== undefined);
  };

  const fetchData = async () => {
    try {
      const resAll = await axiosClient.get("/plants/all");
      const resPop = await axiosClient.get("/plants/popular");

      const format = (items: any[]): Plant[] =>
        items.map((p) => {
          const id = p.id.toString();
          const numericId = Number(p.id);
          const isLiked =
            p.type === "general"
              ? generalFavorites.includes(numericId)
              : favorites.includes(numericId);

          return {
            id,
            name: p.name,
            liked: isLiked,
            type: p.type || "specific",
            image: { uri: p.image_url },
          };
        });

      setAllPlants(removeDuplicatePlants(format(resAll.data)));
      setPopularPlants(removeDuplicatePlants(format(resPop.data)));
    } catch (err) {
      console.error("❌ Gagal ambil data home:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [generalFavorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getPlantById = (id: string): Plant | undefined => {
    return allPlants.find((p) => p.id === id) || popularPlants.find((p) => p.id === id);
  };

  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-row items-end p-4 pt-10 border-b border-gray bg-background">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <Text className="text-2xl font-poppinsSemiBold text-primary">
          Halo,
          <Text className="font-poppinsBold text-primary"> {user?.name}</Text>
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-1 px-3 pt-6 bg-background">
          <TimeCard />

          {/* === ALL PLANTS === */}
          <View className="flex-row items-center justify-between mx-5 mt-10">
            <Text className="text-lg font-poppinsSemiBold text-primary">
              Jelajahi Tumbuhan di Alquran
            </Text>
          </View>
          <PlantsCard
            plants={allPlants}
            showFavoriteIcon={true}
            onToggleFavorite={(id) => {
              const plant = getPlantById(id);
              if (plant) {
                handleToggleFavorite(id, plant.type);
              } else {
                console.warn("Plant not found for toggle:", id);
              }
            }}
          />

          {/* === POPULAR === */}
          <View className="flex-row items-center justify-between mx-5 mt-5">
            <Text className="text-lg font-poppinsSemiBold text-primary">
              Tumbuhan Terpopuler
            </Text>
          </View>
          <PlantsCard
            plants={popularPlants}
            showFavoriteIcon={true}
            onToggleFavorite={(id) => {
              const plant = getPlantById(id);
              if (plant) {
                handleToggleFavorite(id, plant.type);
              } else {
                console.warn("Plant not found for toggle:", id);
              }
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Home;
