import apiClient from "./apiClient";

const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get("/api/usuarios/all");
      return response.data;
    } catch (error) {
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
  updateProfile: async (userId, formData) => {
    try {
      const response = await apiClient.put(
        `/api/usuarios/update/${userId}`,
        formData
      );
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
        role: newRole,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para eliminar un usuario por ID
  deleteUserById: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/usuarios/delete/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
