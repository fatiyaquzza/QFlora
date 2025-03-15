import { Stack } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  Image,
  View,
  useColorScheme,
} from "react-native";

const appinfo= () => {
    const logo = require("../../../../assets/images/info.png");
  return (
    <>
<Stack.Screen
        options={{
          title: "Tentang QFlora",
          headerStyle: { backgroundColor: "#12321D" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 16 },
          headerBackTitle: "‎ ",
        }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-6 flex-1">
          <View className="flex justify-center items-center my-auto">
            <Image source={logo} className="" />
          </View>


          <View className="absolute bottom-2 w-full">
            <Text className="text-center text-lg text-gray-500 font-poppins mt-1 text-gray">
              Version 1.0
            </Text>
            <Text className="text-center text-base text-gray-600 font-poppins text-gray">
              Copyright &copy; 2025 QFlora. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default appinfo;
