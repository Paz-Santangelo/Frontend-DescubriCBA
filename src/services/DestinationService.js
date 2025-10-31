import apiClient from "./apiClient";

const destinationService = {
  /* Obtiene todas las "cards" de destinos para la vista principal. */
  getAllDestinationCards: async () => {
    try {
      const response = await apiClient.get("/api/destinos/cards");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene un destino específico por su ID. */
  getDestinationById: async (id) => {
    try {
      const response = await apiClient.get(`/api/destinos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene destinos filtrados por tipo. */
  getDestinationsByType: async (tipo) => {
    try {
      const response = await apiClient.get(`/api/destinos/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Busca destinos por nombre.  */
  searchDestinations: async (query) => {
    try {
      const response = await apiClient.get("/api/destinos/search", { params: { query } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene destinos por localidad. */
  getDestinationsByLocality: async (localidad) => {
    try {
      const response = await apiClient.get(`/api/destinos/localidad/${localidad}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default destinationService;