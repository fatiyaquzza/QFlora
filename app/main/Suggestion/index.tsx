import React, { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";

const Suggestion = () => {
  const router = useRouter();
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "Kritik",
        label: "Kritik",
        value: "Kritik",
      },
      {
        id: "Saran",
        label: "Saran",
        value: "Saran",
      },
      {
        id: "Pertanyaan",
        label: "Pertanyaan",
        value: "Pertanyaan",
      },
    ],
    []
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [desc, setDesc] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-row items-center p-4 mt-10 border-b border-gray">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16 mx-2"
        />
        <View className="flex-col mt-2">
          <Text className="text-2xl font-poppinsSemiBold text-primary">
            Form Saran
          </Text>
          <Text className="text-sm font-poppins text-gray">
            Berikan kritik dan saran dibawah ini
          </Text>
        </View>
      </View>
      <ScrollView className="px-8 mt-6 bg-gray-100">
        <View>
          <Text className="text-lg font-poppinsSemiBold">Tipe</Text>
          <View className="justify-start flex-1 mt-2">
            <RadioGroup
              layout="row"
              radioButtons={radioButtons.map((button) => ({
                ...button,
                labelStyle: { fontFamily: "poppins" },
              }))}
              onPress={setSelectedId}
              selectedId={selectedId}
            />
            <Text className="mt-4 text-lg font-poppinsSemiBold">Deskripsi</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Deskripsi..."
              placeholderTextColor="#9e9e9e"
              className="w-full p-4 mt-2 text-black border rounded-md bg-softgray font-poppins min-h-80"
              multiline={true}
              numberOfLines={8}
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={() => router.push("../main")}
              className="mt-8 w-full p-4 mb-4 bg-[#0B2D12] rounded-md"
            >
              <Text className="text-lg text-center text-white font-poppinsSemiBold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Suggestion;
