import apiClient from "./apiClient";

const BASE = "/ratings";

// Crear o actualizar rating
export const saveOrUpdateRating = (ratingData) =>
  apiClient(`${BASE}/saveUpdate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ratingData),
  });
