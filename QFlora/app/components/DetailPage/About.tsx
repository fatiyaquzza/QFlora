import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, Image, View, TouchableOpacity } from "react-native";

const About = () => {
  const profile = require("../../../assets/images/icon.png");
  const handleBack = () => {
    router.replace("../../main/Profile");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Tentang QFlora",
          headerTintColor: "#333",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 16 },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} className="mr-8">
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 mx-6">
          <View className="flex items-center justify-center">
            <Image source={profile} className="mt-10" />
          </View>

          <Text className="mt-10 text-lg text-justify font-poppins">
            Aplikasi QFlora merupakan aplikasi yang dirancang untuk membantu
            pengguna memahami berbagai tumbuhan yang disebutkan dalam Al-Quran,
            lengkap dengan deskripsi, manfaat, karakteristik, kandungan, serta
            manfaatnya. Menggunakan teknologi React Native dan Expo, aplikasi
            ini menghadirkan pengalaman pencarian yang cepat dan intuitif dengan
            Fuse.js untuk fitur pencarian cerdas.
          </Text>

          <View className="absolute w-full bottom-12">
            <Text className="mt-1 text-lg text-center text-gray-500 font-poppins text-gray">
              Version 1.0
            </Text>
            <Text className="text-base text-center text-gray-600 font-poppins text-gray">
              Copyright &copy; 2025 QFlora. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default About;
