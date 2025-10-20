import apiClient from "./apiClient";

// Servicio de autenticación con JWT
const authService = {
  
  // Función para registrar un nuevo usuario
  register: async (userData) => {
    try {      
      
      // El backend espera 'name' y 'lastname', así que mapeamos los campos.
      const requestData = {
        name: userData.nombre,
        lastname: userData.apellido,
        email: userData.email,
        password: userData.password
      };
      
      // Hacemos la petición y si es exitosa, el backend devuelve un string "Usuario registrado con éxito."
      const response = await apiClient.post('/api/auth/register', requestData);
      
      // Devolvemos directamente los datos de la respuesta exitosa.
      return response.data;

    } catch (error) {
      throw error;
    }
  },

  // Función para hacer login
  login: async (loginData) => {
    try {
      const response = await apiClient.post('/api/auth/login', loginData);
      
      // En caso de éxito, el backend devuelve un UserDTO con el token y los datos del usuario.
      // Simplemente devolvemos este objeto.
      return response.data;

    } catch (error) {
      // Si hay un error (ej. 401 BadCredentials), no lo manejamos aquí.
      // Lo relanzamos para que el componente (LoginForm) lo capture.
      // El objeto 'error' de axios ya contiene el mensaje del backend en `error.response.data.message`.
      throw error;
    }
  },

  // Función para cerrar sesión
  logout: () => {
    // Limpiar datos del localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  },

  // Función para verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;
    
    // Para backend real, por ahora solo verificar si existe el token
    return !!token;
  },

  // Función para obtener el token actual
  getToken: () => {
    return localStorage.getItem('jwt_token');
  },

  // Función para obtener los datos del usuario actual
  getCurrentUser: () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    
    // Obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};

export default authService;
