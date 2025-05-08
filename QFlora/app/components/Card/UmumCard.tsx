import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export interface SearchPlant {
  id: string;
  name: string;
  image: ImageSourcePropType;
  liked: boolean;
  verses?: {
    surah: string;
    ayat: string;
  }[];
}

interface UmumCardProps {
  plants: SearchPlant[];
  onToggleFavorite: (id: string) => void;
}

const UmumCard: React.FC<UmumCardProps> = ({ plants, onToggleFavorite }) => {
  const router = useRouter();

  return (
    <View className="items-center">
      {plants.map((plant, index) => {
        const isEven = index % 2 === 0;
        const cardBgClass = isEven ? "bg-white" : "bg-[#114B2C]";
        const textColor = isEven ? "text-[#114B2C]" : "text-[#BECC85]";
        const subTextColor = isEven ? "text-gray-600" : "text-white";

        return (
          <View
            key={plant.id}
            className={`w-11/12 mb-4 flex-row rounded-xl border border-primary ${cardBgClass}`}
          >
            {/* Bagian Konten yang bisa ditekan */}
            <TouchableOpacity
              className="flex-row flex-1"
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/components/DetailPage/DetailUmum",
                  params: { id: plant.id },
                })
              }
            >
              <Image
                source={
                  typeof plant.image === "string"
                    ? { uri: plant.image }
                    : plant.image
                }
                className="w-24 h-24 rounded-l-xl border-r-[1px] border-primary"
                resizeMode="cover"
              />

              <View className="justify-center flex-1 px-4">
                <Text
                  className={`text-lg font-poppinsSemiBold text-center ${textColor}`}
                >
                  {plant.name}
                </Text>
                <Text
                  className={`text-sm font-poppins text-center ${subTextColor}`}
                >
                  Lihat selengkapnya
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tombol Favorite */}
            <TouchableOpacity
              className="justify-center pr-4"
              onPress={() => onToggleFavorite(plant.id)}
            >
              <View style={{ position: "relative", width: 26, height: 26 }}>
                {plant.liked !== undefined && (
                  <TouchableOpacity
                    className="justify-center pr-4"
                    onPress={() => onToggleFavorite(plant.id)}
                  >
                    <View
                      style={{ position: "relative", width: 26, height: 26 }}
                    >
                      {plant.liked && (
                        <FontAwesome
                          name="heart"
                          size={22}
                          color="red"
                          style={{ position: "absolute", top: 0, left: 0 }}
                        />
                      )}
                      <FontAwesome
                        name="heart-o"
                        size={22}
                        color={isEven ? "black" : "white"}
                        style={{ position: "absolute", top: 0, left: 0 }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <FontAwesome
                  name="heart-o"
                  size={22}
                  color={isEven ? "black" : "white"}
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default UmumCard;
