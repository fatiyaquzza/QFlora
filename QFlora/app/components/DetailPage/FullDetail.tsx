import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axiosClient from "../../../api/axioxClient";
import { SpecificPlant } from "../type";
import { useFavorite } from "../../../context/FavoriteContext";

const FullDetail = () => {
  const { favorites, toggleFavorite } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);
  const [sections, setSections] = useState({
    deskripsi: false,
    klasifikasi: false,
    manfaat: false,
    karakteristik: false,
    asalUsul: false,
    komposisiKimia: false,
    prosesBudidaya: false,
    sumber: false,
  });
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<SpecificPlant | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleSection = (section: string) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section as keyof typeof prevSections],
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = async () => {
    if (!plant) return;
    await toggleFavorite(plant.id);
    setIsFavorite((prev) => !prev); // opsional (ubah icon langsung)
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosClient.get(`/specific-plants/${id}`);
        setPlant(response.data);
      } catch (err) {
        console.error("❌ Gagal fetch detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (plant) {
      setIsFavorite(favorites.includes(plant.id));
    }
  }, [favorites, plant]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Detail Tumbuhan",
          headerTintColor: "#333",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 16 },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} className="mr-8">
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-softgrey">
        <View className="mx-8 my-8 overflow-hidden rounded-xl">
          <Image
            source={{ uri: plant?.image_url }}
            className="w-full h-80"
            style={{ resizeMode: "cover" }}
          />
          <View className="absolute inset-0 bg-black/50">
            <TouchableOpacity
              className="absolute p-2 top-4 left-4"
              onPress={handleToggleFavorite}
            >
              <View style={{ position: "relative" }}>
                {isFavorite ? (
                  <FontAwesome name="heart" size={26} color="red" />
                ) : (
                  <FontAwesome name="heart-o" size={26} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center justify-center mb-4">
          <View className="px-10 py-5 overflow-hidden rounded-t-lg bg-primary rounded-xl">
            <Text className="text-2xl text-center text-white font-poppinsBold">
              {plant?.name}
            </Text>
            <Text className="text-center text-white font-poppinsItalic">
              {plant?.latin_name}
            </Text>
          </View>
        </View>

        <ScrollView className="mx-4">
          {/* Deskripsi */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("deskripsi")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Deskripsi
              </Text>
              <Ionicons
                name={sections.deskripsi ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.deskripsi && (
              <View className="px-4 pb-4">
                <Text
                  className="text-gray-700 font-poppins"
                  style={{ textAlign: "justify" }}
                >
                  {plant?.description}
                </Text>
              </View>
            )}
          </View>

          {/* Klasifikasi */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("klasifikasi")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Klasifikasi
              </Text>
              <Ionicons
                name={sections.klasifikasi ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.klasifikasi && !!plant?.classifications?.length && (
              <View className="px-4 pb-4">
                <View className="border border-primary">
                  {Object.entries(plant.classifications[0]).map(
                    ([key, value]) => {
                      if (
                        [
                          "id",
                          "specific_plant_id",
                          "createdAt",
                          "updatedAt",
                        ].includes(key)
                      )
                        return null;
                      return (
                        <View
                          key={key}
                          className="flex-row border border-primary"
                        >
                          <Text className="w-1/3 p-2 text-sm text-white font-poppinsSemiBold bg-primary">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Text>
                          <Text className="w-2/3 p-2 text-sm text-black bg-white font-poppins">
                            {typeof value === "string" ||
                            typeof value === "number"
                              ? value
                              : "-"}
                          </Text>
                        </View>
                      );
                    }
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Manfaat */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("manfaat")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Manfaat
              </Text>
              <Ionicons
                name={sections.manfaat ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.manfaat && (
              <ImageBackground
                source={require("../../../assets/images/bg-manfaat.png")}
                className="mx-4 mb-4 overflow-hidden border rounded-lg "
                resizeMode="cover"
              >
                <View className="p-6">
                  <Text className="text-sm text-center text-black font-poppins">
                    {plant?.benefits}
                  </Text>
                </View>
              </ImageBackground>
            )}
          </View>
          {/* Asal Usul */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("asalUsul")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Asal Usul
              </Text>
              <Ionicons
                name={sections.asalUsul ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.asalUsul && (
              <View className="px-4 pb-4">
                <Text
                  className="text-gray-700 font-poppins"
                  style={{ textAlign: "justify" }}
                >
                  {plant?.origin}
                </Text>
              </View>
            )}
          </View>

          {/* Komposisi Kimia */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("komposisiKimia")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Komposisi Kimia
              </Text>
              <Ionicons
                name={sections.komposisiKimia ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.komposisiKimia && (
              <View className="px-4 pb-4">
                <Text
                  className="text-gray-700 font-poppins"
                  style={{ textAlign: "justify" }}
                >
                  {plant?.chemical_comp || "Tidak tersedia"}
                </Text>
              </View>
            )}
          </View>

          {/* Proses Budidaya */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("prosesBudidaya")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Proses Budidaya
              </Text>
              <Ionicons
                name={sections.prosesBudidaya ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.prosesBudidaya && (
              <View className="px-4 pb-4 ">
                <Text
                  className="text-gray-700 font-poppins"
                  style={{ textAlign: "justify" }}
                >
                  {plant?.cultivation}
                </Text>
              </View>
            )}
          </View>

          {/* Sumber */}
          <View className="mx-4 mb-8 overflow-hidden shadow-md rounded-xl bg-primary">
            <TouchableOpacity
              onPress={() => toggleSection("sumber")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-base text-white font-poppinsSemiBold">
                Sumber
              </Text>
              <Ionicons
                name={sections.sumber ? "chevron-up" : "chevron-down"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            {sections.sumber && (
              <View className="px-4 pb-4">
                <Text
                  className="text-white font-poppins"
                  style={{ textAlign: "justify" }}
                >
                  {plant?.source_ref}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default FullDetail;
