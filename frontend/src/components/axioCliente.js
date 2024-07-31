import axios from "axios";

// Configura una instancia de Axios
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api", // URL base para las solicitudes
  timeout: 10000, // Tiempo de espera
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud para incluir el token de autenticación
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // O donde almacenes tu token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
