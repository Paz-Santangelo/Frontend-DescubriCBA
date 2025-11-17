import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Twitter } from "react-bootstrap-icons";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="gy-4">
          <Col xs={12} md={4} className="text-center text-md-start">
            <h6>DescubríCBA</h6>
            <p>© 2025 DescubríCBA. Todos los derechos reservados.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <h6>Contacto</h6>
            <p>Email: info@descubricba.com</p>
            <p>Teléfono: +54 9 351 123 4567</p>
          </Col>
          <Col xs={12} md={4} className="text-center text-md-end">
            <h6>Redes Sociales</h6>
            <a
              href="https://www.facebook.com/turismocba/?locale=es_LA"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </a>
            <a
              href="https://www.instagram.com/turismocba/?hl=es"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </a>
            <a
              href="https://x.com/turismocba/highlights"
              className="social-link me-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </a>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <a href="#" className="legal-link">
              Términos y Condiciones
            </a>
            <span className="mx-2">|</span>
            <a href="#" className="legal-link">
              Política de Privacidad
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
