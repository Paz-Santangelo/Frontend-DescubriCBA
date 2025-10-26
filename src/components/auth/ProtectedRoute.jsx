import { useUser } from "../../hooks/useUser";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = "/", 
  fallbackComponent = null 
}) => {
  const userContext = useUser();
  
  // Verificación segura del contexto
  if (!userContext) {
    console.error('❌ UserContext no está disponible en ProtectedRoute');
    return <Navigate to="/login" replace />;
  }
  
  const { user, hasRole, hasAnyRole, isLoading } = userContext;
  
  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // Si no está logueado, redirigir al login
  if (!user) {
    console.log('🚫 Usuario no autenticado, redirigiendo al login');
    return <Navigate to="/login" replace />;
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
  
  // Log para debugging
  console.log('🔐 Verificando permisos:', {
    user: user.email,
    userRole: user.role,
    requiredRole,
    hasAccess
  });
  
  // Si no tiene acceso
  if (!hasAccess) {
    console.log('🚫 Acceso denegado por rol insuficiente');
    
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Si tiene acceso, renderizar el componente
  return children;
};

export default ProtectedRoute;