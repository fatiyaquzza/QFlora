import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axiosClient from "../../../api/axioxClient";
import { useFavorite } from "../../../context/FavoriteContext";

const DetailUmum = () => {
  const [plant, setPlant] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useLocalSearchParams();
  const { generalFavorites, toggleGeneralFavorite } = useFavorite();

  // Ambil data tanaman dan status favorit
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await axiosClient.get(`/general-categories/${id}`);
        setPlant(res.data);

        if (res.data?.id) {
          setIsFavorite(generalFavorites.includes(res.data.id));
        }
      } catch (err) {
        console.error("❌ Gagal ambil detail:", err);
      }
    };

    fetchPlant();
  }, [id, generalFavorites]);

  const toggleFavorite = async () => {
    if (!plant) return;
    await toggleGeneralFavorite(plant.id);
    setIsFavorite((prev) => !prev);
  };

  const handleBack = () => {
    router.replace("../../main/General");
  };

  if (!plant) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Posisi Tumbuhan dalam Al-Qur’an",
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
        <View className="p-6 pt-8">
          <View className="relative m-2 overflow-hidden border-2 border-white rounded-xl">
            <Image
              source={{ uri: plant.image_url }}
              className="w-full h-72"
              resizeMode="cover"
            />
            <View
              className="absolute top-0 bottom-0 left-0 right-0"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            />
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-3xl text-white font-poppinsBold">
                {plant.name}
              </Text>
            </View>
            <TouchableOpacity
              className="absolute m-2 bottom-2 right-2"
              onPress={toggleFavorite}
            >
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={26}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="mx-4">
          <View className="p-5">
            <Text className="mb-2 text-2xl font-poppinsBold">Overview</Text>
            <Text className="text-gray-800 font-poppins">{plant.overview}</Text>
          </View>

          {plant.verses?.map((verse: any, index: number) => (
            <View className="px-4 mb-4" key={index}>
              <View className="p-4 bg-white border border-gray-200 shadow rounded-xl">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-poppinsBold">
                    Surah {verse.surah} : {verse.verse_number}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons
                      name="play-circle-outline"
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                </View>
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

export default DetailUmum;
