import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    return null;
  }

  return context;
};
