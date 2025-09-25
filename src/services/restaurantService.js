import apiClient from "./apiClient";

const BASE = "/restaurants";

export const findAllRestaurants = () => apiClient(`${BASE}/all`);

export const findRestaurantById = (id) => apiClient(`${BASE}/${id}`);

export const createRestaurant = (formData) =>
  apiClient(`${BASE}/create`, {
    method: "POST",
    body: formData,
  });

export const updateRestaurant = (id, formData) =>
  apiClient(`${BASE}/update/${id}`, {
    method: "PUT",
    body: formData,
  });

export const deleteRestaurant = (id) =>
  apiClient(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });

export const findAllRestaurantsByOrderDescendent = () =>
  apiClient(`${BASE}/allByOrderDescendent`);

export const dinamicFilterForRestaurants = ({
  locality,
  minAverageScore,
  type,
}) => {
  const query = new URLSearchParams({ locality, minAverageScore, type });
  return apiClient(`${BASE}/dinamicFilter?${query}`);
};
