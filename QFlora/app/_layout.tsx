import React from "react";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import "../global.css";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator } from "react-native";
import { FavoriteProvider } from "../context/FavoriteContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    poppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    poppinsItalic: require("../assets/fonts/Poppins-Italic.ttf"),
    poppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
  return (
    <FavoriteProvider>
      <Slot />
    </FavoriteProvider>
  );
}
