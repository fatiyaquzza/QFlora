import React, { useEffect, useState } from "react";
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
import axiosClient from "../../../api/axioxClient";
import { SpecificPlant } from "../../components/type";
import { router } from "expo-router";
import { useFavorite } from "../../../context/FavoriteContext";
import { RefreshControl } from "react-native";

const Search = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<PlantCategory | "Semua">(
    "Semua"
  );
  const { favorites, toggleFavorite, refreshFavorites } = useFavorite();

  const [refreshing, setRefreshing] = useState(false);

  const [plants, setPlants] = useState<SearchPlant[]>([]);

  const filteredPlants = plants.filter(
    (plant) =>
      (selectedFilter === "Semua" || plant.category === selectedFilter) &&
      plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (id: string) => {
    router.push(`../components/DetailPage/Detail/${id}`);
  };

  const fetchPlants = async () => {
    try {
      const response = await axiosClient.get<SpecificPlant[]>(
        "/specific-plants"
      );
      const mapped = response.data.map(
        (item): SearchPlant => ({
          id: item.id.toString(),
          name: item.name,
          image: { uri: item.image_url },
          liked: favorites.includes(item.id),
          category: item.plant_type as PlantCategory,
          verses: item.verses.map((v) => ({
            surah: v.surah,
            ayat: v.id.toString(),
          })),
        })
      );
      setPlants(mapped);
    } catch (err) {
      console.error("❌ Gagal mengambil data spesifik:", err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [favorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(true);
    await refreshFavorites();
    await fetchPlants();
    setRefreshing(false);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(parseInt(id));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-end px-4 pb-4 border-b mt-14 border-gray">
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

        {/* Filter Buttons */}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SearchCard
            plants={filteredPlants}
            onToggleFavorite={handleToggleFavorite}
            onPressCard={handleCardPress}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Search;
