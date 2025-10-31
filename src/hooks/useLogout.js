// Hook personalizado para manejar el logout
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useUser();

  const logout = () => {
    contextLogout();
    navigate("/");
  };

  return logout;
};
