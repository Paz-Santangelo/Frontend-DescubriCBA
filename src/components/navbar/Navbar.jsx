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

function AppNavbar({ setToggled }) {
  const expand = "lg";
  const { user, canManageUsers } = useUser();
  const location = useLocation();
  const logout = useLogout();

  // Determinar si el usuario está logueado en el sistema existente
  const isLoggedIn = user && user.role;

  // Función para manejar el logout
  const handleLogout = () => {
    logout();
  };

  // El botón del sidebar solo debe aparecer en las rutas que usan LayoutPrivado
  // y cuando el usuario está logueado.
  const privatePaths = [
    "/mi-perfil",
    "/destinos",
    "/destino",   // Para que aparezca en /destino/:slug
    "/servicios", // Para que aparezca en las páginas de servicios
    "/gestion-usuarios", // Para que aparezca en la gestión de usuarios
  ];
  const showSidebarToggle = isLoggedIn && privatePaths.some(path => location.pathname.startsWith(path));

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
              <Nav.Link as={NavLink} to="/destinos">
                Destinos
              </Nav.Link>
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
                    // Si el usuario tiene una imagen, la mostramos. Si no, un ícono de Bootstrap.
                    user.imageUser && user.imageUser.urlImage ? (
                      <img
                        src={user.imageUser.urlImage}
                        alt={user.name || "User avatar"}
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "2rem" }}
                      ></i>
                    )
                  }
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={NavLink} to="/mi-perfil">
                    Mi Perfil
                  </NavDropdown.Item>
                  {canManageUsers() && (
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
