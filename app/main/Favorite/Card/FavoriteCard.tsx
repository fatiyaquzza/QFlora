import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export interface Plant {
  id: string;
  name: string;
  image: ImageSourcePropType;
  liked: boolean;
  verses?: {
    surah: string;
    ayat: string;
  }[];
}

interface FavoriteCardProps {
  plants: Plant[];
  onToggleFavorite: (id: string) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  plants,
  onToggleFavorite,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const combineVerses = (verses: { surah: string; ayat: string }[]) => {
    const versesText = verses
      .map((verse) => `QS ${verse.surah}: ${verse.ayat}`)
      .join("; ");
    return truncateText(versesText, 30);
  };

  return (
    <View className="items-center">
      {plants.map((plant) => (
        <View
          key={plant.id}
          className="w-11/12 mb-4 overflow-hidden rounded-lg shadow-md"
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
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="p-3 bg-primary">
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default FavoriteCard;
