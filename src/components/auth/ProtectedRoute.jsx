import { useUser } from "../../hooks/useUser";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = "*", 
  fallbackComponent = null 
}) => {
  const userContext = useUser();
  const location = useLocation(); // 1. Obtenemos la ubicación actual
  
  // Verificación segura del contexto
  if (!userContext) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verificar roles
  let hasAccess = false;
  
  if (!requiredRole) {
    hasAccess = true;
  } else if (Array.isArray(requiredRole)) {
    hasAccess = hasAnyRole(requiredRole);
  } else {
    hasAccess = hasRole(requiredRole);
  }
    
  // Si no tiene acceso
  if (!hasAccess) {    
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Si tiene acceso, renderizar el componente
  return children;
};

export default ProtectedRoute;