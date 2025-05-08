import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

export interface Plant {
  id: string;
  name: string;
  image: ImageSourcePropType;
  liked: boolean;
  type: "specific" | "general";
  verses?: {
    surah: string;
    ayat: string;
  }[];
}

interface FavoriteCardProps {
  plants: Plant[];
  onToggleFavorite: (id: string, type: "specific" | "general") => void;
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
          key={`${plant.type}-${plant.id}`}
          className="w-11/12 mb-4 overflow-hidden rounded-lg shadow-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <TouchableOpacity
            className="flex-row flex-1"
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                plant.type === "specific"
                  ? `/components/DetailPage/Detail/${plant.id}`
                  : {
                      pathname: "/components/DetailPage/DetailUmum",
                      params: { id: plant.id },
                    }
              )
            }
          >
            <Image
              source={plant.image}
              className="w-full h-36"
              resizeMode="cover"
            />
          </TouchableOpacity>

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
                onPress={() => onToggleFavorite(plant.id, plant.type)}
              >
                <FontAwesome name="heart" size={26} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default FavoriteCard;
