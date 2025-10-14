import axios from 'axios';

// Configuración base de la API
const API_URL = "http://localhost:8080"; 

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      // Agregar token al header Authorization
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
    // Si la respuesta es exitosa, retornar los datos
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Token inválido o expirado, limpiar localStorage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      
      // Opcional: redirigir al login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
