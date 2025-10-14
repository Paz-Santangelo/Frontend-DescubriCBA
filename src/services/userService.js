import apiClient from "./apiClient";
import { config } from "./config";

// Servicio para manejar operaciones relacionadas con usuarios
const userService = {
  
  // Función para obtener todos los usuarios (requiere autenticación)
  getAllUsers: async () => {
    try {
      console.log('🌐 Obteniendo usuarios del backend');
      console.log('📡 URL del endpoint:', config.BACKEND_URL + '/api/usuarios/all');
      console.log('📡 Token en localStorage:', localStorage.getItem('jwt_token') ? '✅ Presente' : '❌ No encontrado');
      
      const response = await apiClient.get('/api/usuarios/all');
      
      console.log('📥 Respuesta del backend:', response);
      console.log('📥 Status:', response.status);
      console.log('📥 Data:', response.data);
      console.log('📥 Data type:', typeof response.data);
      console.log('📥 Is Array:', Array.isArray(response.data));
      
      // Verificar que response.data sea un array
      let userData = response.data;
      
      // Si no es un array, intentar extraer usuarios de diferentes estructuras
      if (!Array.isArray(userData)) {
        console.log('⚠️ Los datos no son un array, intentando extraer...');
        
        if (userData && userData.users) {
          userData = userData.users;
        } else if (userData && userData.data) {
          userData = userData.data;
        } else if (userData && userData.content) {
          userData = userData.content; // Para paginación de Spring Boot
        } else {
          userData = [userData]; // Envolver en array si es un solo objeto
        }
        
        console.log('📥 Datos procesados:', userData);
      }
      
      return {
        success: true,
        data: userData,
        message: 'Usuarios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al obtener usuarios';
      
      if (error.response?.status === 401) {
        errorMessage = 'No tienes permisos para acceder a esta información. ¿Estás logueado?';
      } else if (error.response?.status === 403) {
        errorMessage = 'Acceso denegado. Tu rol no tiene permisos suficientes.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica la URL del backend.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Contacta al administrador.';
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (error.message.includes('Token')) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: error.response?.data?.message || errorMessage,
        error: error.response?.data || error.message,
        debug: {
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      };
    }
  },

  // Función para obtener un usuario específico por ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/usuarios/${userId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Usuario obtenido exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener usuario',
        error: error.response?.data
      };
    }
  },

  // Función para actualizar perfil de usuario
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/api/usuarios/profile', userData);
      
      // Actualizar datos del usuario en localStorage si es exitoso
      if (response.data) {
        localStorage.setItem('user_data', JSON.stringify(response.data));
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil',
        error: error.response?.data
      };
    }
  },

  // Función para actualizar el rol de un usuario
  updateUserRole: async (userId, newRole) => {
    try {
      console.log('🔄 Actualizando rol de usuario en el backend');
      console.log(`👤 Usuario ID: ${userId}, Nuevo rol: ${newRole}`);
      
      // Validaciones básicas
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }
      
      if (!newRole) {
        throw new Error('Nuevo rol requerido');
      }
      
      // Validar nuevo rol
      const validRoles = ['USER', 'CLIENTE', 'MANAGEMENT', 'ADMIN'];
      if (!validRoles.includes(newRole)) {
        return {
          success: false,
          message: 'Rol inválido. Roles válidos: ' + validRoles.join(', ')
        };
      }
      
      // Llamar al endpoint real del backend
      const response = await apiClient.put(`/api/usuarios/${userId}/role`, {
        role: newRole
      });
      
      console.log('✅ Respuesta del servidor:', response);
      console.log('📊 Status:', response.status);
      console.log('📄 Data:', response.data);
      
      // Verificar que la respuesta sea exitosa
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: response.data || { id: userId, role: newRole },
          message: `Rol actualizado a ${newRole} exitosamente`
        };
      } else {
        return {
          success: false,
          message: `Error del servidor: ${response.status}`,
          data: response.data
        };
      }
      
    } catch (error) {
      console.error('❌ Error al actualizar rol:', error);
      
      // Manejo detallado de errores
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || 'Error del servidor';
        
        switch (status) {
          case 400:
            return {
              success: false,
              message: 'Datos inválidos: ' + errorMessage
            };
          case 401:
            return {
              success: false,
              message: 'No autorizado. Inicia sesión nuevamente.'
            };
          case 403:
            return {
              success: false,
              message: 'No tienes permisos para cambiar roles'
            };
          case 404:
            return {
              success: false,
              message: 'Usuario no encontrado'
            };
          default:
            return {
              success: false,
              message: `Error del servidor (${status}): ${errorMessage}`
            };
        }
      } else if (error.request) {
        return {
          success: false,
          message: 'No se pudo conectar con el servidor. Verifica tu conexión.'
        };
      } else {
        return {
          success: false,
          message: 'Error al procesar la solicitud: ' + error.message
        };
      }
    }
  }
};

export default userService;