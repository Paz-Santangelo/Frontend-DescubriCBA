import apiClient from "./apiClient";

const destinationService = {
  /**
   * Obtiene todas las "cards" de destinos para la vista principal.
   * Endpoint: GET /api/destinos/cards
   * @returns {Promise<Array>} Una promesa que resuelve a un array de DestinationCardDTO.
   */
  getAllDestinationCards: async () => {
    try {
      const response = await apiClient.get("/api/destinos/cards");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las cards de destinos:", error.response || error);
      throw error;
    }
  },

  /**
   * Obtiene un destino específico por su ID.
   * Endpoint: GET /api/destinos/{id}
   * @param {number|string} id - El ID del destino.
   * @returns {Promise<Object>} Una promesa que resuelve al objeto DestinationDTO.
   */
  getDestinationById: async (id) => {
    try {
      const response = await apiClient.get(`/api/destinos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el destino con ID ${id}:`, error.response || error);
      throw error;
    }
  },

  /**
   * Obtiene destinos filtrados por tipo.
   * Endpoint: GET /api/destinos/tipo/{tipo}
   * @param {string} tipo - El tipo de destino a filtrar (ej. 'RESTAURANTE').
   * @returns {Promise<Array>} Una promesa que resuelve a un array de DestinationDTO.
   */
  getDestinationsByType: async (tipo) => {
    try {
      const response = await apiClient.get(`/api/destinos/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener destinos por tipo ${tipo}:`, error.response || error);
      throw error;
    }
  },

  /**
   * Busca destinos por nombre.
   * Endpoint: GET /api/destinos/search?query={query}
   * @param {string} query - El término de búsqueda.
   * @returns {Promise<Array>} Una promesa que resuelve a un array de DestinationDTO.
   */
  searchDestinations: async (query) => {
    try {
      const response = await apiClient.get("/api/destinos/search", { params: { query } });
      return response.data;
    } catch (error) {
      console.error(`Error al buscar destinos con query "${query}":`, error.response || error);
      throw error;
    }
  },

  /**
   * Obtiene destinos por localidad.
   * Endpoint: GET /api/destinos/localidad/{localidad}
   * @param {string} localidad - La localidad a buscar.
   * @returns {Promise<Array>} Una promesa que resuelve a un array de DestinationDTO.
   */
  getDestinationsByLocality: async (localidad) => {
    try {
      const response = await apiClient.get(`/api/destinos/localidad/${localidad}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener destinos por localidad ${localidad}:`, error.response || error);
      throw error;
    }
  },
};

export default destinationService;