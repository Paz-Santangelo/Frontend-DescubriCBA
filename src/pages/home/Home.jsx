import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./home.css";
import Champaqui from "../../assets/Cerro-Champaqui.jpg";
import Calamuchita from "../../assets/Valle-Calamuchita.jpg";
import Uritorco from "../../assets/Cerro-Uritorco.jpg";
import IconoMapa from "../../assets/icono-mapa.png";
import IconoEstrellas from "../../assets/icono-estrellas.png";
import IconoCalendario from "../../assets/icono-calendario.png";
import Testimonials from "../../components/testimonials/Testimonials";

const Home = () => {
  return (
    <>
      <div className="hero-container">
        <video
          className="hero-video"
          src="https://res.cloudinary.com/dnw0mx8qr/video/upload/v1758398585/VideoHero-DescubriCBA-Comprimido_p6yydu.mp4"
          autoPlay
          loop
          muted
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Descubrí la <span className="highlight">magia de Córdoba</span>
            </h1>
            <p>
              Tu <span className="highlight">aventura</span> comienza aquí
            </p>
            <Button
              variant="outline-light"
              size="lg"
              className="mt-4 hero-button"
            >
              Explorá destinos
            </Button>
          </div>
        </div>
      </div>

      <section className="destinos-destacados-section">
        <Container>
          <h1 className="text-center my-4 fw-semibold section-title">Destinos destacados</h1>
          <Row>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={Champaqui} />
                <div className="card-img-overlay">
                  <h5 className="card-title text-white card-overlay-content">Cerro Champaquí</h5>
                </div>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={Calamuchita} />
                <div className="card-img-overlay">
                  <h5 className="card-title text-white card-overlay-content">Valle de Calamuchita</h5>
                </div>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={Uritorco} />
                <div className="card-img-overlay">
                  <h5 className="card-title text-white card-overlay-content">Cerro Uritorco</h5>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="beneficios-section">
        <Container>
          <h1 className="text-center my-4 fw-semibold section-title">Beneficios para vos</h1>
          <Row className="justify-content-center">
            <Col md={4} className="mb-4">
              <Card className="text-center p-3">
                <Card.Img variant="top" src={IconoMapa} className="benefit-icon mx-auto d-block" />
                <Card.Body>
                  <Card.Title>Todo en un solo lugar</Card.Title>
                  <Card.Text>
                    Encuentra todos los destinos, actividades y servicios de Córdoba en un solo lugar.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center p-3">
                <Card.Img variant="top" src={IconoEstrellas} className="benefit-icon mx-auto d-block" />
                <Card.Body>
                  <Card.Title>Experiencias reales</Card.Title>
                  <Card.Text>
                    Opiniones y experiencias de viajeros reales para que elijas lo mejor.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center p-3">
                <Card.Img variant="top" src={IconoCalendario} className="benefit-icon mx-auto d-block" />
                <Card.Body>
                  <Card.Title>Planificá fácil</Card.Title>
                  <Card.Text>
                    Herramientas sencillas para organizar tu itinerario y reservar sin complicaciones.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Testimonials />

      <section className="cta-section text-center">
        <Container>
          <h2 className="cta-title">Creá tu cuenta y empezá a planificar tu viaje</h2>
          <Button as={Link} to="/registro" variant="primary" size="lg" className="cta-button">Regístrate gratis</Button>
        </Container>
      </section>
    </>
  );
};

export default Home;