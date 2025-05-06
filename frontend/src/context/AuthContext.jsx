import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext();

const ADMIN_EMAIL = "qflora2025@gmail.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser?.email === ADMIN_EMAIL) {
        setUser(firebaseUser);
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
      } else {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user.email !== ADMIN_EMAIL) {
      throw new Error("Akun ini bukan admin QFLORA.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
