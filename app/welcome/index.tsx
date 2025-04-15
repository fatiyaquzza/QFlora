import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#BECC85", "#98B46D", "#0B2D12"]}
      locations={[0, 0.25, 0.7]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      {/* Kontainer Utama */}
      <View className="items-center flex-1 px-6 mt-20">
        {/* Header */}
        <Text className="text-2xl text-[#B76732] font-poppinsSemiBold">
          QFlora
        </Text>

        <View className="flex items-center justify-center ">
          {/* Judul */}
          <Text className="mt-20 text-4xl text-center text-[#0B2D12] font-poppinsSemiBold">
            Siap {"\n"} untuk Menelusuri?
          </Text>

          {/* Gambar */}
          <Image
            source={require("../../assets/images/Alquran.png")}
            className="w-96 h-96"
            resizeMode="contain"
          />

          {/* Subtitle */}
          <Text className="text-xl text-center text-white font-poppins">
            Temukan informasi mendalam mengenai tumbuhan yang disebutkan dalam
            Al-Quran
          </Text>
        </View>

        {/* Tombol */}
        <Pressable
          onPress={async () => {
            const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            if (isLoggedIn === "true") {
              router.replace("/main/Home");
            } else {
              router.replace("/auth");
            }
          }}
          className="absolute bottom-0 w-full px-6 py-4 mb-20 bg-[#BECC85] rounded-lg"
        >
          <Text className="text-[#0B2D12] font-poppinsSemiBold text-center text-lg">
            Telusuri Sekarang
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}