import apiClient from "./apiClient";

// Servicio para manejar operaciones relacionadas con usuarios
const userService = {
  
  // Función para obtener todos los usuarios (requiere autenticación)
  getAllUsers: async () => {
    try {
      // El interceptor de apiClient ya añade el token automáticamente.
      const response = await apiClient.get('/api/usuarios/all');
      // Devolvemos directamente el array de usuarios que viene en response.data.
      console.log(response.data);
      return response.data;
    } catch (error) {
      // Si hay un error (401, 403, etc.), lo relanzamos para que el componente lo maneje.
      // El interceptor de apiClient ya se encarga de los errores 401 (redirección).
      throw error;
    }
  },

  // Función para obtener un usuario específico por ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para actualizar perfil de usuario
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/api/usuarios/profile', userData);
      // Actualizar datos del usuario en localStorage si es exitoso
      if (response.data) {
        localStorage.setItem('user_data', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para actualizar el rol de un usuario
  updateUserRole: async (userId, newRole) => {
    try {
      // Llamar al endpoint real del backend
      const response = await apiClient.put(`/api/usuarios/${userId}/role`, {
        role: newRole
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;