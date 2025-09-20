import "./App.css";
import AppNavbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        {/* Aca se van a agregar las rutas de las paginas */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
