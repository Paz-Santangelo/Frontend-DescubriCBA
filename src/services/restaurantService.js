import apiClient from "./apiClient";

const BASE = "/restaurants";

const restaurantService = {
  /* Obtiene todos los restaurantes. */
  findAllRestaurants: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene un restaurante por su ID. */
  findRestaurantById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Crea un nuevo restaurante.  */
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
      throw error;
    }
  },

  /* Actualiza un restaurante existente. */
  updateRestaurant: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Elimina un restaurante por su ID. */
  deleteRestaurant: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data; // El backend devuelve un mensaje de texto.
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene todos los restaurantes ordenados por puntuación descendente. */
  findAllRestaurantsByOrderDescendent: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Filtra restaurantes dinámicamente. */
  dinamicFilterForRestaurants: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene todos los tipos de cocina disponibles. */
  getCuisineTypes: async () => {
    try {
      const response = await apiClient.get(`${BASE}/cuisine-types`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default restaurantService;
