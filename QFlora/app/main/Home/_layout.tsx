import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../../../context/authContext";

const HomeLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default HomeLayout;
