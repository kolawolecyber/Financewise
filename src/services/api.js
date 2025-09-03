import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});



// Request interceptor: add token if available
API.interceptors.request.use((config) => {
  //using local storage for here now, might change it to cookie later
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or invalid. Logging out.");

      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login"; 

     
    }

    return Promise.reject(error);
  }
);

export default API;
