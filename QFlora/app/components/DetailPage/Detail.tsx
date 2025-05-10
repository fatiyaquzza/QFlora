import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axiosClient from "../../../api/axioxClient";
import { Audio } from "expo-av";

const Detail = () => {
  const { id } = useLocalSearchParams(); // ID dari URL
  const [plant, setPlant] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Ambil data dari backend
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await axiosClient.get(`/specific-plants/${id}`);
        setPlant(res.data);
      } catch (err) {
        console.error("❌ Gagal ambil detail spesifik:", err);
      }
    };

    fetchPlant();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAudioPress = async (audioUrl: string, index: number) => {
    try {
      // Jika sedang diputar dan tombol yang sama ditekan → stop
      if (playingIndex === index) {
        await soundRef.current?.stopAsync();
        await soundRef.current?.unloadAsync();
        soundRef.current = null;
        setPlayingIndex(null);
        return;
      }

      // Jika sedang ada audio → hentikan dulu
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setPlayingIndex(index);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          setPlayingIndex(null);
        }
      });
    } catch (error) {
      console.error("❌ Gagal memutar audio:", error);
    }
  };

  // Cleanup saat keluar dari halaman
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

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
        {/* Gambar + Favorite */}
        <View className="p-6 pt-8 bg-primary">
          <View className="relative m-2 overflow-hidden border-2 border-white rounded-xl">
            <Image
              source={{ uri: plant.image_url }}
              className="w-full h-64"
              resizeMode="cover"
            />
            <View
              className="absolute top-0 bottom-0 left-0 right-0"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            />
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

        {/* Nama dan tombol info */}
        <View className="px-8 pt-2 pb-6 bg-primary">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-poppinsBold text-secondary">
                {plant.name}
              </Text>
              <Text className="text-base text-white font-poppinsItalic">
                {plant.scientific_name}
              </Text>
            </View>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-secondary"
              onPress={() =>
                router.push("../../components/DetailPage/FullDetail")
              }
            >
              <Text className="text-base text-center font-poppinsSemiBold text-primary">
                Informasi{"\n"}Tumbuhan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview dan Ayat */}
        <ScrollView className="mx-4">
          <View className="p-5">
            <Text className="mb-2 text-2xl font-poppinsBold">Overview</Text>
            <Text className="text-gray-800 font-poppins">{plant.overview}</Text>
          </View>

          {plant.verses?.map((verse: any, index: number) => (
            <View className="px-4 mb-4" key={index}>
              <View
                className="p-4 border border-gray-200 rounded-xl"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                  backgroundColor: "white",
                }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-poppinsBold">
                    Surah {verse.surah} : {verse.verse_number}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleAudioPress(verse.audio_url, index)}
                  >
                    <Ionicons
                      name={
                        playingIndex === index
                          ? "stop-circle-outline"
                          : "play-circle-outline"
                      }
                      size={24}
                      color="#444"
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

export default Detail;
