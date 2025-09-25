const API_URL = "http://localhost:8080"; 

async function apiClient(endpoint, { method = "GET", body, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      ...headers,
    },
  };

  // Si es un JSON
  if (body && !(body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    config.body = body; // fetch maneja automáticamente FormData
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Si la respuesta es JSON (ok o error)
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      const errorData = isJson ? await response.json() : { message: response.statusText };
      return { data: null, error: errorData };
    }

    return { data: isJson ? await response.json() : null, error: null };

  } catch (err) {
    // Error de red o de conexión
    return { data: null, error: { message: "No se pudo conectar al servidor." } };
  }
}

export default apiClient;
