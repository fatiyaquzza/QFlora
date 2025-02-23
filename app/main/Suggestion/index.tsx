import React, { useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";

const Suggestion = () => {
  const router = useRouter();
  const [modules, setModules] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const scheme = useColorScheme();

  return (
    <>
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <ScrollView
        className="flex-1 p-5 bg-gray-100"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={["#38B68D"]}
            tintColor="#38B68D"
          />
        }
      ></ScrollView>
    </>
  );
};

export default Suggestion;
