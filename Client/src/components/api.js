import axios from "axios";

// Automatically switch API URL between development and production
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://ricedeployment2.onrender.com"
    : "http://localhost:3000";

const API = axios.create({
  baseURL,
  withCredentials: true, // Enables sending cookies if needed
});

// Attach JWT token from localStorage if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (credentials) => API.post("/api/auth/login", credentials);
export const registerUser = (credentials) => API.post("/api/auth/register", credentials);

export default API;
