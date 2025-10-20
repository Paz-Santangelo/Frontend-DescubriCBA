import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import bodyOfWaterService from "../../services/bodyOfWaterService";
import { motion } from "framer-motion";
import { ArrowLeft, StarFill, StarHalf, Star } from "react-bootstrap-icons";
import { useUser } from "../../hooks/useUser";
import "./BodyOfWaterListPage.css";

const BodyOfWaterListPage = () => {
  const { locality } = useParams();
  const [bodiesOfWater, setBodiesOfWater] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  useEffect(() => {
    const fetchBodiesOfWater = async () => {
      if (!locality) return;

      try {
        setLoading(true);
        setError(null);
        // Usamos la función de filtro dinámico, pasando solo la localidad
        const data = await bodyOfWaterService.filterBodies({ locality });
        setBodiesOfWater(data);
      } catch (err) {
        setError("No se pudieron cargar los lugares para esta localidad.");
        console.error(`Error fetching bodies of water for ${locality}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchBodiesOfWater();
  }, [locality]);

  // Variantes de animación para las tarjetas
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

  // Función para renderizar las estrellas según el puntaje
  const renderStars = (score) => {
    const stars = [];
    const totalStars = 5;
    const roundedScore = Math.round(score * 2) / 2; // Redondea al 0.5 más cercano

    for (let i = 1; i <= totalStars; i++) {
      if (roundedScore >= i) {
        stars.push(<StarFill key={i} />);
      } else if (roundedScore >= i - 0.5) {
        stars.push(<StarHalf key={i} />);
      } else {
        stars.push(<Star key={i} />);
      }
    }
    return <div className="star-rating">{stars}</div>;
  };

  // Función para crear un "slug" amigable para la URL a partir de la localidad
  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Reemplaza espacios con -
      .replace(/[^\w\-]+/g, ""); // Elimina caracteres no válidos
  };

  const destinationSlug = createSlug(locality);

  return (
    <div
      className={`body-of-water-list-container ${
        isLoggedIn ? "logged-in" : ""
      }`}
    >
      <Container>
        <div className="back-button-container">
          <Link to={`/destino/${destinationSlug}`} className="back-button">
            <ArrowLeft size={20} className="me-2" />
            Volver a {locality}
          </Link>
        </div>

        <h1 className="text-center mb-5 section-title">
          Paseos en <span className="highlight">{locality}</span>
        </h1>

        {loading && (
          <div className="text-center">
            <Spinner
              animation="border"
              style={{ color: "#4ecdc4", width: "3rem", height: "3rem" }}
            />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && bodiesOfWater.length === 0 && (
          <div className="text-center">
            <Alert variant="info" className="d-inline-block">
              No se encontraron paseos para esta localidad.
            </Alert>
          </div>
        )}

        <Row>
          {bodiesOfWater.map((bodyOfWater) => (
            <Col md={4} key={bodyOfWater.id} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <Link to="#" className="text-decoration-none">
                  <Card className="body-of-water-card h-100">
                    <Card.Img
                      variant="top"
                      src={
                        bodyOfWater.imagesDestinations &&
                        bodyOfWater.imagesDestinations.length > 0
                          ? bodyOfWater.imagesDestinations[0].urlImage
                          : "https://via.placeholder.com/400x250"
                      }
                      className="body-of-water-card-img"
                    />
                    <div className="card-img-overlay">
                      <div className="card-overlay-content">
                        <h5 className="card-title text-white">
                          {bodyOfWater.name}
                        </h5>
                        {/* Asumimos que el objeto bodyOfWater tiene una propiedad 'averageScore' */}
                        {renderStars(bodyOfWater.averageScore)}
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

export default BodyOfWaterListPage;
