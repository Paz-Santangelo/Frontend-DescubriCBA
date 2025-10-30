import apiClient from "./apiClient";

const BASE = "/bodyOfWaters";

const bodyOfWaterService = {
  getAllBodies: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los cuerpos de agua:", error.response || error);
      throw error;
    }
  },

  getBodyById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el cuerpo de agua con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  createBody: async (formData) => {
    try {
      const response = await apiClient.post(`${BASE}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // 60 segundos de timeout para esta solicitud
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el cuerpo de agua:", error.response || error);
      throw error;
    }
  },

  updateBody: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el cuerpo de agua con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  deleteBody: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el cuerpo de agua con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  getAllByScoreDesc: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener cuerpos de agua ordenados:", error.response || error);
      throw error;
    }
  },

  filterBodies: async (params) => {
    try {
      // Axios se encarga de construir la query string a partir del objeto params.
      // Los parámetros que sean undefined o null no se incluirán.
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar cuerpos de agua:", error.response || error);
      throw error;
    }
  },
};

export default bodyOfWaterService;
