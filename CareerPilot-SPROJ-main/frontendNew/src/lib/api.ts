
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const BACKEND_URL = "https://career-pilot-s24d.onrender.com";

// Wrapper hook for authorized calls
export function useApi() {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: BACKEND_URL + "/api",
  });

  // Automatically attach Clerk JWT to each request
  api.interceptors.request.use(async (config) => {
    const token = await getToken({ template: "default" });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}
