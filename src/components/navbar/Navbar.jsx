import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo-Transparente.png";
import './navbar.css';

function AppNavbar() {
  const expand = "md";
  return (
    <Navbar key={expand} expand={expand} variant="dark" className="py-0 custom-navbar">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            width="80"
            height="80"
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
                width="80"
                height="80"
                className="d-inline-block align-top"
                alt="DescubriCBA logo"
              />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3 fw-semibold">
              <Nav.Link href="#action1">Destinos</Nav.Link>
              <Nav.Link as={NavLink} to="/quienes">Quiénes somos</Nav.Link>
              <Nav.Link as={NavLink} to="/preguntas">Preguntas</Nav.Link>
              <Nav.Link as={NavLink} to="/registro">Regístrate</Nav.Link>
              <Nav.Link as={NavLink} to="/login">Iniciar Sesión</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
