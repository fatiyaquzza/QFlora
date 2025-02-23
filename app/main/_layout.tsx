import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, createContext, useContext } from "react";

export const TabVisibilityContext = createContext({
  setIsInputFocused: (focused: boolean) => {},
  isInputFocused: false,
});

export const useTabVisibility = () => {
  const context = useContext(TabVisibilityContext);
  if (!context) {
    throw new Error(
      "useTabVisibility must be used within TabVisibilityProvider"
    );
  }
  return context;
};

export default function MainLayout() {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <TabVisibilityContext.Provider
      value={{ isInputFocused, setIsInputFocused }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#23483C",
          tabBarInactiveTintColor: "#9e9e9e",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: 80,
            paddingBottom: 20,
            paddingHorizontal: 20,
            paddingTop: 7,
            display: isInputFocused ? "none" : "flex",
          },
          tabBarLabelStyle: {
            fontFamily: "poppinsSemiBold",
            fontSize: 12,
            marginBottom: -5,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
            title: "Beranda",
          }}
        />

        <Tabs.Screen
          name="Favorite"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="favorite" color={color} size={size} />
            ),
            title: "Favorit",
          }}
        />

        <Tabs.Screen
          name="Search"
          options={{
            tabBarIcon: ({ size }) => (
              <LinearGradient
                colors={["#23483C", "#23483C"]}
                style={{
                  borderRadius: 50,
                  borderWidth: 10,
                  borderColor: "#EFEFEF",
                  height: 80,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <Ionicons name="search" color="#ffffff" size={size} />
              </LinearGradient>
            ),
            title: "",
          }}
        />

        <Tabs.Screen
          name="Suggestion"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="create" color={color} size={size} />
            ),
            title: "Saran",
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
            title: "Profil",
          }}
        />
      </Tabs>
    </TabVisibilityContext.Provider>
  );
}