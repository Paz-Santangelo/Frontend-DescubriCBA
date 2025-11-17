import axios from "axios";

// Configuración base de la API
const API_URL = "http://localhost:8080";

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos de timeout
});

// Interceptor para agregar token JWT automáticamente a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_data");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
