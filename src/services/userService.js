import apiClient from "./apiClient";

const BASE = "/api/usuarios";

const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para obtener un usuario específico por ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`${BASE}/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para obtener un usuario por su email
  getUserByEmail: async (email) => {
    try {
      const response = await apiClient.get(`${BASE}/search/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para buscar usuarios por nombre o apellido
  searchUsers: async (query) => {
    try {
      const response = await apiClient.get(`${BASE}/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Función para actualizar perfil de usuario
  updateProfile: async (userId, formData) => {
    try {
      const response = await apiClient.put(
        `${BASE}/update/${userId}`,
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
      const response = await apiClient.put(`${BASE}/${userId}/role`, {
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
      const response = await apiClient.delete(`${BASE}/delete/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
