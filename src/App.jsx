
import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
//import Registro from './pages/registro/Registro.jsx';
//import Login from './pages/login/Login.jsx';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        {/* <Registro /> */}
        {/* <Login /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
