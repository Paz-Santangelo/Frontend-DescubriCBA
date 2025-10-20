import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    console.error("❌ useUser debe ser usado dentro de un UserProvider");
    return null;
  }

  return context;
};
