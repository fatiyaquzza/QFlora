import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import UmumCard, { SearchPlant } from "../../components/Card/UmumCard";
import axiosClient from "../../../api/axioxClient";
import React from "react";
import { useFavorite } from "../../../context/FavoriteContext";

const GeneralPage = (): JSX.Element => {
  const [plants, setPlants] = useState<SearchPlant[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { generalFavorites, toggleGeneralFavorite, refreshFavorites } =
    useFavorite();

  const fetchGeneralPlants = async () => {
    try {
      const res = await axiosClient.get("/general-categories");
      const data = res.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        image: { uri: item.image_url },
        liked: generalFavorites.includes(item.id),
        verses: item.verses?.map((v: any) => ({
          surah: v.surah,
          ayat: v.verse_number,
        })),
      }));
      setPlants(data);
    } catch (err: any) {
      console.error("❌ Error:", err.message);
    }
  };

  useEffect(() => {
    fetchGeneralPlants();
  }, [generalFavorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFavorites();
    await fetchGeneralPlants();
    setRefreshing(false);
  };

  const handleToggleFavorite = (id: string) => {
    const plantId = parseInt(id);
    toggleGeneralFavorite(plantId);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-row items-end px-4 pb-4 border-b mt-14 border-gray">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <Text className="text-xl font-poppinsSemiBold text-primary">
          Kategori Umum
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView
          className="px-4 mt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <UmumCard onToggleFavorite={handleToggleFavorite} plants={plants} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GeneralPage;
