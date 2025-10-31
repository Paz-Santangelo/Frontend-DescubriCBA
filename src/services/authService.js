import apiClient from "./apiClient";

const authService = {

  register: async (userData) => {
    try {
      const requestData = {
        name: userData.nombre,
        lastname: userData.apellido,
        email: userData.email,
        password: userData.password,
      };

      const response = await apiClient.post("/api/auth/register", requestData);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para hacer login
  login: async (loginData) => {
    try {
      const response = await apiClient.post("/api/auth/login", loginData);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para cerrar sesión
  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
  },

  // Función para verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;

    return !!token;
  },

  // Función para obtener el token actual
  getToken: () => {
    return localStorage.getItem("jwt_token");
  },

  // Función para obtener los datos del usuario actual
  getCurrentUser: () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;

    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },
};

export default authService;
