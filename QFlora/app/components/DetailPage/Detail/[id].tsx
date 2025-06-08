import React, { useEffect, useState, useRef } from "react";
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
import { Audio } from "expo-av";

const Detail = () => {
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<SpecificPlant | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

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

  useEffect(() => {
    if (plant) {
      setIsFavorite(favorites.includes(plant.id));
    }
  }, [favorites, plant]);

  const toggle = async () => {
    if (!plant) return;
    await toggleFavorite(plant.id);
    setIsFavorite((prev) => !prev);
  };

  const handleBack = () => {
    router.replace("../../../main/Search");
  };

  const handleAudioPress = async (audioUrl: string, index: number) => {
    try {
      if (playingIndex === index) {
        await soundRef.current?.stopAsync();
        await soundRef.current?.unloadAsync();
        soundRef.current = null;
        setPlayingIndex(null);
        return;
      }

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

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

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
              <Text className="text-sm text-center font-poppinsSemiBold text-primary">
                Informasi{"\n"}Tumbuhan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="mx-4">
          <View className="p-5">
            <Text className="mb-2 text-2xl font-poppinsBold">Overview</Text>
            <Text className="text-gray-800 font-poppins text-justify">
              {plant.overview}
            </Text>
          </View>

          {plant.varieties && plant.varieties.length > 0 && (
            <View className="p-5">
              <Text className="mb-2 text-2xl font-poppinsBold">Varietas</Text>
              {plant.varieties.map((variety, index) => (
                <View key={index} className="mb-2 p-3 bg-gray-100 rounded-lg">
                  <Text className="text-gray-800 font-poppins">{variety}</Text>
                </View>
              ))}
            </View>
          )}

          {(plant.verses || []).map((verse, index) => (
            <View className="px-4 mb-4" key={index}>
              <View className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-poppinsBold capitalize">
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
                  {verse.keyword_arab
                    ? verse.quran_verse
                        .split(verse.keyword_arab)
                        .map((part: string, i: number, arr: string[]) => (
                          <React.Fragment key={i}>
                            <Text>{part}</Text>
                            {i !== arr.length - 1 && (
                              <Text className="bg-highlight text-black font-poppinsSemiBold">
                                {verse.keyword_arab}
                              </Text>
                            )}
                          </React.Fragment>
                        ))
                    : verse.quran_verse}
                </Text>
                <Text className="text-gray-700 font-poppins text-justify">
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
