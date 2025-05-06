import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, Stack } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const Detail = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample data for verses (to make it dynamic)
  const verses = [
    {
      surah: "Al-Insan",
      number: "76",
      arabicText: "وَيُسْقَوْنَ فِيهَا كَأْسًا كَانَ مِزَاجُهَا زَنْجَبِيلًا",
      translation: "Dan di sana mereka diberi segelas minuman bercampur jahe.",
    },
    {
      surah: "Al-Insan",
      number: "76",
      arabicText: "عَيْنًا فِيهَا تُسَمَّىٰ سَلْسَبِيلًا",
      translation: "Dan di sana mereka diberi segelas minuman bercampur jahe.",
    },
    {
      surah: "Al-Insan",
      number: "76",
      arabicText: "عَيْنًا فِيهَا تُسَمَّىٰ سَلْسَبِيلًا",
      translation: "Dan di sana mereka diberi segelas minuman bercampur jahe.",
    },
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBack = () => {
    router.back();
  };

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
        {/* Plant Image with Heart Icon */}
        <View className="p-6 pt-8 bg-primary">
          <View className="relative m-2 overflow-hidden border-2 border-white rounded-xl">
            <Image
              source={require("../../../assets/images/tumbuhan/kurma.jpg")}
              className="w-full h-64"
              resizeMode="cover"
            />
            {/* Dark overlay to make icons more visible */}
            <View
              className="absolute top-0 bottom-0 left-0 right-0"
              style={{
                height: 360,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            />
            <TouchableOpacity
              className="absolute m-2 bottom-2 right-2"
              onPress={toggleFavorite}
            >
              <View style={{ position: "relative" }}>
                {isFavorite ? (
                  <View style={{ position: "relative" }}>
                    <FontAwesome name="heart" size={26} color="red" />

                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      <FontAwesome name="heart-o" size={26} color="white" />
                    </View>
                  </View>
                ) : (
                  <View>
                    <FontAwesome name="heart" size={26} color="transparent" />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      <FontAwesome name="heart-o" size={26} color="white" />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plant Name and Info Button */}
        <View className="px-8 pt-2 pb-6 bg-primary">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-poppinsBold text-secondary">
                Jahe
              </Text>
              <Text className="text-base text-white font-poppinsItalic">
                Zingiber officinale Roscoe
              </Text>
            </View>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-secondary"
              style={{ alignSelf: "center", marginLeft: 10 }}
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

        {/* Overview Section */}
        <ScrollView className="mx-4">
          <View className="p-5">
            <Text className="mb-2 text-2xl font-poppinsBold">Overview</Text>
            <Text className="text-gray-800 font-poppins">
              Disebutkan dalam Al-Qur'an pada Surah Al-Insan 76 dan ayat 17.
            </Text>
          </View>

          {/* Dynamic Quran Verse Cards */}
          {verses.map((verse, index) => (
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
                {/* Surah and Controls */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-poppinsBold">
                    Surah {verse.surah} : {verse.number}
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity className="mr-4">
                      <Ionicons
                        name="share-social-outline"
                        size={20}
                        color="#333"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons
                        name="play-circle-outline"
                        size={20}
                        color="#333"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Arabic Text */}
                <Text className="mb-3 text-2xl leading-10 text-right font-poppins">
                  {verse.arabicText}
                </Text>

                {/* Translation */}
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
