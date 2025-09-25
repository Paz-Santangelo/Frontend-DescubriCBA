import apiClient from "./apiClient";

const BASE = "/accommodations";

export const getAllAccommodations = () =>
  apiClient(`${BASE}/all`);

export const getAccommodationById = (id) =>
  apiClient(`${BASE}/${id}`);

export const createAccommodation = (formData) =>
  apiClient(`${BASE}/create`, {
    method: "POST",
    body: formData,
  });

export const updateAccommodation = (id, formData) =>
  apiClient(`${BASE}/update/${id}`, {
    method: "PUT",
    body: formData,
  });

export const deleteAccommodation = (id) =>
  apiClient(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });

export const getAccommodationsByOrderDesc = () =>
  apiClient(`${BASE}/allByOrderDescendent`);

export const filterAccommodations = ({ locality, minAverageScore, type }) => {
  const query = new URLSearchParams({ locality, minAverageScore, type });
  return apiClient(`${BASE}/dinamicFilter?${query}`);
};
