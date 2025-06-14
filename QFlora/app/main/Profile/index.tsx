import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../../context/authContext";
import SearchPage from "../../components/DetailPage/Saran"

const Profile = () => {
  const profile = require("../../../assets/images/logo.png");
  const { user, logout, loading } = useAuth();
  // console.log("👤 Data user di Profile:", user);

  return (
    <>
      <StatusBar style="light"></StatusBar>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="items-center py-16 bg-primary rounded-b-3xl">
          <Image
            source={profile}
            className="w-32 h-32 mt-16 bg-white border-2 border-white rounded-md"
          />
          <Text className="mt-6 text-2xl text-white font-poppinsSemiBold">
            {user?.name}
          </Text>
          <Text className="mt-1 text-base text-softgray font-poppinsItalic">
            {user?.email}
          </Text>
        </View>

        <ScrollView>
          {/* Menu */}
          <View className="p-4 mx-6 mt-8 bg-white rounded-md shadow-lg">
            <TouchableOpacity
              className="flex-row items-center justify-between py-5 border-b border-gray"
              onPress={() => router.push("../../components/DetailPage/About")}
            >
              <View className="flex-row items-center">
                <View className="items-center justify-center w-10 h-10 rounded-md bg-primary ">
                  <MaterialIcons name={"info"} size={24} color="white" />
                </View>
                <Text className="pl-4 text-lg text-black font-poppins">
                  About
                </Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between py-5 border-b border-gray"
              onPress={() => router.push("../../components/DetailPage/AppInfo")}
            >
              <View className="flex-row items-center">
                <View className="items-center justify-center w-10 h-10 rounded-md bg-primary ">
                  <MaterialIcons name={"android"} size={24} color="white" />
                </View>
                <Text className="pl-4 text-lg text-black font-poppins">
                  Apps Info
                </Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between py-5"
              onPress={() => router.push("../../components/DetailPage/Saran")}
            >
              <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 rounded-md bg-primary ">
                  <MaterialIcons name={"create"} size={24} color="white" />
                </View>
                <Text className="pl-4 text-lg text-black font-poppins">
                  Saran
                </Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Tombol Logout */}
          <View className="mx-6 mt-6">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 rounded-md shadow-md bg-red"
              onPress={logout}
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