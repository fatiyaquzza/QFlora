import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loading: false,
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const isLoggedIn = await getLoginStatus();
      // console.log("🔁 Firebase user berubah:", firebaseUser);
      // console.log("✅ Status login tersimpan di AsyncStorage:", isLoggedIn);

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

        // console.log("📦 User data diset ke context:", userData);

        setUser(userData);
        setIsAuth(true);
      } else {
        // console.log("🚫 Tidak ada user yang login atau status tidak tersimpan");
        setUser(null);
        setIsAuth(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
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
      // 🟡 Cek error code untuk tampilan modal yang spesifik
      if (error.code === "auth/user-not-found") {
        throw new Error("Email tidak ditemukan.");
      }
      if (error.code === "auth/wrong-password") {
        throw new Error("Password salah.");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Format email tidak valid.");
      }
      throw new Error(error.message || "Gagal login. Silakan coba lagi.");
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => {
    if (password !== confirmPassword) {
      throw new Error("Password dan konfirmasi password tidak sama.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredential.user;

      await updateProfile(currentUser, {
        displayName: username,
      });

      await currentUser.reload();
      const refreshedUser = auth.currentUser!;

      setUser({
        uid: refreshedUser.uid,
        name: refreshedUser.displayName ?? "Pengguna",
        profilePicture: refreshedUser.photoURL ?? "",
        email: refreshedUser.email ?? "email tidak ditemukan",
      });

      setIsAuth(true);
      await setLoginStatus(true);
      router.replace("../main/Home");
    } catch (error: any) {
      // 🟡 Tambahkan pengecekan error code Firebase di sini:
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email sudah digunakan. Silakan gunakan email lain.");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Format email tidak valid.");
      }
      if (error.code === "auth/weak-password") {
        throw new Error("Password terlalu lemah. Minimal 6 karakter.");
      }
      throw new Error(error.message || "Terjadi kesalahan saat mendaftar.");
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
      value={{ user, isAuth, loading, login, register, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);