import apiClient from "./apiClient";

const BASE = "/api/destinos";

const destinationService = {

  /* Obtiene todas las "cards" de destinos para la vista principal. */
  getAllDestinationCards: async () => {
    try {
      const response = await apiClient.get(`${BASE}/cards`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene un destino específico por su ID para editar. */
  getDestinationById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene destinos por localidad. */
  getDestinationsByLocality: async (locality) => {
    try {
      const response = await apiClient.get(`${BASE}/buscar`, {
        params: { localidad: locality },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

    /* Obtiene la lista de los niveles de concurrencia. */
  getlevelsConcurrenceTypes: async () => {
    try {
      const response = await apiClient.get(`${BASE}/obtener/concurrencia`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default destinationService;