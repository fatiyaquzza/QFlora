import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import SearchCard, {
  SearchPlant,
  PlantCategory,
} from "../../components/Card/SearchCard";

const SearchPage = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<PlantCategory | "Semua">(
    "Semua"
  );

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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-end px-4 pb-4 border-b border-gray">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <Text className="text-xl font-poppinsSemiBold text-primary">
          Telusuri Tumbuh-Tumbuhan
        </Text>
      </View>

      <View className="flex-1 bg-gray-100">
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <View className="flex flex-row items-center px-4 mx-4 bg-gray-100 border rounded-xl border-primary">
            <Ionicons name="search" size={18} color="gray" />
            <TextInput
              placeholder="Cari tumbuhan atau ayat al quran"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 py-2 ml-2 text-gray-700 font-poppins"
            />
          </View>
        </View>

        {/* Filter Buttons - Fixed position */}
        <View className="px-4 mx-5 mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {[
              "Semua",
              PlantCategory.Buah,
              PlantCategory.Sayur,
              PlantCategory.Bunga,
            ].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() =>
                  setSelectedFilter(filter as PlantCategory | "Semua")
                }
                className={`px-5 py-2 rounded-lg border mr-3 ${
                  selectedFilter === filter
                    ? "bg-primary text-white"
                    : "bg-white text-gray-800 border-gray-400"
                }`}
              >
                <Text
                  className={
                    selectedFilter === filter
                      ? "text-white font-poppinsSemiBold"
                      : "text-gray-800 font-poppins"
                  }
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Plants List */}
        <ScrollView
          className="px-4 mt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <SearchCard
            plants={filteredPlants}
            onToggleFavorite={handleToggleFavorite}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchPage;
