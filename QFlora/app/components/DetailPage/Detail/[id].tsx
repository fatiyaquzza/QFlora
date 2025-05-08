import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axiosClient from "../../../../api/axioxClient";
import { SpecificPlant } from "../../type";
import { useFavorite } from "../../../../context/FavoriteContext";

const Detail = () => {
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<SpecificPlant | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);

  // Ambil data plant
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosClient.get(`/specific-plants/${id}`);
        setPlant(response.data);
      } catch (err) {
        console.error("❌ Gagal fetch detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Sync status favorite
  useEffect(() => {
    if (plant) {
      setIsFavorite(favorites.includes(plant.id));
    }
  }, [favorites, plant]);

  const toggle = async () => {
    if (!plant) return;
    await toggleFavorite(plant.id);
    setIsFavorite((prev) => !prev); // opsional (untuk langsung berubah)
  };

  const handleBack = () => {
    router.replace("../../../main/Search");
  };

  if (loading || !plant) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0B2D12" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Posisi Tumbuhan dalam Al-Quran",
          headerTintColor: "#333",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 16 },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-white">
        {/* Header Image */}
        <View className="p-6 pt-8 bg-primary">
          <View className="relative m-2 overflow-hidden border-2 border-white rounded-xl">
            <Image
              source={{ uri: plant.image_url }}
              className="w-full h-64"
              resizeMode="cover"
            />
            <View className="absolute top-0 bottom-0 left-0 right-0 bg-black/50" />
            <TouchableOpacity
              className="absolute m-2 bottom-2 right-2"
              onPress={toggle}
            >
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={26}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nama dan tombol full detail */}
        <View className="px-8 pt-2 pb-6 bg-primary">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-poppinsBold text-secondary">
                {plant.name}
              </Text>
              <Text className="text-base text-white font-poppinsItalic">
                {plant.latin_name}
              </Text>
            </View>
            <TouchableOpacity
              className="px-4 py-2 ml-2 rounded-lg bg-secondary"
              onPress={() =>
                router.push({
                  pathname: "/components/DetailPage/FullDetail",
                  params: { id: plant.id },
                })
              }
            >
              <Text className="text-base text-center font-poppinsSemiBold text-primary">
                Informasi{"\n"}Tumbuhan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="mx-4">
          {/* Overview */}
          <View className="p-5">
            <Text className="mb-2 text-2xl font-poppinsBold">Overview</Text>
            <Text className="text-gray-800 font-poppins">{plant.overview}</Text>
          </View>

          {/* Ayat */}
          {plant.verses.map((verse, index) => (
            <View className="px-4 mb-4" key={index}>
              <View className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <Text className="mb-2 text-lg font-poppinsBold">
                  Surah {verse.surah}
                </Text>
                <Text className="mb-3 text-2xl leading-10 text-right font-poppins">
                  {verse.quran_verse}
                </Text>
                <Text className="text-gray-700 font-poppins">
                  {verse.translation}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Detail;
