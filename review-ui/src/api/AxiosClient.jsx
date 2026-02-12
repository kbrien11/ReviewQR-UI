import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://reviewqrapi.onrender.com/auth",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;