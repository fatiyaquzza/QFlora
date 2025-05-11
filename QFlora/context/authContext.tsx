import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
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
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  login: async () => {},
  register: async () => {},
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
      webClientId:
        "533251574081-5694829mloelspotjjidlgopug870uuv.apps.googleusercontent.com",
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
      throw new Error("Login Google gagal. Coba lagi.");
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => {
    if (password !== confirmPassword) {
      throw new Error("Password dan konfirmasi tidak sama.");
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
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email sudah digunakan.");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Email tidak valid.");
      }
      if (error.code === "auth/weak-password") {
        throw new Error("Password terlalu lemah (min. 6 karakter).");
      }
      throw new Error(error.message || "Gagal daftar.");
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
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);