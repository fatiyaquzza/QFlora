import React, { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  RefreshControl,
  StatusBar,
  TextInput,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { Ionicons } from "@expo/vector-icons";

const Suggestion = () => {
  const router = useRouter();
  const [modules, setModules] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const scheme = useColorScheme();
  const profile = require("../../../assets/images/icon.png");
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
          <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
    <View className="flex-1 mx-6">
      <View className="flex-row items-center mt-16 mb-6">
        <Image source={profile} className="w-12 h-12" />
        <View className="ml-2">
          <Text className="text-lg font-poppinsSemiBold text-">Form Saran</Text>
          <Text className="text-sm text-gray-500">
            Berikan kritik dan saran dibawah ini
          </Text>
        </View>
      </View>

      <View className="border-b-[1px] border-gray"></View>

      <View className="mt-4">
        <Text className="font-poppinsSemiBold text-lg">Tipe</Text>
        <View className=" flex justify-start mt-2 mx-[-8] mb-4">
          <RadioGroup
            layout="row"
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
          />
        </View>

        <Text className="font-poppinsSemiBold text-lg">Deskripsi</Text>
        <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="deskripsi..."
              placeholderTextColor="#9e9e9e"
              className="w-full mt-2 p-4 text-black border rounded-md bg-softgray font-poppins min-h-[370px]"
              multiline={true}
              numberOfLines={5}
            />

      <TouchableOpacity
            onPress={() => router.push("../main")}
            className="mt-8 w-full p-4 mb-4 bg-[#0B2D12] rounded-md"
          >
            <Text className="text-center text-white font-poppinsSemiBold">
              Submit
            </Text>
          </TouchableOpacity>
      </View>


    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    // <>
    //   {/* <StatusBar
    //     barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
    //     backgroundColor="#ffffff"
    //     translucent
    //   />
    //   <ScrollView
    //     className="flex-1 p-5 bg-gray-100"
    //     refreshControl={
    //       <RefreshControl
    //         refreshing={refreshing}
    //         colors={["#38B68D"]}
    //         tintColor="#38B68D"
    //       />
    //     }
    //   ></ScrollView> */}
    // </>
  );
};

export default Suggestion;
