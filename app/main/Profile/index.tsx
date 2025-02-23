import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

const Profile = () => {
  const profile = require("../../../assets/images/profile.jpg");
  const [user, setUser] = useState({
    displayName: "Fatiya Quzza",
    email: "fatiyaquzzaaa@gmail.com",
    photoURL: "../../../assets/images/splash.png",
  });

  return (
    <>
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="bg-[#12321D] py-12 items-center rounded-b-3xl">
          <Image
            source={profile}
            className="mt-20 border-2 border-white rounded-md w-28 h-28"
          />
          <Text className="mt-6 text-2xl text-white font-poppinsSemiBold">
            {user.displayName}
          </Text>
          <Text className="mt-1 text-base text-softgray font-poppinsItalic">
            {user.email}
          </Text>
        </View>

        <ScrollView>
          {/* Menu */}
          <View className="p-4 mx-6 mt-6 bg-white rounded-md shadow-md">
            {[
              {
                name: "Personal Data",
                icon: "person",
                route: "./Profile/personal-data",
              },
              {
                name: "Apps Info",
                icon: "android",
                route: "./Profile/apps-info",
              },
              {
                name: "About",
                icon: "info",
                route: "./Profile/about",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center justify-between py-5 ${
                  index < 2 ? "border-b border-gray-300" : ""
                }`}
                // onPress={() => router.push(item.route)}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-[#12321D] rounded-md items-center justify-center">
                    <MaterialIcons
                      name={item.icon as any}
                      size={24}
                      color="white"
                    />
                  </View>
                  <Text className="pl-4 text-lg text-black font-poppins">
                    {item.name}
                  </Text>
                </View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tombol Logout */}
          <View className="mx-6 mt-6">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 shadow-md bg-[#12321D] rounded-md"
              onPress={() => router.push("../auth")} // Tambahkan fungsi logout
            >
              <MaterialIcons name="logout" size={24} color="white" />
              <Text className="ml-2 text-lg text-white font-poppinsSemiBold">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Profile;
