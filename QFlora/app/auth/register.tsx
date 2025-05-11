import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../context/authContext";
import ErrorModal from "../components/Modal/Error";
import { ActivityIndicator } from "react-native";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
        <View className="items-center justify-center flex-1 px-6 mt-6 bg-white">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-32 h-32 mb-6"
          />
          <Text className="mb-2 text-3xl font-poppinsSemiBold">
            Daftar Sekarang
          </Text>
          <Text className="mb-6 text-lg text-gray font-poppins">
            Buat akun untuk melanjutkan
          </Text>

          <View className="w-full mb-4">
            <Text className="mb-2 font-poppinsSemiBold">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              className="w-full p-4 rounded-md bg-softgray font-poppins"
              placeholderTextColor="#9e9e9e"
            />
          </View>

          <View className="w-full mb-4">
            <Text className="mb-2 font-poppinsSemiBold">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="contoh@gmail.com"
              className="w-full p-4 rounded-md bg-softgray font-poppins"
              autoCapitalize="none"
              placeholderTextColor="#9e9e9e"
            />
          </View>

          <View className="w-full mb-4">
            <Text className="mb-2 font-poppinsSemiBold">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                secureTextEntry={!showPassword}
                className="w-full px-4 rounded-lg h-14 bg-softgray font-poppins"
                placeholderTextColor="#9e9e9e"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full mb-4">
            <Text className="mb-2 font-poppinsSemiBold">Confirm Password</Text>
            <View className="relative">
              <TextInput
                value={confPassword}
                onChangeText={setConfPassword}
                placeholder="********"
                secureTextEntry={!showConfPassword}
                className="w-full px-4 rounded-lg h-14 bg-softgray font-poppins"
                placeholderTextColor="#9e9e9e"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfPassword(!showConfPassword)}
              >
                <MaterialIcons
                  name={showConfPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={async () => {
              if (!username || !email || !password || !confPassword) {
                setErrorMessage("Semua kolom harus diisi.");
                setErrorModalVisible(true);
                return;
              }

              if (!email.includes("@")) {
                setErrorMessage("Format email tidak valid.");
                setErrorModalVisible(true);
                return;
              }

              if (password !== confPassword) {
                setErrorMessage("Konfirmasi password tidak sama.");
                setErrorModalVisible(true);
                return;
              }

              setLoadingRegister(true);
              try {
                await register(email, password, confPassword, username);
              } catch (err) {
                setErrorMessage("Gagal mendaftar. Silakan coba lagi.");
                setErrorModalVisible(true);
              } finally {
                setLoadingRegister(false);
              }
            }}
            className="w-full p-4 bg-[#0B2D12] rounded-md mt-4 mb-4 flex flex-row items-center justify-center"
          >
            {loadingRegister ? (
              <>
                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                <Text className="text-base text-white font-poppinsSemiBold">
                  Sedang Mendaftar...
                </Text>
              </>
            ) : (
              <Text className="text-center text-white font-poppinsSemiBold">
                Daftar
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-gray-600 font-poppins">
              Sudah Memiliki Akun?
            </Text>
            <TouchableOpacity onPress={() => router.push("../auth")}>
              <Text className="text-[#0B2D12] font-poppinsSemiBold ml-1">
                Masuk!
              </Text>
            </TouchableOpacity>
          </View>
          <ErrorModal
            visible={errorModalVisible}
            message={errorMessage}
            onClose={() => setErrorModalVisible(false)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;