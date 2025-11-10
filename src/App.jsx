/* eslint-disable react-hooks/rules-of-hooks */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import DestinationOptionsPage from "./pages/destinationOptionsPage/DestinationOptionsPage.jsx";
import DestinationDetailPage from "./pages/DestinationDetailPage/DestinationDetailPage.jsx"; // Import DestinationDetailPage
import ServiceListPage from "./pages/serviceListPage/ServiceListPage.jsx"; // Importamos el nuevo componente

import UserManagement from "./pages/userManagement/UserManagement.jsx";
import LayoutPrivado from "./layouts/LayoutPrivado.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import UserProvider from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationContainer from "./components/notifications/NotificationContainer";
import { useState, useEffect } from "react";
import MyPropertiesListPage from "./pages/myPropertiesListPage/MyPropertiesListPage.jsx";
import { useUser } from './hooks/useUser';

function AppContent() {
  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useUser();

  if (!userContext) {
    console.error("❌ UserContext no está disponible");
    return <div>Error: Contexto de usuario no disponible</div>;
  }

  const { user } = userContext;

  useEffect(() => {
    const isLoggedIn = user && (user.role || user.email || user.id);

    if (isLoggedIn && location.pathname === "/login") {
      navigate("/mi-perfil", { replace: true });
    }
  }, [user, location.pathname, navigate]);

 
  const isLoggedIn = user && (user.role || user.email || user.id);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NotificationContainer />
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
              <Route path="/destino/:slug" element={<DestinationOptionsPage />} />
              <Route
                path="/servicios/:serviceType/:locality"
                element={<ServiceListPage />}
              />
              <Route
                path="/destinations/:id"
                element={<DestinationDetailPage />}
              />
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
              <Route path="/destino/:slug" element={<DestinationOptionsPage />} />
              <Route
                path="/servicios/:serviceType/:locality"
                element={<ServiceListPage />}
              />
              <Route
                path="/destinations/:id"
                element={<DestinationDetailPage />}
              />
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

              {/* Ruta para Mis Propiedades - Solo para OWNER y ADMIN */}
              <Route
                path="/mis-propiedades"
                element={
                  <ProtectedRoute requiredRole={["OWNER", "MANAGEMENT", "ADMIN"]}>
                    <MyPropertiesListPage />
                  </ProtectedRoute>
                }
              />

              {/* Agrega aquí cualquier otra ruta privada que necesites */}
            </Route>
          )}

          {/* Ruta catch-all para manejar rutas no encontradas */}
          <Route 
            path="*" 
            element={
              <div className="container mt-5 text-center">
                <h2>Página no encontrada</h2>
                <p>La ruta que buscas no existe o requiere autenticación.</p>
                <a href={isLoggedIn ? "/mi-perfil" : "/login"} className="btn btn-primary">
                  {isLoggedIn ? "Ir a Mi Perfil" : "Ir a Login"}
                </a>
              </div>
            } 
          />
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
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
