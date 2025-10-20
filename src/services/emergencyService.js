import apiClient from "./apiClient";

const BASE = "/emergencyServices";

const emergencyService = {
  getAllServices: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener todos los servicios de emergencia:",
        error.response || error
      );
      throw error;
    }
  },

  getServiceById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener el servicio de emergencia con ID ${id}:`,
        error.response || error
      );
      throw error;
    }
  },

  createService: async (formData) => {
    try {
      const response = await apiClient.post(`${BASE}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error al crear el servicio de emergencia:",
        error.response || error
      );
      throw error;
    }
  },

  updateService: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error al actualizar el servicio de emergencia con ID ${id}:`,
        error.response || error
      );
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error al eliminar el servicio de emergencia con ID ${id}:`,
        error.response || error
      );
      throw error;
    }
  },

  getAllByScoreDesc: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener servicios de emergencia ordenados:",
        error.response || error
      );
      throw error;
    }
  },

  dynamicFilterEmergencyServices: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      console.error(
        "Error al filtrar servicios de emergencia:",
        error.response || error
      );
      throw error;
    }
  },
};

export default emergencyService;
