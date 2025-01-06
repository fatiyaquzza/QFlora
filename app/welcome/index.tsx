import React from "react";
import { View, Text, Pressable } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center text-poppins">
      <View className="absolute bottom-28 p-4 items-center justify-center">
        <Text className="text-6xl py-3 leading-[45px] text-white font-poppinsSemiBold">
          Belajar Statistika Lebih Mudah Dengan RwikiStat
        </Text>
      </View>

      <View className="bottom-0 mb-20 absolute w-full px-6">
        <Pressable
          //   onPress={() => router.push("../auth")}
          className="bg-white rounded-lg py-3 px-6 w-full"
        >
          <Text className="text-[#00726B] font-poppinsSemiBold text-center text-xl">
            Belajar Sekarang
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
