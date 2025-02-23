import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const scheme = useColorScheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Status bar */}
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />

      {/* ScrollView untuk konten */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center justify-center flex-1 px-6 bg-white">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-32 h-32 mb-6"
          />

          <Text className="mb-2 text-3xl font-poppinsSemiBold">
            Selamat Datang
          </Text>
          <Text className="mb-6 text-lg text-gray font-poppins">
            Silahkan masukkan data diri
          </Text>

          <View className="w-full mt-8 mb-4">
            <Text className="mb-2 text-base text-gray-700 font-poppinsSemiBold">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="contoh@gmail.com"
              placeholderTextColor="#9e9e9e"
              className="w-full p-4 text-black rounded-md bg-softgray font-poppins"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="w-full mb-4">
            <Text className="mb-2 text-base text-gray-700 font-poppinsSemiBold">
              Password
            </Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#9e9e9e"
                className="w-full px-4 text-base rounded-lg bg-softgray h-14 font-poppins"
                textContentType="oneTimeCode"
                autoCapitalize="none"
              />
              <TouchableOpacity className="absolute right-4 top-4">
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("../main")}
            className="mt-8 w-full p-4 mb-4 bg-[#0B2D12] rounded-md"
          >
            <Text className="text-center text-white font-poppinsSemiBold">
              Sign in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-center w-full p-4 mb-6 bg-white border border-[#0B2D12] rounded-md">
            <Image
              source={require("../../assets/images/google-logo.png")}
              className="w-6 h-6 mr-2"
            />
            <Text className="text-gray-600 font-poppinsSemiBold">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-gray-600 font-poppins">
              Don’t have an account?
            </Text>
            <Pressable onPress={() => router.push("../auth/register")}>
              <Text className="text-[#0B2D12] font-poppinsSemiBold ml-1">
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
