import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export enum PlantCategory {
  Buah = "Buah-Buahan",
  Sayur = "Sayur-Sayuran",
  Bunga = "Bunga",
}

export interface SearchPlant {
  id: string;
  name: string;
  image: ImageSourcePropType;
  liked: boolean;
  category: PlantCategory;
  verses?: {
    surah: string;
    ayat: string;
  }[];
}

interface SearchCardProps {
  plants: SearchPlant[];
  onToggleFavorite: (id: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({
  plants,
  onToggleFavorite,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

  const combineVerses = (verses: { surah: string; ayat: string }[]) => {
    return truncateText(
      verses.map((verse) => `QS ${verse.surah}: ${verse.ayat}`).join("; "),
      30
    );
  };

  return (
    <View className="items-center">
      {plants.map((plant) => (
        <View
          key={plant.id}
          className="w-11/12 mb-4 overflow-hidden rounded-lg shadow-md bg-primary"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Image
            source={plant.image}
            className="w-full h-36"
            resizeMode="cover"
          />
          <View className="p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <Text className="mx-2 mt-1 text-2xl text-white font-poppinsSemiBold">
                  {plant.name}
                </Text>
                {plant.verses && (
                  <Text className="mx-2 mb-1 text-base text-white font-poppins">
                    {combineVerses(plant.verses)}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className="m-2"
                onPress={() => onToggleFavorite(plant.id)}
              >
                <FontAwesome
                  name={plant.liked ? "heart" : "heart-o"}
                  size={26}
                  color={plant.liked ? "red" : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SearchCard;
