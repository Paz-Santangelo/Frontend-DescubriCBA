import { motion } from "framer-motion";
import "./ServiceListPage.css"; // Usaremos un CSS unificado
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { ArrowLeft, StarFill, StarHalf, Star } from "react-bootstrap-icons";
import { useUser } from "../../hooks/useUser";

// Importar todos los servicios necesarios
import accommodationService from "../../services/accommodationService";
import restaurantService from "../../services/restaurantService";
import bodyOfWaterService from "../../services/bodyOfWaterService";
import emergencyService from "../../services/emergencyService";

// Mapeo de configuración para cada tipo de servicio
const serviceConfig = {
  alojamientos: {
    fetchData: (params) => accommodationService.filterAccommodations(params),
    title: "Alojamientos",
    notFoundMessage: "No se encontraron alojamientos para esta localidad.",
    color: "#39d8a8",
  },
  restaurantes: {
    fetchData: (params) =>
      restaurantService.dinamicFilterForRestaurants(params),
    title: "Restaurantes",
    notFoundMessage: "No se encontraron restaurantes para esta localidad.",
    color: "#ff6b6b",
  },
  "cuerpos-de-agua": {
    fetchData: (params) => bodyOfWaterService.filterBodies(params),
    title: "Paseos",
    notFoundMessage: "No se encontraron paseos para esta localidad.",
    color: "#4ecdc4",
  },
  emergencias: {
    fetchData: (params) =>
      emergencyService.dynamicFilterEmergencyServices(params),
    title: "Emergencias",
    notFoundMessage: "No se encontraron emergencias para esta localidad.",
    color: "#54a0ff",
  },
};

const ServiceListPage = () => {
  const { serviceType, locality } = useParams(); // Obtenemos ambos parámetros de la URL
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  const config = serviceConfig[serviceType];

  // Convertimos el slug de la URL a un formato legible para mostrar y para la API
  // ej: "la-cumbre" -> "La Cumbre"
  const formattedLocality = locality
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    const fetchItems = async () => {
      if (!locality || !config) {
        setError("Tipo de servicio no válido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await config.fetchData({ locality: formattedLocality }); // Usamos la localidad formateada
        setItems(data);
      } catch (err) {
        setError(
          `No se pudieron cargar los ${config.title.toLowerCase()} para esta localidad.`
        );
        console.error(
          `Error fetching ${serviceType} for ${formattedLocality}:`,
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [locality, serviceType, config, formattedLocality]);

  // Variantes de animación para las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Función para renderizar las estrellas según el puntaje
  const renderStars = (score) => {
    const stars = [];
    const totalStars = 5;
    const roundedScore = Math.round((score || 0) * 2) / 2;

    for (let i = 1; i <= totalStars; i++) {
      if (roundedScore >= i) stars.push(<StarFill key={i} />);
      else if (roundedScore >= i - 0.5) stars.push(<StarHalf key={i} />);
      else stars.push(<Star key={i} />);
    }
    return <div className="star-rating">{stars}</div>;
  };

  // Función para crear un "slug" amigable para la URL
  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const destinationSlug = createSlug(locality);

  if (!config) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          El tipo de servicio solicitado no existe.
        </Alert>
      </Container>
    );
  }

  return (
    <div className={`service-list-container ${isLoggedIn ? "logged-in" : ""}`}>
      <Container>
        <div className="back-button-container">
          <Link
            to={`/destino/${destinationSlug}`}
            className="back-button"
            style={{ "--service-color": config.color }}
          >
            <ArrowLeft size={20} className="me-2" />
            Volver a {formattedLocality}
          </Link>
        </div>

        <h1 className="text-center mb-5 section-title">
          {config.title} en{" "}
          <span className="highlight">{formattedLocality}</span>
        </h1>

        {loading && (
          <div className="text-center">
            <Spinner
              animation="border"
              style={{ color: "#39d8a8", width: "3rem", height: "3rem" }}
            />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && items.length === 0 && (
          <div className="text-center">
            <Alert variant="info" className="d-inline-block">
              {config.notFoundMessage}
            </Alert>
          </div>
        )}

        <Row>
          {items.map((item) => (
            <Col md={4} key={item.id} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <Link
                  to={`/destinations/${item.id}`}
                  className="text-decoration-none"
                  state={{
                    fromLink: `/servicios/${serviceType}/${destinationSlug}`,
                    fromTitle: config.title,
                    fromColor: config.color,
                  }}
                >
                  <Card className="service-card h-100">
                    <Card.Img
                      variant="top"
                      src={
                        item.imagesDestinations?.[0]?.urlImage ||
                        "https://via.placeholder.com/400x250"
                      }
                      className="service-card-img"
                    />
                    <div className="card-img-overlay">
                      <div className="card-overlay-content">
                        <h5 className="card-title text-white">{item.name}</h5>
                        {renderStars(item.averageScore)}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ServiceListPage;
