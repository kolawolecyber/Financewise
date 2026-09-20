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
      console.warn("Session expired or invalid. Clearing client auth state.");

      // Clear legacy cached token data without forcing a full browser refresh.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("financewise:session-expired"));
    }

    return Promise.reject(error);
  }
);

export default API;
