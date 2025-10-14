import apiClient from "./apiClient";
import { config } from "./config";

// Servicio de autenticación con JWT
const authService = {
  
  // Función para registrar un nuevo usuario
  register: async (userData) => {
    try {
      console.log('🌐 Registrando usuario en el backend');
      console.log('📤 Datos recibidos del formulario:', userData);
      
      // El backend espera un objeto User con: name, lastname, email, password
      // Dividir el nombre completo en name y lastname
      const nombreCompleto = userData.nombre.trim();
      const partesNombre = nombreCompleto.split(' ');
      const name = partesNombre[0]; // Primer nombre
      const lastname = partesNombre.slice(1).join(' ') || 'Usuario'; // Resto como apellido
      
      const requestData = {
        name: name,
        lastname: lastname,
        email: userData.email,
        password: userData.password
      };
      
      console.log('📤 Datos formateados para el backend:', requestData);
      
      const response = await apiClient.post('/api/auth/register', requestData);
      
      console.log('📥 Response received:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: response.data || 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Manejar errores específicos del backend
      let errorMessage = 'Error al registrar usuario';
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Revisa los campos del formulario.';
        
        // Si hay detalles específicos del error
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.errors) {
            // Si hay errores de validación específicos
            const validationErrors = Object.values(error.response.data.errors).join(', ');
            errorMessage = `Errores de validación: ${validationErrors}`;
          }
        }
      } else if (error.response?.status === 409) {
        errorMessage = 'El email ya está registrado. Usa otro email o inicia sesión.';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data,
        details: {
          status: error.response?.status,
          data: error.response?.data,
          sentData: error.config?.data ? JSON.parse(error.config.data) : null
        }
      };
    }
  },

  // Función para hacer login
  login: async (loginData) => {
    try {
      console.log('🌐 Realizando login en el backend');
      console.log('📤 Datos de login enviados:', loginData);
      console.log('📡 URL del backend:', config.BACKEND_URL + '/api/auth/login');
      
      const response = await apiClient.post('/api/auth/login', loginData);
      
      console.log('📥 Respuesta completa del backend:', response);
      console.log('📥 Status code:', response.status);
      console.log('📥 Response data:', response.data);
      console.log('📥 Response headers:', response.headers);
      
      // El backend puede devolver la estructura de diferentes maneras
      let token, user;
      
      if (response.data.token && response.data.user) {
        // Formato: { token: "...", user: {...} }
        token = response.data.token;
        user = response.data.user;
      } else if (response.data.token) {
        // Formato: { token: "...", name: "...", email: "..." } (usuario en el root)
        token = response.data.token;
        user = {
          name: response.data.name || response.data.nombre,
          lastname: response.data.lastname || response.data.apellido,
          email: response.data.email,
          role: response.data.role || 'USER' // Rol por defecto
        };
      } else {
        // Si no hay token separado, buscar el formato que usa tu backend
        token = response.data.accessToken || response.data.jwt || response.data.authToken;
        user = response.data;
      }
      
      console.log('🔐 Token extraído:', token ? '✅ Presente' : '❌ No encontrado');
      console.log('👤 Usuario extraído:', user);
      
      if (token) {
        // Guardar token en localStorage
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        console.log('💾 Datos guardados en localStorage');
      }
      
      return {
        success: true,
        data: { token, user },
        message: 'Login exitoso'
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
      console.error('❌ Request config:', error.config);
      
      // Manejar errores de login específicos
      let errorMessage = 'Error en el login';
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado. ¿Te registraste con este email?';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data
      };
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

  // Función de diagnóstico para probar la conexión
  testConnection: async () => {
    try {
      console.log('🔍 Probando conexión con el backend...');
      console.log('📡 URL:', config.BACKEND_URL);
      
      // Probar un endpoint simple
      const response = await apiClient.get('/api/usuarios');
      console.log('✅ Conexión exitosa:', response.status);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error de conexión:', error.response?.status, error.message);
      return { success: false, error: error.message, status: error.response?.status };
    }
  }
};

export default authService;
