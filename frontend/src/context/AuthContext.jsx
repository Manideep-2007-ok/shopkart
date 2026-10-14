import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logoutCustomer } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await logoutCustomer();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, checking, refreshUser, logout }}>{children}</AuthContext.Provider>
  );
}
