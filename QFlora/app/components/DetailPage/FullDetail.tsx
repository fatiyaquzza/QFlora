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

interface TaxonomyData {
  subkingdoms: Array<{ id: number; name: string }>;
  superdivisions: Array<{ id: number; name: string; subkingdom_id: number }>;
  divisions: Array<{ id: number; name: string; superdivision_id: number }>;
  classes: Array<{ id: number; name: string; division_id: number }>;
  subclasses: Array<{ id: number; name: string; class_id: number }>;
  orders: Array<{ id: number; name: string; subclass_id: number }>;
  families: Array<{ id: number; name: string; order_id: number }>;
  genuses: Array<{ id: number; name: string; family_id: number }>;
  species: Array<{ id: number; name: string; genus_id: number }>;
}

interface TaxonomyMap {
  [species_id: number]: {
    kingdom: string;
    subkingdom: string;
    superdivision: string;
    division: string;
    class: string;
    subclass: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
}

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
    varietas: false,
  });
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<SpecificPlant | null>(null);
  const [loading, setLoading] = useState(true);
  const [taxonomyMap, setTaxonomyMap] = useState<TaxonomyMap>({});

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
    setIsFavorite((prev) => !prev);
  };

  const parseChemicalComp = (text: string) => {
    return text
      .split("-")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const parseSourceRef = (text: string): string[] => {
    return text
      .split("#*")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
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

  const getVarieties = (): string[] => {
    if (!plant?.varieties) return [];

    if (Array.isArray(plant.varieties)) return plant.varieties;

    if (typeof plant.varieties === "string") {
      try {
        const parsed = JSON.parse(plant.varieties);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    return [];
  };

  useEffect(() => {
    const fetchTaxonomyData = async () => {
      try {
        const response = await axiosClient.get("/api/taxonomy/full");
        const data: TaxonomyData = response.data;
        const map: TaxonomyMap = {};

        data.species.forEach((species) => {
          const genus = data.genuses.find((g) => g.id === species.genus_id);
          if (!genus) return;

          const family = data.families.find((f) => f.id === genus.family_id);
          if (!family) return;

          const order = data.orders.find((o) => o.id === family.order_id);
          if (!order) return;

          const subclass = data.subclasses.find(
            (sc) => sc.id === order.subclass_id
          );
          if (!subclass) return;

          const classData = data.classes.find(
            (c) => c.id === subclass.class_id
          );
          if (!classData) return;

          const division = data.divisions.find(
            (d) => d.id === classData.division_id
          );
          if (!division) return;

          const superdivision = data.superdivisions.find(
            (sd) => sd.id === division.superdivision_id
          );
          if (!superdivision) return;

          const subkingdom = data.subkingdoms.find(
            (sk) => sk.id === superdivision.subkingdom_id
          );
          if (!subkingdom) return;

          map[species.id] = {
            kingdom: "Plantae",
            subkingdom: subkingdom.name,
            superdivision: superdivision.name,
            division: division.name,
            class: classData.name,
            subclass: subclass.name,
            order: order.name,
            family: family.name,
            genus: genus.name,
            species: species.name,
          };
        });

        setTaxonomyMap(map);
      } catch (err) {
        console.error("❌ Gagal fetch taxonomy data:", err);
      }
    };

    fetchTaxonomyData();
  }, []);

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
      <ScrollView className="flex-1 bg-white">
        <View className="mx-8 mt-8 mb-2 overflow-hidden rounded-xl">
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

        <View className="items-center -mt-12 mb-10">
          <View className="px-6 py-5 min-w-80 bg-primary rounded-xl shadow-md items-center">
            <Text className="text-2xl text-center text-white font-poppinsBold">
              {plant?.name}
            </Text>
            <Text className="text-center text-white font-poppinsItalic">
              {plant?.latin_name}
            </Text>
          </View>
        </View>

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
            <View className="flex-row flex-wrap justify-between px-4 pb-4">
              <Text className="font-poppins text-justify mb-3">
                {plant?.description}
              </Text>
              <View className="w-[48%] bg-softgreen rounded-lg p-3 mb-2">
                <Text className="text-center font-poppinsSemiBold">
                  Bahasa Arab
                </Text>
                <Text className="text-center font-poppins text-2xl">
                  {plant?.arab_name}
                </Text>
              </View>
              <View className="w-[48%] bg-softgreen rounded-lg p-3 mb-2">
                <Text className="text-center font-poppinsSemiBold">
                  Bahasa Inggris
                </Text>
                <Text className="text-center text-md font-poppins">
                  {plant?.eng_name}
                </Text>
              </View>
            </View>
          )}
        </View>

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
              {plant?.chemical_components &&
              plant.chemical_components.length > 0 ? (
                <View className="flex flex-wrap flex-row gap-2">
                  {plant.chemical_components.map((comp, index) => (
                    <View
                      key={comp.id}
                      className={`px-4 py-4 min-w-44 rounded-lg ${
                        index % 2 === 0
                          ? "bg-[#004E1D]"
                          : "bg-white border border-[#004E1D]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-poppinsSemiBold text-center ${
                          index % 2 === 0 ? "text-white" : "text-[#004E1D]"
                        }`}
                      >
                        {comp.name}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-700 font-poppins">
                  Tidak tersedia
                </Text>
              )}
            </View>
          )}
        </View>

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
          {sections.klasifikasi &&
            plant?.species_id &&
            taxonomyMap[plant.species_id] && (
              <View className="px-4 pb-4">
                <View className="border border-primary">
                  {[
                    "kingdom",
                    "subkingdom",
                    "superdivision",
                    "division",
                    "class",
                    "subclass",
                    "order",
                    "family",
                    "genus",
                    "species",
                  ].map((key) => {
                    const value =
                      taxonomyMap[plant.species_id][
                        key as keyof (typeof taxonomyMap)[number]
                      ];
                    if (!value) return null;

                    return (
                      <View
                        key={key}
                        className="flex-row border border-primary"
                      >
                        <Text className="w-1/3 p-2 text-sm text-white font-poppinsSemiBold bg-primary">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        <Text className="w-2/3 p-2 text-sm text-black bg-white font-poppins">
                          {value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
        </View>

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
                <Text className="text-sm text-black font-poppins text-justify">
                  {plant?.benefits}
                </Text>
              </View>
            </ImageBackground>
          )}
        </View>
        <View className="mx-4 mb-3 bg-white rounded-xl shadow-md overflow-hidden">
          <TouchableOpacity
            onPress={() => toggleSection("varietas")}
            className="flex-row items-center justify-between px-4 py-4"
          >
            <Text className="text-lg text-green-900 font-poppinsSemiBold">
              Varietas
            </Text>
            <Ionicons
              name={sections.asalUsul ? "chevron-up" : "chevron-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {sections.varietas && (
            <View className="px-4 pb-4 bg-white">
              {getVarieties().length > 0 ? (
                <View className="space-y-2">
                  {getVarieties().map((variety, index) => (
                    <View
                      key={index}
                      className="px-4 py-2 bg-softgreen border border-softgreen mb-4 rounded-lg"
                    >
                      <Text className="text-green-900 font-poppinsSemiBold ">
                        • {variety}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-700 font-poppins italic">
                  Tidak ada varietas yang tersedia.
                </Text>
              )}
            </View>
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
                {plant?.source_ref ? (
                  parseSourceRef(plant.source_ref).map((item, idx) => (
                    <View key={idx} className="flex-row items-start mb-1">
                      <Text className="text-white font-poppins mr-2">•</Text>
                      <Text className="text-white font-poppins flex-1 text-justify text-sm">
                        {item}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-white font-poppins">
                    Tidak tersedia
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default FullDetail;
