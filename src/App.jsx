/* eslint-disable react-hooks/rules-of-hooks */
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import DestinationDetail from "./pages/destinationDetail/DestinationDetail.jsx";
import ServiceListPage from "./pages/serviceListPage/ServiceListPage.jsx"; // Importamos el nuevo componente

import UserManagement from "./pages/userManagement/UserManagement.jsx";
import LayoutPrivado from "./layouts/LayoutPrivado.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import UserProvider from "./context/UserContext";
import { useUser } from "./hooks/useUser";
import { useState, useEffect } from "react";

// Componente que contiene la lógica de las rutas y puede acceder al contexto
function AppContent() {
  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useUser();

  // Verificación segura del contexto
  if (!userContext) {
    console.error("❌ UserContext no está disponible");
    return <div>Error: Contexto de usuario no disponible</div>;
  }

  const { user, isLoading } = userContext;

  // Efecto para redirigir al usuario después de iniciar sesión
  useEffect(() => {
    const isLoggedIn = user && (user.role || user.email || user.id);

    // Si el usuario acaba de iniciar sesión (isLoggedIn es true)
    // y todavía está en la página de login, lo redirigimos.
    if (isLoggedIn && location.pathname === "/login") {
      navigate("/mi-perfil", { replace: true });
    }
    // Agregamos 'user' como dependencia para que el efecto se re-evalúe cuando cambie.
  }, [user, location.pathname, navigate]);

  // Verificar si el usuario está autenticado de manera más flexible (lo usamos después de los returns)
  const isLoggedIn = user && (user.role || user.email || user.id);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* El Navbar y Footer ahora están dentro del componente que tiene acceso a las rutas */}
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
              <>
                <Route path="/destinos" element={<DestinationsList />} />
                <Route path="/destino/:slug" element={<DestinationDetail />} />
                <Route path="/servicios/:serviceType/:locality" element={<ServiceListPage />} />
              </>
            )}

            {/* Rutas Privadas: Si el usuario SÍ está logueado, se renderizan dentro del LayoutPrivado */}
            {isLoggedIn && (
              <Route
                element={
                  <LayoutPrivado toggled={toggled} setToggled={setToggled} />
                }
              >
                <Route path="/destinos" element={<DestinationsList />} />
                <Route path="/destino/:slug" element={<DestinationDetail />} />
                <Route path="/servicios/:serviceType/:locality" element={<ServiceListPage />} />
                <Route
                  path="/mi-perfil"
                  element={
                    <ProtectedRoute>
                      <MyProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Ruta solo para administradores */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <div className="container mt-5">
                        <h1>Panel de Administración</h1>
                        <p>Solo visible para administradores</p>
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* Ruta para gestión de usuarios - Solo para MANAGEMENT y ADMIN */}
                <Route
                  path="/gestion-usuarios"
                  element={
                    <ProtectedRoute requiredRole={["MANAGEMENT", "ADMIN"]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Agrega aquí cualquier otra ruta privada que necesites */}
              </Route>
            )}
          </Routes>
        </main>
        <Footer />
    </div>
  );
}

// Componente principal que provee el contexto
function App() {
  return (
    // El Router debe envolver al componente que usa los hooks de navegación (useNavigate, etc.)
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
