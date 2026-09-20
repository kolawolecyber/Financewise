import { useEffect, useRef, useState } from "react";
import { AuthContext } from "./context";
import API from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const latestSessionRequest = useRef(0);

  const refreshSession = async () => {
    const requestId = ++latestSessionRequest.current;
    setLoading(true);

    try {
      const { data } = await API.get("/api/profile/settings");
      if (requestId !== latestSessionRequest.current) return;
      setUser(data);
      setAuthenticated(true);
    } catch {
      if (requestId !== latestSessionRequest.current) return;
      setUser(null);
      setAuthenticated(false);
    } finally {
      if (requestId === latestSessionRequest.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      latestSessionRequest.current += 1;
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener("financewise:session-expired", handleSessionExpired);
    refreshSession();

    return () => {
      latestSessionRequest.current += 1;
      window.removeEventListener("financewise:session-expired", handleSessionExpired);
    };
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
    latestSessionRequest.current += 1;
    setUser(newUser);
    setAuthenticated(true);
    setLoading(false);
  };

  const logout = async () => {
    latestSessionRequest.current += 1;
    try {
      await API.post("/api/auth/logout");
    } catch {
      // The local session must still be cleared if the server is unavailable.
    } finally {
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, login, logout, apiFetch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};