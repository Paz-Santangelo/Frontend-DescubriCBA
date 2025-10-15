import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import destinationService from "../../services/DestinationService";
import "./destinationsList.css";

const DestinationsList = () => {
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinationCards = async () => {
      try {
        setLoading(true);
        const cardsData = await destinationService.getAllDestinationCards();
        setDestinos(cardsData);
      } catch (err) {
        setError(
          "No se pudieron cargar los destinos. Inténtalo de nuevo más tarde."
        );
        console.error("Error fetching destination cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationCards();
  }, []);

  // Función para crear un "slug" amigable para la URL a partir de la localidad
  const createSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Reemplaza espacios con -
      .replace(/[^\w\-]+/g, '');      // Elimina caracteres no válidos
  };

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
    <div className={`destinations-container ${isLoggedIn ? "logged-in" : ""}`}>
      <Container>
        <h1 className="text-center fw-semibold section-title">
          Seleccione un Destino
        </h1>

        {loading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <div
              className="spinner-border"
              style={{ color: "#39d8a8", width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && !error && destinos.length === 0 && (
          <div className="alert alert-info text-center">
            No hay destinos disponibles en este momento.
          </div>
        )}

        <Row>
          {destinos.map((destino, index) => (
            <Col md={4} key={destino.id} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/destino/${createSlug(destino.locality)}`}
                  className="text-decoration-none"
                >
                  <Card className="destination-card h-100">
                    <Card.Img
                      variant="top"
                      src={destino.imageUrl}
                      className="destination-card-img"
                    />
                    <div className="card-img-overlay">
                      <h5 className="card-title text-white card-overlay-content">
                        {destino.locality}
                      </h5>
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

export default DestinationsList;
