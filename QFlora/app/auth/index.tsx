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
  Image,
} from "react-native";
import { useAuth } from "../../context/authContext";
import ErrorModal from "../components/Modal/Error";
import { ActivityIndicator } from "react-native";

const Login: React.FC = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { loginWithGoogle } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
        <View className="items-center justify-center flex-1 px-6 bg-background">
          <Image
            source={require("../../assets/images/logo3.png")}
            className="w-44 h-44 mb-6"
          />
          <Text className="mb-2 text-3xl font-poppinsSemiBold">
            Selamat Datang
          </Text>
          <Text className="mb-6 text-gray font-poppins text-center text-base">
            Silahkan login dengan Google untuk melanjutkan
          </Text>

          <TouchableOpacity
            className="flex flex-row items-center justify-center w-full drop-shadow-lg bg-background border border-primary hover:bg-softgreen rounded-lg h-14 mb-6"
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
            {loadingLogin ? (
              <>
                <ActivityIndicator color="#0B2D12" style={{ marginRight: 8 }} />
                <Text className="text-sm font-poppinsSemiBold">
                  Sedang Memproses...
                </Text>
              </>
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google-logo.png")}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text className="text-sm text-primary font-poppinsSemiBold">
                  Lanjutkan dengan Google
                </Text>
              </>
            )}
          </TouchableOpacity>

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
