import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/Logo-DescubriCBA.png";
import userAvatar from "../../assets/Alejandro.jpg";
import "./navbar.css";
import { LayoutSidebar } from "react-bootstrap-icons";

function AppNavbar({ setToggled }) {
  const expand = "lg";
  const location = useLocation();

  // Se puede cambiar a false para modificar la visualizacion de los links del navbar, segun si el usuario esta autenticado o no.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navbarClasses = `py-2 custom-navbar`;

  return (
    <Navbar
      key={expand}
      expand={expand}
      variant="dark"
      className={navbarClasses}
    >
      <Container fluid className="px-4">
        <button className="sidebar-toggle-button" onClick={setToggled}>
          <LayoutSidebar size={20} />
        </button>
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
                      src={userAvatar}
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
                  <NavDropdown.Divider />
                  <NavDropdown.Item>Cerrar Sesión</NavDropdown.Item>
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