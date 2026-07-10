import axios from "axios";
import { API_URL } from "../config/environment";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isAuthRequest = config.url?.startsWith("/auth/");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;