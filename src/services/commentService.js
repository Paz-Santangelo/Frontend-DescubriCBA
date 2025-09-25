import apiClient from "./apiClient";

const BASE = "/comments";

// Obtener todos los comentarios
export const getAllComments = () => apiClient(`${BASE}/all`);

// Obtener todos los comentarios de un destino
export const getCommentsByDestination = (idDestination) =>
  apiClient(`${BASE}/destination/${idDestination}`);

// Obtener todos los comentarios de un usuario en un destino
export const getCommentsByUserAndDestination = (idUser, idDestination) =>
  apiClient(`${BASE}/${idUser}/${idDestination}`);

// Obtener un comentario por ID
export const getCommentById = (idComment) => apiClient(`${BASE}/${idComment}`);

// Crear un comentario
export const createComment = (commentData) =>
  apiClient(`${BASE}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

// Actualizar un comentario
export const updateComment = (idComment, commentData) =>
  apiClient(`${BASE}/update/${idComment}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

// Eliminar un comentario
export const deleteComment = (idComment) =>
  apiClient(`${BASE}/delete/${idComment}`, {
    method: "DELETE",
  });
