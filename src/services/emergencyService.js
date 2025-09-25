import apiClient from "./apiClient";

const BASE = "/emergencyServices";

export const getAllServices = () => apiClient(`${BASE}/all`);

export const getServiceById = (id) => apiClient(`${BASE}/${id}`);

export const createService = (formData) =>
  apiClient(`${BASE}/create`, {
    method: "POST",
    body: formData,
  });

export const updateService = (id, formData) =>
  apiClient(`${BASE}/update/${id}`, {
    method: "PUT",
    body: formData,
  });

export const deleteService = (id) =>
  apiClient(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });

export const getAllByScoreDesc = () =>
  apiClient(`${BASE}/allByOrderDescendent`);

export const getByDynamicFilter = ({ locality, minAverageScore, type }) => {
  const query = new URLSearchParams({ locality, minAverageScore, type });
  return apiClient(`${BASE}/dinamicFilter?${query}`);
};
