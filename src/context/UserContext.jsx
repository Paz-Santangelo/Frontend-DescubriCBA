// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import ProfilePhoto from "../assets/Alejandro.jpg";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Usuario inicia como null (no autenticado)
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar la app
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const userData = localStorage.getItem('user_data');
        
        console.log('🔍 Verificando localStorage:', { token: token ? '✅ Presente' : '❌ No encontrado', userData });
        
        if (token && userData && userData !== 'undefined' && userData !== 'null') {
          const parsedUser = JSON.parse(userData);
          console.log('🔄 Restaurando sesión:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('🚫 No hay sesión válida para restaurar');
        }
      } catch (error) {
        console.error('❌ Error al restaurar sesión:', error);
        console.log('🧹 Limpiando localStorage corrupto');
        // Limpiar datos corruptos
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  // Función para hacer login en el sistema
  const login = (userData) => {
    console.log('🔐 Login exitoso, actualizando contexto:', userData);
    setUser(userData);
  };

  // Función para hacer logout en el sistema
  const logout = () => {
    console.log('🚪 Cerrando sesión');
    setUser(null);
    // Limpiar localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  };

  // Función opcional para cambiar el rol manualmente (ejemplo para pruebas)
  const changeRole = (newRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
  };

  // Función para simular login de administrador (para pruebas)
  const loginAsAdmin = () => {
    setUser({
      name: "Alejandro",
      lastname: "Santangelo", 
      email: "alejandro@example.com",
      role: "",
      image: ProfilePhoto,
    });
  };

  // Definir los roles disponibles en el sistema
  const ROLES = {
    USER: 'USER',
    MANAGEMENT: 'MANAGEMENT', 
    ADMIN: 'ADMIN',
    CLIENTE: 'CLIENTE'
  };

  // Función para verificar roles
  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Si no hay rol específico requerido, solo verificar que esté logueado
    if (!requiredRole) return true;
    
    const userRole = user.role?.toUpperCase();
    const required = requiredRole.toUpperCase();
    
    // Admin tiene acceso a todo
    if (userRole === ROLES.ADMIN) return true;
    
    // Management puede acceder a funciones de USER y CLIENTE
    if (userRole === ROLES.MANAGEMENT && 
        (required === ROLES.USER || required === ROLES.CLIENTE || required === ROLES.MANAGEMENT)) {
      return true;
    }
    
    // Verificar rol específico
    return userRole === required;
  };

  // Función para verificar si el usuario tiene al menos uno de varios roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.some(role => hasRole(role));
  };

  // Funciones específicas para cada rol
  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isManagement = () => hasRole(ROLES.MANAGEMENT);
  const isUser = () => hasRole(ROLES.USER);
  const isCliente = () => hasRole(ROLES.CLIENTE);
  
  // Función para verificar si puede gestionar roles (ADMIN o MANAGEMENT)
  const canManageRoles = () => isAdmin() || isManagement();

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      changeRole, 
      login, 
      logout, 
      loginAsAdmin,
      isLoading,
      hasRole,
      hasAnyRole,
      isAdmin,
      isUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
export default UserProvider;
