"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, removeCookie } from "@/lib/cookies";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getCookie("user");
    const storedToken = getCookie("access_token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    setCookie("access_token", newToken);
    setCookie("user", newUser);
    setToken(newToken);
    setUser(newUser);

    // Redirect based on role
    if (newUser.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/customer");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeCookie("user");
    removeCookie("access_token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
