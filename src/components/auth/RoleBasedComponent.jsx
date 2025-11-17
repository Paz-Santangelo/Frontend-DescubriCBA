import { useUser } from "../../hooks/useUser";

/**
 * Componente para mostrar elementos condicionalmente basado en roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a mostrar si tiene permisos
 * @param {string|string[]} props.requiredRole - Rol(es) requerido(s)
 * @param {React.ReactNode} props.fallback - Contenido alternativo si no tiene permisos
 * @param {boolean} props.hideIfNoAccess - Si ocultar completamente o mostrar fallback
 */
const RoleBasedComponent = ({ 
  children, 
  requiredRole, 
  fallback = null,
  hideIfNoAccess = true 
}) => {
  const userContext = useUser();
  
  // Si no hay contexto, no mostrar nada
  if (!userContext) {
    return hideIfNoAccess ? null : fallback;
  }
  
  const { user, hasRole, hasAnyRole, isLoading } = userContext;
  
  // Mientras carga, no mostrar nada
  if (isLoading) {
    return null;
  }
  
  // Si no está logueado, no mostrar nada o fallback
  if (!user) {
    return hideIfNoAccess ? null : fallback;
  }
  
  // Verificar roles
  let hasAccess = false;
  
  if (!requiredRole) {
    // Si no se especifica rol, solo verificar que esté logueado
    hasAccess = true;
  } else if (Array.isArray(requiredRole)) {
    // Si es un array de roles, verificar que tenga al menos uno
    hasAccess = hasAnyRole(requiredRole);
  } else {
    // Si es un rol específico
    hasAccess = hasRole(requiredRole);
  }
  
  // Si no tiene acceso
  if (!hasAccess) {
    return hideIfNoAccess ? null : fallback;
  }
  
  // Si tiene acceso, mostrar el contenido
  return children;
};

export default RoleBasedComponent;