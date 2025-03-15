import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, Stack } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const FullDetail = () => {
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

  const toggleSection = (section: string) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section as keyof typeof prevSections],
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const nutrients = [
    { label: "Karbohidrat", value: "1,07gr", filled: true },
    { label: "Serat", value: "0,12gr", filled: false },
    { label: "Protein", value: "0,11gr", filled: true },
    { label: "Lemak", value: "0,005gr", filled: false },
    { label: "Gula", value: "01gr", filled: false },
    { label: "Riboflavin", value: null, filled: false },
    { label: "Vitamin C", value: null, filled: true },
    { label: "Magnesium", value: null, filled: false },
    { label: "Zingiberol", value: null, filled: false },
    { label: "Kalium", value: null, filled: false },
  ];

  const firstRow = nutrients.slice(0, 5);
  const secondRow = nutrients.slice(5, 10);

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
        {/* Image section with overlay and heart icon */}
        <View className="">
          <View className="mx-8 my-8 overflow-hidden rounded-xl">
            <Image
              source={require("../../assets/images/tumbuhan/kurma.jpg")}
              className="w-full h-80"
              style={{ resizeMode: "cover" }}
            />
            <View className="absolute inset-0 bg-black/50">
              <TouchableOpacity
                className="absolute p-2 top-4 left-4"
                onPress={toggleFavorite}
              >
                <View style={{ position: "relative" }}>
                  {isFavorite ? (
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
                  ) : (
                    <View>
                      <FontAwesome name="heart" size={26} color="transparent" />
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
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="absolute left-0 right-0 items-center justify-center -bottom-4">
            <View className="px-10 py-5 overflow-hidden rounded-t-lg bg-primary rounded-xl">
              <Text className="text-2xl text-center text-white font-poppinsBold">
                Jahe
              </Text>
              <Text className="text-center text-white font-poppinsItalic">
                Zingiber officinale Roscoe
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full mt-10 mb-6 border border-gray"></View>

        {/* Content sections */}
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
                  Disebutkan dalam Al-Qur'an pada Surah Al-Insan 76 dan Surah
                  Al-Insan: 17.
                </Text>
                <View className="flex-row flex-wrap justify-between mt-3">
                  <View className="w-[48%] bg-softgreen rounded-lg p-3 mb-2">
                    <Text className="text-center font-poppinsSemiBold">
                      Bahasa Arab
                    </Text>
                    <Text className="text-center font-poppinsItalic">
                      Al-Zanjabeel
                    </Text>
                  </View>
                  <View className="w-[48%] bg-softgreen rounded-lg p-3 mb-2">
                    <Text className="text-center font-poppinsSemiBold">
                      Bahasa Inggris
                    </Text>
                    <Text className="text-center font-poppinsItalic">
                      Ginger
                    </Text>
                  </View>
                </View>
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
            {sections.klasifikasi && (
              <View className="px-4 pb-4">
                <View className="border border-primary">
                  {[
                    { label: "Kingdom", value: "Plantae" },
                    { label: "Subkingdom", value: "Tracheobionta" },
                    { label: "Superdivision", value: "Spermatophyta" },
                    { label: "Division", value: "Magnoliophyta" },
                    { label: "Class", value: "Liliopsida" },
                    { label: "Subclass", value: "Zingiberidae" },
                    { label: "Order", value: "Zingiberales" },
                    { label: "Family", value: "Zingiberaceae Martinov" },
                    { label: "Genus", value: "Zingiber Mill" },
                    { label: "Species", value: "Zingiber officinale Roscoe" },
                  ].map((item, index) => (
                    <View
                      key={index}
                      className="flex-row border border-primary"
                    >
                      <Text className="w-1/3 p-2 text-sm text-white font-poppinsSemiBold bg-primary">
                        {item.label}
                      </Text>
                      <Text className="w-2/3 p-2 text-sm text-black bg-white font-poppins">
                        {item.value}
                      </Text>
                    </View>
                  ))}
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
                source={require("../../assets/images/bg-manfaat.png")}
                className="mx-4 mb-4 overflow-hidden border rounded-lg "
                resizeMode="cover"
              >
                <View className="p-6">
                  <Text className="text-sm text-center text-black font-poppins">
                    Mengurangi peradangan, Meningkatkan sistem imun, Membantu
                    menurunkan berat badan, Meredakan mual, Mengurangi rasa
                    sakit, dan Mendetoksifikasi tubuh dari racun
                  </Text>
                </View>
              </ImageBackground>
            )}
          </View>

          {/* Karakteristik */}
          <View className="mx-4 mb-3 overflow-hidden bg-white shadow-md rounded-xl">
            <TouchableOpacity
              onPress={() => toggleSection("karakteristik")}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-lg text-green-900 font-poppinsSemiBold">
                Karakteristik
              </Text>
              <Ionicons
                name={sections.karakteristik ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {sections.karakteristik && (
              <View className="mx-4 mb-4 overflow-hidden border rounded-lg border-primary">
                <Text className="p-6 text-sm text-center text-gray-700 font-poppins">
                  🌱 Batang semu, tinggi 30-100 cm
                </Text>
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
                  Tanaman jahe berasal dari Cina dan India, dua negara yang
                  telah lama menggunakan jahe sebagai obat. Jahe kemudian
                  diperkenalkan ke bangsa Romawi dan Yunani melalui pedagang
                  Arab yang membawanya dari India. Sementara itu, jahe pertama
                  kali diperkenalkan di Jamaika sekitar tahun 1952, dan kemudian
                  menyebar ke wilayah Karibia
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4 pb-4"
              >
                <View className="flex-col gap-2 pr-8">
                  {/* Baris pertama */}
                  <View className="flex-row gap-2">
                    {firstRow.map((item, index) => (
                      <View
                        key={index}
                        className={`p-3 rounded-lg border border-primary w-[120px] items-center ${
                          item.filled ? "bg-primary text-white" : "bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold font-poppins ${
                            item.filled ? "text-white" : "text-primary"
                          }`}
                        >
                          {item.label}
                        </Text>
                        {item.value && (
                          <Text
                            className={`text-xs font-poppins ${
                              item.filled ? "text-white" : "text-black"
                            }`}
                          >
                            {item.value}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Baris kedua */}
                  <View className="flex-row gap-2">
                    {secondRow.map((item, index) => (
                      <View
                        key={index}
                        className={`p-3 rounded-lg border border-primary w-[120px] items-center ${
                          item.filled ? "bg-primary text-white" : "bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold font-poppins ${
                            item.filled ? "text-white" : "text-primary"
                          }`}
                        >
                          {item.label}
                        </Text>
                        {item.value && (
                          <Text
                            className={`text-xs font-poppins ${
                              item.filled ? "text-white" : "text-black"
                            }`}
                          >
                            {item.value}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
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
                  Sebelum ditanam, bibit harus diperlakukan untuk mencegah hama
                  dan penyakit, dengan cara seperti merendam dalam emulsi
                  kotoran sapi atau perlakuan panas. Setelah bibit siap, lahan
                  digarap dengan dibajak beberapa kali, lalu dibuat saluran
                  irigasi untuk memastikan tanaman mendapatkan cukup air.
                  Penanaman biasanya dilakukan saat musim hujan mulai. Panen
                  dilakukan antara 4 hingga 10 bulan tergantung pada tujuan,
                  apakah untuk jahe segar atau jahe kering. Jahe kering dipanen
                  setelah matang penuh, direndam dalam air, lalu kulitnya
                  dikupas secara manual sebelum digiling
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
                  {"\u2022"} Fathiah, F. (2022). Identifikasi Tanaman Jahe (
                  <Text className="italic">Zingiber officinale</Text>)
                  Berdasarkan Morfologi.
                  <Text className="font-bold">
                    Agrifor: Jurnal Ilmu Pertanian dan Kehutanan
                  </Text>
                  , 21(2), 341-352.{"\n\n"}
                  {"\u2022"} Syaputri, E. R., Selaras, G. H., & Farma, S. A.
                  (2021, September). Manfaat Tanaman Jahe (
                  <Text className="italic">Zingiber officinale</Text>) Sebagai
                  Obat-obatan Tradisional (
                  <Text className="italic">Traditional Medicine</Text>). In
                  <Text className="font-bold">
                    Prosiding Seminar Nasional Biologi
                  </Text>
                  (Vol. 1, No. 1, pp. 579-586).{"\n\n"}
                  {"\u2022"} iNaturalist. Available from
                  https://www.inaturalist.org/taxa/122971-Zingiber-officinale .
                  Accessed 31 Januari 2025.
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
