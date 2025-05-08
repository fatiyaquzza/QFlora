import React from "react";
import { Stack } from "expo-router";

const GeneralLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default GeneralLayout;
