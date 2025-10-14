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
import DestinationDetail from "./pages/destinationDetail/DestinationDetail.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import ExamplePage from "./pages/example/ExamplePage.jsx";
import UserManagement from "./pages/userManagement/UserManagement.jsx";
import LayoutPrivado from "./layouts/LayoutPrivado.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import UserProvider from "./context/UserContext";
import { useUser } from "./hooks/useUser";
import { useState } from "react";

// Componente que contiene la lógica de las rutas y puede acceder al contexto
function AppContent() {
  const [toggled, setToggled] = useState(false);
  const userContext = useUser();
  
  // Verificación segura del contexto
  if (!userContext) {
    console.error('❌ UserContext no está disponible');
    return <div>Error: Contexto de usuario no disponible</div>;
  }
  
  const { user, isLoading } = userContext;
  
  // Verificar si el usuario está autenticado de manera más flexible
  const isLoggedIn = user && (user.role || user.email || user.id);
  
  console.log('🔍 Estado de autenticación:', {
    user,
    isLoggedIn,
    isLoading
  });

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
            
            {/* Ruta del Dashboard - Solo para usuarios autenticados */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta del Ejemplo Completo - Solo para admins */}
            <Route 
              path="/ejemplo" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ExamplePage />
                </ProtectedRoute>
              } 
            />

            {/* Si el usuario NO está logueado, /destinos es pública y sin sidebar */}
            {!isLoggedIn && (
              <>
                <Route path="/destinos" element={<DestinationsList />} />
                <Route path="/destino/:id" element={<DestinationDetail />} />
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
                <Route path="/destino/:id" element={<DestinationDetail />} />
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