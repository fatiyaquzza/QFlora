import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";

type User = {
  uid: string;
  name: string;
  profilePicture: string;
};

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuth: false,
  setIsAuth: function (value: boolean): void {
    throw new Error("Function not implemented.");
  },
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};