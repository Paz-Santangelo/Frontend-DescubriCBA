// Configuración para el backend

export const config = {
  // 🌐 URL del backend
  BACKEND_URL: 'http://localhost:8080',
  
  // ⏱️ Timeout para peticiones
  REQUEST_TIMEOUT: 10000,
  
  // 🔧 Configuración de endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login'
    },
    USERS: {
      GET_ALL: '/api/usuarios/all',
      GET_BY_ID: '/api/usuarios/:id',
      UPDATE_PROFILE: '/api/usuarios/profile',
      UPDATE_ROLE: '/api/usuarios/:id/role'
    }
  }
};

export default config;