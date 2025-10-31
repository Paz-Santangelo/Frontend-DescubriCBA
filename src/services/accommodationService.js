import apiClient from "./apiClient";

const BASE = "/accommodations";

const accommodationService = {
  /**
   * Obtiene todos los alojamientos.
   * @returns {Promise<Array>}
   */
  getAllAccommodations: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene un alojamiento por su ID. */
  getAccommodationById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Crea un nuevo alojamiento. */
  createAccommodation: async (formData) => {
    try {
      const response = await apiClient.post(`${BASE}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Actualiza un alojamiento existente. */
  updateAccommodation: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Elimina un alojamiento por su ID. */
  deleteAccommodation: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene alojamientos ordenados por puntuación descendente. */
  getAccommodationsByOrderDesc: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Filtra alojamientos dinámicamente */
  filterAccommodations: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default accommodationService;
