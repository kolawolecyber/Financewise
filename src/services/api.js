import axios from "axios";
import { notifyDataChanged } from "../utils/dataSync";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});



// Response interceptor: handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const isMutation = ["post", "put", "patch", "delete"].includes(method);
    const isAuthRequest = response.config.url?.includes("/api/auth/");
    if (isMutation && !isAuthRequest) notifyDataChanged();
    return response;
  },
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/api/auth/");
    if (error.response?.status === 401 && !isAuthRequest) {
      console.warn("Token expired or invalid. Logging out.");

      // Clear any legacy client state and redirect to login.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";

     
    }

    return Promise.reject(error);
  }
);

export default API;
