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
        const token = localStorage.getItem("jwt_token");
        const userData = localStorage.getItem("user_data");

        console.log("🔍 Verificando localStorage:", {
          token: token ? "✅ Presente" : "❌ No encontrado",
          userData,
        });

        if (
          token &&
          userData &&
          userData !== "undefined" &&
          userData !== "null"
        ) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          console.log("🚫 No hay sesión válida para restaurar");
        }
      } catch (error) {
        console.error("❌ Error al restaurar sesión:", error);
        console.log("🧹 Limpiando localStorage corrupto");
        // Limpiar datos corruptos
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  // Función para hacer login en el sistema
  const login = (userDto) => {
    // Imprimimos el DTO completo que llega del backend, como solicitaste.
    //console.log('✅ Login exitoso. DTO del usuario recibido del backend:', userDto);

    // Tu backend devuelve 'token', no 'accessToken'. Hacemos la desestructuración correcta.
    const { token, ...userData } = userDto;

    console.log("Datos guardados en el contexto:", userData);

    if (token) {
      // Guardar el token y los datos del usuario en localStorage
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));
      // Actualizar el estado global de la aplicación
      setUser(userData);
    } else {
      console.error(
        "❌ No se encontró el token en la respuesta del login:",
        userDto
      );
    }
  };

  // Función para hacer logout en el sistema
  const logout = () => {
    //console.log('🚪 Cerrando sesión');
    setUser(null);
    // Limpiar localStorage
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
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
    USER: "USER",
    OWNER: "OWNER", // Añadido para consistencia
    MANAGEMENT: "MANAGEMENT",
    ADMIN: "ADMIN",
  };

  // Función para verificar roles
  const hasRole = (requiredRole) => {
    if (!user) return false;

    const userRole = user.role?.toUpperCase();

    // 1. El rol ADMIN tiene acceso a todo.
    if (userRole === ROLES.ADMIN) return true;

    // 2. El rol MANAGEMENT tiene acceso a sus permisos y a los de OWNER y USER.
    if (userRole === ROLES.MANAGEMENT) {
      return [ROLES.MANAGEMENT, ROLES.OWNER, ROLES.USER].includes(
        requiredRole.toUpperCase()
      );
    }

    // 3. El rol OWNER tiene acceso a sus permisos y a los de USER.
    if (userRole === ROLES.OWNER) {
      return [ROLES.OWNER, ROLES.USER].includes(requiredRole.toUpperCase());
    }

    // 4. Para el resto, se comprueba la coincidencia exacta.
    return userRole === requiredRole.toUpperCase();
  };

  // Función para verificar si el usuario tiene al menos uno de varios roles
  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    // La función some se detiene en cuanto encuentra una coincidencia.
    return roles.some((role) => user.role.toUpperCase() === role.toUpperCase());
  };

  // Funciones específicas para cada rol (más claras que hasRole)
  const isAdmin = () => user?.role?.toUpperCase() === ROLES.ADMIN;
  const isManagement = () => user?.role?.toUpperCase() === ROLES.MANAGEMENT;
  const isOwner = () => user?.role?.toUpperCase() === ROLES.OWNER;
  const isUser = () => user?.role?.toUpperCase() === ROLES.USER;

  // Función para verificar si puede gestionar usuarios (solo un lugar para esta lógica)
  const canManageUsers = () => {
    if (!user || !user.role) return false;
    const userRole = user.role.toUpperCase();
    return userRole === ROLES.ADMIN || userRole === ROLES.MANAGEMENT;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        changeRole,
        login,
        logout,
        loginAsAdmin,
        isLoading,
        hasRole, // Aún disponible para lógica jerárquica compleja
        hasAnyRole, // Mejor para comprobaciones de "es uno de estos"
        isAdmin,
        isManagement,
        isOwner,
        isUser,
        canManageUsers, // Lógica de negocio encapsulada
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
export default UserProvider;
