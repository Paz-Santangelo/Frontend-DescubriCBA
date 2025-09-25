// src/services/userService.js
import apiClient from "./apiClient";

const BASE = "/users";

// Obtener todos los usuarios
export const getAllUsers = () => apiClient(`${BASE}/all`);

// Obtener usuario por ID
export const getUserById = (id) => apiClient(`${BASE}/${id}`);

// Obtener usuario por email
export const getUserByEmail = (email) =>
  apiClient(`${BASE}/findByEmail/${email}`);

// Eliminar usuario por ID
export const deleteUser = (id) =>
  apiClient(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });

// Actualizar datos de usuario (con imagen opcional)
export const updateUser = (
  idUser,
  { image, name, lastname, email, password }
) => {
  const formData = new FormData();
  if (image) formData.append("image", image);
  if (name) formData.append("name", name);
  if (lastname) formData.append("lastname", lastname);
  if (email) formData.append("email", email);
  if (password) formData.append("password", password);

  return apiClient(`${BASE}/update/${idUser}`, {
    method: "PUT",
    body: formData,
  });
};

// Actualizar rol del usuario
export const updateUserRole = (idUser, newRole) => {
  const formData = new FormData();
  formData.append("newRole", newRole);

  return apiClient(`${BASE}/updateRole/${idUser}`, {
    method: "PUT",
    body: formData,
  });
};

// Buscar usuarios por nombre o apellido
export const searchUsers = (query) =>
  apiClient(`${BASE}/search?query=${encodeURIComponent(query)}`);
