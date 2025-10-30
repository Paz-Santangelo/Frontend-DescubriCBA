import apiClient from "./apiClient";

const BASE = "/restaurants";

const restaurantService = {
  /**
   * Obtiene todos los restaurantes.
   * @returns {Promise<Array>}
   */
  findAllRestaurants: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los restaurantes:", error.response || error);
      throw error;
    }
  },

  /**
   * Obtiene un restaurante por su ID.
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  findRestaurantById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el restaurante con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  /**
   * Crea un nuevo restaurante.
   * @param {FormData} formData - Debe ser un objeto FormData que contenga los archivos y los datos del DTO.
   * @returns {Promise<Object>}
   */
  createRestaurant: async (formData) => {
    try {
      const response = await apiClient.post(`${BASE}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 segundos de timeout para esta solicitud
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el restaurante:", error.response || error);
      throw error;
    }
  },

  /**
   * Actualiza un restaurante existente.
   * @param {number|string} id
   * @param {FormData} formData - Debe ser un objeto FormData que contenga los archivos y los datos del DTO.
   * @returns {Promise<Object>}
   */
  updateRestaurant: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el restaurante con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  /**
   * Elimina un restaurante por su ID.
   * @param {number|string} id
   * @returns {Promise<string>}
   */
  deleteRestaurant: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data; // El backend devuelve un mensaje de texto.
    } catch (error) {
      console.error(`Error al eliminar el restaurante con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  /**
   * Obtiene todos los restaurantes ordenados por puntuación descendente.
   * @returns {Promise<Array>}
   */
  findAllRestaurantsByOrderDescendent: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener restaurantes ordenados:", error.response || error);
      throw error;
    }
  },

  /**
   * Filtra restaurantes dinámicamente.
   * @param {object} params - Objeto con los parámetros de filtro (locality, minAverageScore, delivery, reservations).
   * @returns {Promise<Array>}
   */
  dinamicFilterForRestaurants: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      //console.log('Respuesta del filtro dinámico de restaurantes:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error al filtrar restaurantes:", error.response || error);
      throw error;
    }
  },
};

export default restaurantService;
