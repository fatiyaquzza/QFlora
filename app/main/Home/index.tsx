import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import TimeCard from "./Card/TimeCard";
import PlantsCard from "./Card/PlantsCard";
import { StatusBar } from "expo-status-bar";

// Define the Plant interface
export interface Plant {
  id: string;
  name: string;
  image: any;
  liked: boolean;
}

const Home: React.FC = () => {
  // Sample plant data
  const [plants, setPlants] = useState<Plant[]>([
    {
      id: "1",
      name: "Anggur",
      image: require("../../../assets/images/tumbuhan/anggur.jpg"),
      liked: false,
    },
    {
      id: "2",
      name: "Kurma",
      image: require("../../../assets/images/tumbuhan/kurma.jpg"),
      liked: false,
    },
    {
      id: "3",
      name: "Zaitun",
      image: require("../../../assets/images/tumbuhan/kurma.jpg"),
      liked: false,
    },
    {
      id: "4",
      name: "Semangka",
      image: require("../../../assets/images/tumbuhan/semangka.jpg"),
      liked: true,
    },
    {
      id: "5",
      name: "Delima",
      image: require("../../../assets/images/tumbuhan/delima.jpg"),
      liked: true,
    },
  ]);

  // Toggle favorite status for a plant
  const handleToggleFavorite = (id: string) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, liked: !plant.liked } : plant
      )
    );
  };

  // Filter plants for favorites
  const favoritePlants = plants.filter((plant) => plant.liked);

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView>
        <View className="flex-1 px-3 mt-12 bg-gray-100">
          {/* Header */}
          <View className="flex-row items-end my-4">
            <Image
              source={require("../../../assets/images/logo.png")}
              className="w-16 h-16 mx-2"
            />
            <Text className="text-2xl font-poppinsSemiBold text-primary">
              Halo, <Text className="font-poppinsBold text-primary">User</Text>
            </Text>
          </View>

          {/* Time Card */}
          <TimeCard />

          {/* Tumbuhan di Alquran */}
          <View className="flex-row items-center justify-between mx-5 mt-10">
            <Text className="text-lg font-poppinsSemiBold text-primary">
              Jelajahi Tumbuhan di Alquran
            </Text>
            <TouchableOpacity>
              <Text className="font-poppins text-secondary">see all</Text>
            </TouchableOpacity>
          </View>

          {/* All Plants Card */}
          <PlantsCard
            plants={plants}
            showFavoriteIcon={true}
            onToggleFavorite={handleToggleFavorite}
          />

          {/* Favorite Plants Section */}
          <View className="flex-row items-center justify-between mx-5 mt-5">
            <Text className="text-lg font-poppinsSemiBold text-primary">
              Tumbuhan Favorit
            </Text>
            <TouchableOpacity>
              <Text className="font-poppins text-secondary">see all</Text>
            </TouchableOpacity>
          </View>

          {/* Favorite Plants Card */}
          <PlantsCard
            plants={favoritePlants}
            showFavoriteIcon={true}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Home;
