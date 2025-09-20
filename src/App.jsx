import "./App.css";
import AppNavbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './pages/home/Home.jsx';
//import Registro from './pages/registro/Registro';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        {/* Aca se van a agregar las rutas de las paginas */}
        <Home />
        {/* <Registro /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
