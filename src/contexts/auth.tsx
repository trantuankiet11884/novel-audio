"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import config from "@/config/data";
import { auth } from "@/lib/firebase/fconfig";
import axios from "axios";

interface User {
  removeads?: boolean;
  order?: string;
  email?: string;
  username?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const axiosInstance = axios.create({
  baseURL: config.apiv2,
  timeout: 10000,
});

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    let interceptor: number | null = null;

    const unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (interceptor !== null) {
        axiosInstance.interceptors.request.eject(interceptor);
      }

      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken(true);
          interceptor = axiosInstance.interceptors.request.use(
            (config) => {
              config.headers.Authorization = `Bearer ${idToken}`;
              return config;
            },
            (error) => Promise.reject(error)
          );

          const cachedUser = localStorage.getItem("user");
          if (cachedUser) {
            try {
              const parsedUser = JSON.parse(cachedUser);
              setUser(parsedUser);
              setLoading(false);
            } catch (e) {
              console.error("Error parsing cached user:", e);
              localStorage.removeItem("user");
            }
          } else {
            const response = await axiosInstance.get(
              `${config.apiv2}/user/v2/me`
            );
            console.log(response);
            const userData = {
              ...response.data.user,
              email: firebaseUser.email,
              avatar: response.data.user.avatar,
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            setLoading(false);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("user");
          } else {
            setUser({ email: firebaseUser.email || "" });
          }
          setLoading(false);
        }
      } else {
        console.log("No user is currently signed in");
        setUser(null);
        setLoading(false);
        localStorage.removeItem("user");
      }
    });

    return () => {
      unsubscribeToken();
      if (interceptor !== null) {
        axiosInstance.interceptors.request.eject(interceptor);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
