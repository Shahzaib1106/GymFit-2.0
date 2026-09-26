import { useEffect, useState } from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authService.js";

import { getMyProfile } from "../services/memberService.js";

import { AuthContext } from "./authContextValue.jsx";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () => localStorage.getItem("gymfit_token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("gymfit_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const authData = await getCurrentUser(savedToken);

        let currentUser = authData.user;

        try {
          const profileData = await getMyProfile(savedToken);

          if (profileData.member) {
            currentUser = {
              ...currentUser,
              ...profileData.member,
            };
          }
        } catch (profileError) {
          console.error(
            "Member profile restore failed:",
            profileError
          );
        }

        setUser(currentUser);
        setToken(savedToken);
      } catch (error) {
        console.error("Session restore failed:", error);

        localStorage.removeItem("gymfit_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem("gymfit_token", data.token);

    setToken(data.token);
    setUser(data.user);

    try {
      const profileData = await getMyProfile(data.token);

      if (profileData.member) {
        setUser((previousUser) => ({
          ...previousUser,
          ...profileData.member,
        }));
      }
    } catch (error) {
      console.error(
        "Profile loading after login failed:",
        error
      );
    }

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem("gymfit_token", data.token);

    setToken(data.token);
    setUser(data.user);

    try {
      const profileData = await getMyProfile(data.token);

      if (profileData.member) {
        setUser((previousUser) => ({
          ...previousUser,
          ...profileData.member,
        }));
      }
    } catch (error) {
      console.error(
        "Profile loading after registration failed:",
        error
      );
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem("gymfit_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};