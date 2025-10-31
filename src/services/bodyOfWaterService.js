import apiClient from "./apiClient";

const BASE = "/bodyOfWaters";

const bodyOfWaterService = {
  getAllBodies: async () => {
    try {
      const response = await apiClient.get(`${BASE}/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBodyById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBody: async (formData) => {
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

  updateBody: async (id, formData) => {
    try {
      const response = await apiClient.put(`${BASE}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBody: async (id) => {
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

  filterBodies: async (params) => {
    try {
      const response = await apiClient.get(`${BASE}/dinamicFilter`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bodyOfWaterService;
