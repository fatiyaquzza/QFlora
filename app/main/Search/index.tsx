import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { StatusBar } from "expo-status-bar";
import SearchCard, { SearchPlant, PlantCategory } from "./Card/SearchCard";

const SearchPage = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<PlantCategory | "Semua">("Semua");

  const [plants, setPlants] = useState<SearchPlant[]>([
    {
      id: "1",
      name: "Anggur",
      image: require("../../../assets/images/tumbuhan/anggur.jpg"),
      liked: false,
      category: PlantCategory.Buah,
      verses: [{ surah: "Al-Baqarah", ayat: "26" }],
    },
    {
      id: "2",
      name: "Kurma",
      image: require("../../../assets/images/tumbuhan/kurma.jpg"),
      liked: true,
      category: PlantCategory.Buah,
      verses: [{ surah: "Al-Baqarah", ayat: "266" }],
    },
    {
      id: "3",
      name: "Bayam",
      image: require("../../../assets/images/tumbuhan/delima.jpg"),
      liked: false,
      category: PlantCategory.Sayur,
      verses: [{ surah: "An-Nahl", ayat: "11" }],
    },
    {
      id: "4",
      name: "Mawar",
      image: require("../../../assets/images/tumbuhan/semangka.jpg"),
      liked: true,
      category: PlantCategory.Bunga,
      verses: [{ surah: "Ar-Rahman", ayat: "48" }],
    },
  ]);

  const handleToggleFavorite = (id: string) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, liked: !plant.liked } : plant
      )
    );
  };

  const filteredPlants = plants.filter(
    (plant) =>
      (selectedFilter === "Semua" || plant.category === selectedFilter) &&
      plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text className="text-xl mb-2 font-poppinsSemiBold text-primary">
              Telusuri Tumbuh-Tumbuhan
            </Text>
          </View>

          {/* Search Bar */}
          <View className="flex flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-primary mx-4 mb-4">
            <Ionicons name="search" size={18} color="gray" />
            <TextInput
              placeholder="Cari tumbuhan atau ayat al quran"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-gray-700"
            />
          </View>

          {/* Filter Buttons */}
          <View className="flex-row justify-center space-x-2 mb-6">
            {["Semua", PlantCategory.Buah, PlantCategory.Sayur, PlantCategory.Bunga].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter as PlantCategory | "Semua")}
                className={`px-4 py-2 rounded-lg border mx-2 ${
                  selectedFilter === filter ? "bg-primary text-white" : "bg-white text-gray-800 border-gray-400"
                }`}
              >
                <Text className={selectedFilter === filter ? "text-white font-poppinsSemiBold" : "text-gray-800 font-poppins"}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Menampilkan daftar tanaman dengan SearchCard */}
          <SearchCard plants={filteredPlants} onToggleFavorite={handleToggleFavorite} />
        </View>
      </ScrollView>
    </>
  );
};

export default SearchPage;
