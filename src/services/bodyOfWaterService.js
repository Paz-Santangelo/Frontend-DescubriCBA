import apiClient from "./apiClient";

const BASE = "/bodyOfWaters";

export const getAllBodies = () => apiClient(`${BASE}/all`);

export const getBodyById = (id) => apiClient(`${BASE}/${id}`);

export const createBody = (formData) =>
  apiClient(`${BASE}/create`, {
    method: "POST",
    body: formData,
  });

export const updateBody = (id, formData) =>
  apiClient(`${BASE}/update/${id}`, {
    method: "PUT",
    body: formData,
  });

export const deleteBody = (id) =>
  apiClient(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });

export const getAllByScoreDesc = () => apiClient(`${BASE}/allByOrderDescendent`);

export const filterBodies = ({
  locality,
  minAverageScore,
  freeAdmission,
  type,
}) => {
  const query = new URLSearchParams({
    locality,
    minAverageScore,
    freeAdmission,
    type,
  });
  return apiClient(`${BASE}/dinamicFilter?${query}`);
};
