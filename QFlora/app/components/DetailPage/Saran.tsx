import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import axiosClient from "../../../api/axioxClient";
import { useAuth } from "../../../context/authContext";
import Toast from "react-native-toast-message";

interface SuggestionType {
  id: number;
  name: string;
}

const Saran = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [desc, setDesc] = useState("");
  const [types, setTypes] = useState<SuggestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSuggestionTypes();
  }, []);

  const fetchSuggestionTypes = async () => {
    try {
      const response = await axiosClient.get("/suggestions/types");
      setTypes(response.data);
    } catch (error) {
      console.error("❌ Gagal mengambil tipe saran:", error);
      Toast.show({
        type: "error",
        text1: "Gagal memuat tipe saran",
        position: "bottom",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const radioButtons: RadioButtonProps[] = types.map((type) => ({
    id: type.id.toString(),
    label: type.name,
    value: type.name,
    labelStyle: { fontFamily: "poppins" },
  }));

  const handleBack = () => {
    router.replace("../../main/Profile");
  };

  const handleSubmit = async () => {
    const selectedType = types.find(
      (type) => type.id.toString() === selectedId
    );
    if (!selectedType) {
      Toast.show({
        type: "error",
        text1: "Pilih tipe saran terlebih dahulu",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    if (!desc.trim()) {
      Toast.show({
        type: "error",
        text1: "Deskripsi tidak boleh kosong",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await axiosClient.post("/suggestions", {
        suggestion_type_id: selectedType.id,
        description: desc,
      });

      Toast.show({
        type: "success",
        text1: "Saran berhasil dikirim",
        position: "bottom",
        visibilityTime: 3000,
      });

      setSelectedId(undefined);
      setDesc("");
    } catch (error) {
      console.error("❌ Gagal mengirim saran", error);
      Toast.show({
        type: "error",
        text1: "Gagal mengirim saran",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
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
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#0B2D12"
                  className="mt-4"
                />
              ) : (
                <View className="mt-2 ">
                  <RadioGroup
                    layout="row"
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                  />
                </View>
              )}

              <Text className="mt-6 text-lg font-poppinsSemiBold">
                Deskripsi
              </Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Deskripsi..."
                placeholderTextColor="#9e9e9e"
                className="w-full p-4 mt-2 text-black bg-gray-100 border rounded-md font-poppins min-h-80"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`mt-8 w-full p-4 mb-10 rounded-md ${
                  loading ? "bg-gray-400" : "bg-[#0B2D12]"
                }`}
              >
                <Text className="text-lg text-center text-white font-poppinsSemiBold">
                  Kirim
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </>
  );
};

export default Saran;
