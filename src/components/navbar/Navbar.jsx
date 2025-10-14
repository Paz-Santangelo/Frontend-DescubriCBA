import { useLocation, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/Logo-DescubriCBA.png";
import "./navbar.css";
import { LayoutSidebar } from "react-bootstrap-icons";
import { useUser } from "../../hooks/useUser";
import { useLogout } from "../../hooks/useLogout";
import authService from "../../services/authService"; // Importar servicio JWT

function AppNavbar({ setToggled }) {
  const expand = "lg";
  const { user, hasRole } = useUser(); // Agregar hasRole para verificar permisos
  const location = useLocation();
  const logout = useLogout(); // Hook personalizado para logout

  // Determinar si el usuario está logueado en el sistema existente
  const isLoggedIn = user && user.role;
  
  // Verificar si hay usuario autenticado con JWT
  const isJWTAuthenticated = authService.isAuthenticated();
  
  // Función para manejar el logout
  const handleLogout = () => {
    logout(); // Usar el hook personalizado
  };

  // El botón del sidebar solo debe aparecer en las rutas que usan LayoutPrivado
  const privatePaths = ["/mi-perfil", "/destinos"];
  const showSidebarToggle = privatePaths.includes(location.pathname);

  const navbarClasses = `py-2 custom-navbar`;

  return (
    <Navbar
      key={expand}
      expand={expand}
      variant="dark"
      className={navbarClasses}
    >
      <Container fluid className="px-4">
        {showSidebarToggle && (
          <button className="sidebar-toggle-button" onClick={setToggled}>
            <LayoutSidebar size={20} />
          </button>
        )}
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="DescubriCBA logo"
          />
          <span className="navbar-brand-text">
            Descubrí<span className="brand-highlight">CBA</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              <img
                src={logo}
                width="60"
                height="60"
                className="d-inline-block align-top ms-4"
                alt="DescubriCBA logo"
              />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 fw-semibold">
              <Nav.Link as={NavLink} to="/destinos">Destinos</Nav.Link>
              <Nav.Link as={NavLink} to="/quienes">
                Quiénes somos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/preguntas">
                Preguntas
              </Nav.Link>

              {isLoggedIn ? (
                <NavDropdown
                  className="user-profile-dropdown"
                  title={
                    <img
                      src={user.image} // Usar la imagen del contexto
                      alt="User avatar"
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  }
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={NavLink} to="/mi-perfil">
                    Mi Perfil
                  </NavDropdown.Item>
                  {(hasRole('MANAGEMENT') || hasRole('ADMIN')) && (
                    <NavDropdown.Item as={NavLink} to="/gestion-usuarios">
                      Gestión de Usuarios
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/registro">
                    Regístrate
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">
                    Iniciar Sesión
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
