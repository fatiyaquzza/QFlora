import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../context/authContext";
import ErrorModal from "../components/Modal/Error";
import { ActivityIndicator } from "react-native";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
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

          <View className="w-full mb-4">
            <Text className="mb-2 text-base font-poppinsSemiBold">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="contoh@gmail.com"
              className="w-full p-4 rounded-md bg-softgray font-poppins"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9e9e9e"
            />
          </View>

          <View className="w-full mb-4">
            <Text className="mb-2 text-base font-poppinsSemiBold">
              Password
            </Text>
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

          <TouchableOpacity
            onPress={async () => {
              if (!email || !password) {
                setErrorMessage("Email dan password harus diisi.");
                setErrorModalVisible(true);
                return;
              }
              if (!email.includes("@")) {
                setErrorMessage("Format email tidak valid.");
                setErrorModalVisible(true);
                return;
              }

              setLoadingLogin(true);
              try {
                await login(email, password);
              } catch (err) {
                setErrorMessage(
                  "Gagal masuk. Periksa kembali email dan password Anda."
                );
                setErrorModalVisible(true);
              } finally {
                setLoadingLogin(false);
              }
            }}
            className="w-full p-4 bg-[#0B2D12] rounded-md mt-8 mb-4 flex flex-row items-center justify-center"
          >
            {loadingLogin ? (
              <>
                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                <Text className="text-base text-white font-poppinsSemiBold">
                  Sedang Masuk...
                </Text>
              </>
            ) : (
              <Text className="text-center text-white font-poppinsSemiBold">
                Masuk
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex flex-row items-center justify-center w-full mt-4 mb-6 space-x-4">
            {/* Tombol Google */}
            <TouchableOpacity
              className="flex flex-row items-center justify-center flex-1 bg-white border border-gray-300 rounded-lg h-14"
              onPress={async () => {
                try {
                  setLoadingLogin(true);
                  await loginWithGoogle();
                } catch (err: any) {
                  setErrorMessage(err.message);
                  setErrorModalVisible(true);
                } finally {
                  setLoadingLogin(false);
                }
              }}
            >
              <Image
                source={require("../../assets/images/google-logo.png")}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <Text className="text-sm text-gray-700 font-poppinsSemiBold">
                Lanjutkan dengan Google
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-600 font-poppins">
              Belum punya akun?
            </Text>
            <TouchableOpacity onPress={() => router.push("../auth/register")}>
              <Text className="text-[#0B2D12] font-poppinsSemiBold ml-1">
                Daftar!
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

export default Login;