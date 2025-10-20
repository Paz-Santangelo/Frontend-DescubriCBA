// Hook personalizado para manejar el logout
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useUser();

  const logout = () => {
    console.log("🚪 Cerrando sesión...");

    // Limpiar contexto y localStorage
    contextLogout();

    // Redirigir al home
    navigate("/");

    console.log("✅ Sesión cerrada exitosamente");
  };

  return logout;
};
