import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import TimeCard from "../../components/Card/TimeCard";
import PlantsCard from "../../components/Card/PlantsCard";
import { StatusBar } from "expo-status-bar";
import axiosClient from "../../../api/axioxClient";
import { useAuth } from "../../../context/authContext";

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

  const handleToggleFavorite = (id: string) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAll = await axiosClient.get("/plants/all");
        const resPop = await axiosClient.get("/plants/popular");

        const format = (items: any[]): Plant[] =>
          items.map((p) => ({
            id: p.id.toString(),
            name: p.name,
            liked: false,
            type: p.type || "specific",
            image: { uri: p.image_url },
          }));

        setAllPlants(format(resAll.data));
        setPopularPlants(format(resPop.data));
      } catch (err) {
        console.error("❌ Gagal ambil data home:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <View className="flex-row items-end p-4 mt-10 border-b border-gray">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <Text className="text-2xl font-poppinsSemiBold text-primary">
          Halo,
          <Text className="font-poppinsBold text-primary"> {user?.name}</Text>
        </Text>
      </View>

      <ScrollView>
        <View className="flex-1 px-3 mt-6 bg-gray-100">
          <TimeCard />

          <View className="flex-row items-center justify-between mx-5 mt-10">
            <Text className="text-lg font-poppinsSemiBold text-primary">
              Jelajahi Tumbuhan di Alquran
            </Text>
          </View>

          <PlantsCard
            plants={allPlants}
            showFavoriteIcon={true}
            onToggleFavorite={handleToggleFavorite}
          />

          <View className="flex-row items-center justify-between mx-5 mt-5">
            <Text className="text-lg font-poppinsSemiBold text-primary">
              Tumbuhan Terpopuler
            </Text>
          </View>

          <PlantsCard
            plants={popularPlants}
            showFavoriteIcon={true}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Home;
