import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import API from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/profile/settings")
      .then(({ data }) => {
        setUser(data);
        setAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const apiFetch = async (url, options = {}) => {
    setLoading(true);
    try {
      const { data } = await API.request({
        url,
        method: options.method || "GET",
        data: options.body ? JSON.parse(options.body) : undefined,
        headers: options.headers,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = newUser => {
    setUser(newUser);
    setAuthenticated(true);
  };

  const logout = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch {
      // The local session must still be cleared if the server is unavailable.
    } finally {
      setUser(null);
      setAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, login, logout, apiFetch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};