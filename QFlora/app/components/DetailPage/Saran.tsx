import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";

const Saran = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [desc, setDesc] = useState("");

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: "Kritik", label: "Kritik", value: "Kritik" },
      { id: "Saran", label: "Saran", value: "Saran" },
      { id: "Pertanyaan", label: "Pertanyaan", value: "Pertanyaan" },
    ],
    []
  );

  const handleBack = () => {
    router.replace("../../main/Profile");
  };

  const handleSubmit = () => {
    // Submit logika bisa ditambahkan di sini
    router.push("../main");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Form Saran",
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

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 mx-6">

          {/* Form */}
          <View className="mt-6">
            <Text className="text-lg font-poppinsSemiBold">Tipe</Text>
            <View className="mt-2">
              <RadioGroup
                layout="row"
                radioButtons={radioButtons.map((button) => ({
                  ...button,
                  labelStyle: { fontFamily: "poppins" },
                }))}
                onPress={setSelectedId}
                selectedId={selectedId}
              />
            </View>

            <Text className="mt-6 text-lg font-poppinsSemiBold">Deskripsi</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Deskripsi..."
              placeholderTextColor="#9e9e9e"
              className="w-full p-4 mt-2 text-black border rounded-md bg-gray-100 font-poppins min-h-80"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleSubmit}
              className="mt-8 w-full p-4 mb-10 bg-[#0B2D12] rounded-md"
            >
              <Text className="text-lg text-center text-white font-poppinsSemiBold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Saran;
