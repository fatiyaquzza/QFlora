import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.36;
const cardMargin = 10;

// Define types
export interface Plant {
  id: string;
  name: string;
  image: any;
  liked: boolean;
}

interface PlantsCardProps {
  plants: Plant[];
  showFavoriteIcon?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const PlantsCard: React.FC<PlantsCardProps> = ({
  plants,
  showFavoriteIcon = false,
  onToggleFavorite,
}) => {
  return (
    <View className="mx-4 mt-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2 }}
        decelerationRate="fast"
        snapToInterval={cardWidth + cardMargin * 2}
        snapToAlignment="center"
      >
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            activeOpacity={0.9}
            className="pr-4 my-2"
            onPress={() =>
              router.push("../../components/DetailPage/Detail")
            }
          >
            <View
              style={{ width: cardWidth }}
              className="overflow-hidden bg-white shadow-lg rounded-xl"
            >
              <View className="relative">
                <Image
                  source={plant.image}
                  className="w-full h-44"
                  style={{ resizeMode: "cover" }}
                />

                {showFavoriteIcon && (
                  <TouchableOpacity
                    className="absolute z-10 top-2 left-2"
                    onPress={() =>
                      onToggleFavorite && onToggleFavorite(plant.id)
                    }
                  >
                    <View className="items-center justify-center w-8 h-8">
                      {plant.liked ? (
                        <View style={{ position: "relative" }}>
                          <FontAwesome name="heart" size={26} color="red" />

                          <View
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                          >
                            <FontAwesome
                              name="heart-o"
                              size={26}
                              color="white"
                            />
                          </View>
                        </View>
                      ) : (
                        <FontAwesome
                          name="heart-o"
                          size={22}
                          color="#FFFFFF"
                          style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                            elevation: 3,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}

                <View className="absolute inset-0 flex items-center justify-end bg-black/40 rounded-xl">
                  <Text className="mb-2 text-xl text-white font-poppinsSemiBold">
                    {plant.name}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PlantsCard;
