import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
const [loading, setLoading] = useState(false);

  useEffect(() => {
  const wakeBackend = async () => {
    setLoading(true);
    await pingBackend(); // wakes Render from sleep
    setLoading(false);
  };
  wakeBackend();
}, []);



const apiFetch = async (url, options = {}) => {
  setLoading(true);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } finally {
    setLoading(false); // hide after request finishes
  }
};

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };
 
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout,apiFetch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
