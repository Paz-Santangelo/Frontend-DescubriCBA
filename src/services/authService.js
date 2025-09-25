import apiClient from "./apiClient";

const BASE = "/auth";

// Registro de usuario
export const register = (userData) =>
  apiClient(`${BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

// Login de usuario
export const login = (loginData) =>
  apiClient(`${BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
