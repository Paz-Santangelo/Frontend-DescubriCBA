import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { ArrowLeft, House, Star, Camera, HeartPulse } from "react-bootstrap-icons";
import { useUser } from "../../hooks/useUser";
import destinationService from "../../services/DestinationService";
import "./DestinationDetail.css";

const DestinationDetail = () => {
  const { slug } = useParams(); // Ahora obtenemos el 'slug' de la URL
  const { user } = useUser();
  const isLoggedIn = user && user.role;
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinationDetail = async () => {
      // Convertimos el slug de la URL de nuevo a un formato legible (ej. "la-cumbre" -> "La Cumbre")
      const locality = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      try {
        setLoading(true);
        // Usamos el servicio que busca por localidad. Asumimos que devuelve un array.
        const data = await destinationService.getDestinationsByLocality(locality);
        if (data && data.length > 0) {
          setDestino(data[0]); // Tomamos el primer resultado para la página de detalle
        } else {
          throw new Error("No se encontró un destino para esta localidad.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "No se pudo cargar el destino.");
        console.error(`Error fetching destination for slug ${slug}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationDetail();
  }, [slug]); // Se ejecuta cada vez que el 'slug' de la URL cambia

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border" style={{ color: '#39d8a8', width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destination-detail-container">
        <Container>
          <div className="text-center alert alert-danger">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/destinos" className="btn btn-primary">
              Volver a destinos
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Si por alguna razón el destino es null después de cargar
  if (!destino) {
    return (
      <div className="destination-detail-container text-center">
        <h2>Destino no encontrado</h2>
        <p>El destino que buscas no existe o fue eliminado.</p>
        <Link to="/destinos" className="btn btn-primary">
          Volver a destinos
        </Link>
      </div>
    );
  }

  // Datos de servicios
  const servicios = [
    {
      tipo: "Dónde dormir",
      icono: <House size={48} className="service-icon" />,
      descripcion: "Hoteles, cabañas y hospedajes en la zona",
      color: "#39d8a8"
    },
    {
      tipo: "Dónde comer",
      icono: <Star size={48} className="service-icon" />,
      descripcion: "Gastronomía y restaurantes locales",
      color: "#ff6b6b"
    },
    {
      tipo: "Dónde pasear",
      icono: <Camera size={48} className="service-icon" />,
      descripcion: "Actividades y lugares para visitar",
      color: "#4ecdc4"
    },
    {
      tipo: "Emergencias",
      icono: <HeartPulse size={48} className="service-icon" />,
      descripcion: "Contactos y servicios de emergencia",
      color: "#54a0ff"
    }
  ];

  // Variantes de animación
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`destination-detail-container ${isLoggedIn ? "logged-in" : ""}`}>
      <Container>
        {/* Botón de volver */}
        <div className="back-button-container">
          <Link to="/destinos" className="back-button">
            <ArrowLeft size={20} className="me-2" />
            Volver a destinos
          </Link>
        </div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-center mb-5 section-title">
            Tu destino seleccionado es <span className="highlight">{destino.locality}</span>
          </h1>
        </motion.div>

        {/* Cards de servicios */}
        <Row className="justify-content-center">
          {servicios.map((servicio, index) => (
            <Col lg={3} md={6} key={servicio.tipo} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="service-card h-100 text-center">
                  <Card.Body className="d-flex flex-column align-items-center p-4">
                    <div 
                      className="service-icon-container mb-3"
                      style={{ color: servicio.color }}
                    >
                      {servicio.icono}
                    </div>
                    <Card.Title className="service-title">
                      {servicio.tipo}
                    </Card.Title>
                    <Card.Text className="service-description flex-grow-1">
                      {servicio.descripcion}
                    </Card.Text>
                    {/* Hacemos que el botón sea un Link dinámico */}
                    {servicio.tipo === "Dónde comer" && (
                      <Link
                        to={`/restaurantes/${destino.locality}`}
                        className="btn mt-auto service-button"
                        style={{ '--service-color': servicio.color }}
                      >
                        Ver opciones
                      </Link>
                    )}
                    {servicio.tipo === "Dónde pasear" && (
                      <Link
                        to={`/cuerpos-de-agua/${destino.locality}`}
                        className="btn mt-auto service-button"
                        style={{ '--service-color': servicio.color }}
                      >
                        Ver opciones
                      </Link>
                    )}
                    {servicio.tipo !== "Dónde comer" && servicio.tipo !== "Dónde pasear" && (
                      <Button 
                        className="mt-auto service-button"
                        style={{ '--service-color': servicio.color }}
                      >
                        Ver opciones
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default DestinationDetail;