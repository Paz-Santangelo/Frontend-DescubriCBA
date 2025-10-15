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
      console.error(
        "Error al obtener todos los alojamientos:",
        error.response || error
      );
      throw error;
    }
  },

  /**
   * Obtiene un alojamiento por su ID.
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  getAccommodationById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener el alojamiento con ID ${id}:`,
        error.response || error
      );
      throw error;
    }
  },

  /**
   * Crea un nuevo alojamiento.
   * @param {FormData} formData - Objeto FormData con archivos y datos del DTO.
   * @returns {Promise<Object>}
   */
  createAccommodation: async (formData) => {
    try {
      const response = await apiClient.post(`${BASE}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el alojamiento:", error.response || error);
      throw error;
    }
  },

  /**
   * Actualiza un alojamiento existente.
   * @param {number|string} id
   * @param {FormData} formData - Objeto FormData con archivos y datos del DTO.
   * @returns {Promise<Object>}
   */
  updateAccommodation: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error al actualizar el alojamiento con ID ${id}:`,
        error.response || error
      );
      throw error;
    }
  },

  /**
   * Elimina un alojamiento por su ID.
   * @param {number|string} id
   * @returns {Promise<string>}
   */
  deleteAccommodation: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error al eliminar el alojamiento con ID ${id}:`,
        error.response || error
      );
      throw error;
    }
  },

  /**
   * Obtiene alojamientos ordenados por puntuación descendente.
   * @returns {Promise<Array>}
   */
  getAccommodationsByOrderDesc: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener alojamientos ordenados:",
        error.response || error
      );
      throw error;
    }
  },

  /**
   * Filtra alojamientos dinámicamente.
   * @param {object} params - Objeto con los parámetros de filtro.
   * @returns {Promise<Array>}
   */
  filterAccommodations: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar alojamientos:", error.response || error);
      throw error;
    }
  },
};

export default accommodationService;
