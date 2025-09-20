import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../assets/Logo-Transparente.png";
import './navbar.css';

function AppNavbar() {
  const expand = "md";
  return (
    <Navbar key={expand} expand={expand} className="py-0 custom-navbar">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            src={logo}
            width="60"
            height="60"
            className="d-inline-block align-top"
            alt="DescubriCBA logo"
          />
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
              <Nav.Link href="#action2">Quiénes somos</Nav.Link>
              <Nav.Link href="#action2">Preguntas</Nav.Link>
              <Nav.Link href="#action2">Regístrate</Nav.Link>
              <Nav.Link href="#action2">Iniciar Sesión</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
