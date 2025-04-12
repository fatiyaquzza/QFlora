import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, Image, View, TouchableOpacity } from "react-native";

const AppInfo = () => {
  const logo = require("../../../assets/images/info.png");
  const handleBack = () => {
    router.replace("../../main/Profile");
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "App Info",
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

      <View className="items-center justify-center flex-1 bg-white">
        <Image source={logo} className="" />

        <View className="absolute w-full bottom-12">
          <Text className="mt-1 text-lg text-center text-gray font-poppins">
            Version 1.0
          </Text>
          <Text className="text-base text-center text-gray font-poppins">
            Copyright &copy; 2025 QFlora. All rights reserved.
          </Text>
        </View>
      </View>
    </>
  );
};

export default AppInfo;
