// src/context/UserContext.jsx
import { createContext, useState, useContext } from "react";
import ProfilePhoto from "../assets/Alejandro.jpg";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Alejandro",
    lastname: "Santangelo",
    email: "alejandro@example.com",
    role: "ADMIN",
    image: ProfilePhoto,
  });

  // Función opcional para cambiar el rol manualmente (ejemplo para pruebas)
  const changeRole = (newRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, changeRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
