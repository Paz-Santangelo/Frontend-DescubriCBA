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
import { UserProvider } from "./context/UserContext";
import { useState } from "react";

function App() {

  const [toggled, setToggled] = useState(false);

  return (
     <UserProvider>
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar setToggled={() => setToggled(!toggled)} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/quienes" element={<Quienes />} />
            <Route path="/preguntas" element={<Preguntas />} />

            {/* Rutas privadas (con sidebar) */}
            <Route element={<LayoutPrivado toggled={toggled} setToggled={setToggled}/>}>
              <Route path="/mi-perfil" element={<MyProfile />} />
              <Route path="/destinos" element={<DestinationsList />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
