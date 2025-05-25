import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import SearchCard, {
  SearchPlant,
  PlantType,
} from "../../components/Card/SearchCard";
import axiosClient from "../../../api/axioxClient";
import { SpecificPlant } from "../../components/type";
import { router } from "expo-router";
import { useFavorite } from "../../../context/FavoriteContext";
import { RefreshControl } from "react-native";
import Fuse from "fuse.js";
import { useTabVisibility } from "../_layout";

const Search = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const { favorites, toggleFavorite, refreshFavorites } = useFavorite();
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const [plants, setPlants] = useState<SearchPlant[]>([]);
  const [fuseResults, setFuseResults] = useState<SearchPlant[]>([]);

  const filteredPlants = fuseResults.filter(
    (plant) => !selectedFilter || plant.plant_type.id === selectedFilter
  );

  const handleCardPress = (id: string) => {
    router.push(`../components/DetailPage/Detail/${id}`);
  };

  const fetchData = async () => {
    try {
      const [plantsRes, typesRes] = await Promise.all([
        axiosClient.get<SpecificPlant[]>("/specific-plants"),
        axiosClient.get<PlantType[]>("/api/plant-types")
      ]);
      
      setPlantTypes(typesRes.data);
      
      const mapped = plantsRes.data.map(
        (item): SearchPlant => ({
          id: item.id.toString(),
          name: item.name,
          image: { uri: item.image_url },
          liked: favorites.includes(item.id),
          plant_type: typesRes.data.find(type => type.id === item.plant_type_id) || typesRes.data[0],
          chemical_components: item.chemical_components,
          verses: item.verses.map((v) => ({
            surah: v.surah,
            ayat: v.id.toString(),
          })),
        })
      );
      setPlants(mapped);
    } catch (err) {
      console.error("❌ Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [favorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFavorites();
    await fetchData();
    setRefreshing(false);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(parseInt(id));
  };

  const { setIsInputFocused } = useTabVisibility();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsInputFocused(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsInputFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!searchQuery || plants.length === 0) {
      setFuseResults(plants);
      return;
    }

    const fuse = new Fuse(plants, {
      keys: ["name", "verses.surah", "verses.ayat"],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 4,
      ignoreLocation: true,
    });

    const results = fuse.search(searchQuery).map((res) => res.item);
    setFuseResults(results);
  }, [searchQuery, plants]);

  return (
    <SafeAreaView className="flex-1 bg-background">
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

        <View className="px-4 mx-5 mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedFilter(null)}
              className={`px-5 py-2 rounded-lg border mr-3 ${
                selectedFilter === null
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800 border-gray-400"
              }`}
            >
              <Text
                className={
                  selectedFilter === null
                    ? "text-white font-poppinsSemiBold"
                    : "text-gray-800 font-poppins"
                }
              >
                Semua
              </Text>
            </TouchableOpacity>
            {plantTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedFilter(type.id)}
                className={`px-5 py-2 rounded-lg border mr-3 ${
                  selectedFilter === type.id
                    ? "bg-primary text-white"
                    : "bg-white text-gray-800 border-gray-400"
                }`}
              >
                <Text
                  className={
                    selectedFilter === type.id
                      ? "text-white font-poppinsSemiBold"
                      : "text-gray-800 font-poppins"
                  }
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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
