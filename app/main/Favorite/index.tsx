import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import FavoriteCard from "./Card/FavoriteCard";
import { Plant } from "./Card/FavoriteCard";

const FavoritePage = (): JSX.Element => { 
  const [plants, setPlants] = useState<Plant[]>([
    {
      id: "1",
      name: "Anggur",
      image: require("../../../assets/images/tumbuhan/anggur.jpg"),
      liked: true,
      verses: [
        { surah: "Al-Baqarah", ayat: "26" },
        { surah: "Yusuf", ayat: "36,49" },
      ],
    },
    {
      id: "2",
      name: "Kurma",
      image: require("../../../assets/images/tumbuhan/kurma.jpg"),
      liked: true,
      verses: [
        { surah: "Al-Baqarah", ayat: "266" },
        { surah: "Al-An'am", ayat: "11" },
      ],
    },
    {
      id: "4",
      name: "Semangka",
      image: require("../../../assets/images/tumbuhan/semangka.jpg"),
      liked: true,
      verses: [{ surah: "Al-Baqarah", ayat: "26" }],
    },
    {
      id: "5",
      name: "Delima",
      image: require("../../../assets/images/tumbuhan/delima.jpg"),
      liked: true,
      verses: [{ surah: "Al-Baqarah", ayat: "26" }],
    },
  ]);

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
          <View className="flex-row items-end my-4">
            <Image
              source={require("../../../assets/images/logo.png")}
              className="w-16 h-16 mx-2"
            />
            <Text className="text-2xl mb-2 font-poppinsSemiBold text-primary">
              Tumbuhan Favorit
            </Text>
          </View>

          {/* Favorite Plants */}
          {favoritePlants.length > 0 ? (
            <FavoriteCard
              plants={favoritePlants}
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

export default FavoritePage;
