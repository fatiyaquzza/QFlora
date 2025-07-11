import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

type User = {
  uid: string;
  name: string;
  email: string;
  profilePicture: string;
};

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  logout: async () => {},
  loading: false,
  loginWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const setLoginStatus = async (status: boolean) => {
    await AsyncStorage.setItem("isLoggedIn", JSON.stringify(status));
  };

  const getLoginStatus = async () => {
    const status = await AsyncStorage.getItem("isLoggedIn");
    return status === "true";
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "533251574081-5694829mloelspotjjidlgopug870uuv.apps.googleusercontent.com",
      offlineAccess: false,
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const isLoggedIn = await getLoginStatus();
      if (firebaseUser && isLoggedIn) {
        const userData = {
          uid: firebaseUser.uid,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Pengguna",
          profilePicture: firebaseUser.photoURL ?? "",
          email: firebaseUser.email ?? "email tidak ditemukan",
        };
        setUser(userData);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const googleUser = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken)
        throw new Error("idToken tidak ditemukan dari GoogleSignin");

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      setUser({
        uid: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Pengguna",
        profilePicture: firebaseUser.photoURL ?? "",
        email: firebaseUser.email ?? "email tidak ditemukan",
      });

      setIsAuth(true);
      await setLoginStatus(true);
      router.replace("../main/Home");
    } catch (error: any) {
      console.error("❌ Login Google error:", error);
      console.log("DEBUG GoogleSignin error full:", JSON.stringify(error, null, 2));
      throw new Error("Login Google gagal. Coba lagi.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuth(false);
      await AsyncStorage.removeItem("isLoggedIn");
      router.replace("/auth");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        logout,
        loginWithGoogle,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);