import apiClient from "./apiClient";

const BASE = "/emergencyServices";

const emergencyService = {
  getAllServices: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getServiceById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createEmergencyService: async (formData) => {
    try {
      const response = await apiClient.post(`${BASE}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // 60 segundos de timeout para esta solicitud
      });
      return response.data;
    } catch (error) {
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
      throw error;
    }
  },

  deleteEmergency: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE}/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllByScoreDesc: async () => {
    try {
      const response = await apiClient.get(`${BASE}/allByOrderDescendent`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  dynamicFilterEmergencyServices: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* Obtiene todos los tipos de servicios de emergencia. */
  getEmergencyServicesTypes: async () => {
    try {
      const response = await apiClient.get(`${BASE}/obtener/tipos`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default emergencyService;
