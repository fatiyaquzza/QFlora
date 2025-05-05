import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import UmumCard, {
  SearchPlant,
} from "../../components/Card/UmumCard";

const Suggestion = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");

  const [plants, setPlants] = useState<SearchPlant[]>([
    {
      id: "1",
      name: "Anggur",
      image: require("../../../assets/images/tumbuhan/anggur.jpg"),
      liked: false,
      verses: [{ surah: "Al-Baqarah", ayat: "26" }],
    },
    {
      id: "2",
      name: "Kurma",
      image: require("../../../assets/images/tumbuhan/kurma.jpg"),
      liked: true,
      verses: [{ surah: "Al-Baqarah", ayat: "266" }],
    },
    {
      id: "3",
      name: "Bayam",
      image: require("../../../assets/images/tumbuhan/delima.jpg"),
      liked: false,
      verses: [{ surah: "An-Nahl", ayat: "11" }],
    },
    {
      id: "4",
      name: "Mawar",
      image: require("../../../assets/images/tumbuhan/semangka.jpg"),
      liked: true,
      verses: [{ surah: "Ar-Rahman", ayat: "48" }],
    },
  ]);

  const handleToggleFavorite = (id: string) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, liked: !plant.liked } : plant
      )
    );
  };

  const umumPlants = plants.forEach;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-end px-4 pb-4 border-b border-gray">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <Text className="text-xl font-poppinsSemiBold text-primary">
          Kategori Umum
        </Text>
      </View>

      <View className="flex-1">

        {/* Plants List */}
        <ScrollView
          className="px-4 mt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <UmumCard
            onToggleFavorite={handleToggleFavorite} plants={plants}          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Suggestion;
