import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import AppNavbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Registro from "./pages/registro/Registro.jsx";
import Quienes from "./pages/quienes/Quienes";
import Preguntas from "./pages/preguntas/Preguntas";
import MyProfile from "./pages/myProfile/MyProfile.jsx";
import DestinationsList from "./pages/destinationsList/DestinationsList.jsx";
import LayoutPrivado from "./layouts/LayoutPrivado.jsx";
import { UserProvider, useUser } from "./context/UserContext";
import { useState } from "react";

// Componente que contiene la lógica de las rutas y puede acceder al contexto
function AppContent() {
  const [toggled, setToggled] = useState(false);
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar setToggled={() => setToggled(!toggled)} />
        <main className="flex-grow-1">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/quienes" element={<Quienes />} />
            <Route path="/preguntas" element={<Preguntas />} />

            {/* Si el usuario NO está logueado, /destinos es pública y sin sidebar */}
            {!isLoggedIn && (
              <Route path="/destinos" element={<DestinationsList />} />
            )}

            {/* Rutas Privadas: Si el usuario SÍ está logueado, se renderizan dentro del LayoutPrivado */}
            {isLoggedIn && (
              <Route
                element={
                  <LayoutPrivado toggled={toggled} setToggled={setToggled} />
                }
              >
                <Route path="/destinos" element={<DestinationsList />} />
                <Route path="/mi-perfil" element={<MyProfile />} />
                {/* Agrega aquí cualquier otra ruta privada que necesites */}
              </Route>
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Componente principal que provee el contexto
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;