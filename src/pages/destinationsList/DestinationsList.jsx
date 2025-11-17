/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../hooks/useUser";
import { useNotification } from "../../context/NotificationContext"; // Importar hook de notificación
import { Container, Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import destinationService from "../../services/DestinationService";
import PaginationComponent from "../../components/pagination/PaginationComponent";
import "./destinationsList.css";

const DestinationsList = () => {
  const { user } = useUser();
  const { addNotification } = useNotification(); // Usar hook de notificación
  const isLoggedIn = user && user.role;

  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6; // 1 fila de 3 cards para mostrar la paginación

  const fetchDestinations = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      let cardsData;

      if (term.trim() === "") {
        // Si la búsqueda está vacía, obtiene todos los destinos
        cardsData = await destinationService.getAllDestinationCards();
      } else {
        // Si hay un término de búsqueda, llama a la nueva función
        cardsData = await destinationService.getDestinationsByLocality(term);
      }
      setDestinos(cardsData);
      setCurrentPage(1); // Resetear a la primera página con cada nueva búsqueda
    } catch (err) {
      const errorMessage = "No se pudieron cargar los destinos. El servicio podría no estar disponible.";
      setError(errorMessage);
      addNotification(errorMessage, "danger"); // Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDestinations(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchDestinations]);

  // Lógica para paginación del lado del cliente
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentDestinos = destinos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Función para crear un "slug" amigable para la URL a partir de la localidad
  const createSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  // Imagen de placeholder en base64 (un cuadrado verde con texto)
  const getPlaceholderImage = (text) => {
    // SVG simple como placeholder
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#39d8a8"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
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

        <Row className="justify-content-center my-5">
          <Col md={7} lg={5}>
            <InputGroup className="search-input-group">
              <InputGroup.Text id="search-icon">
                <Search color="#39d8a8" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Buscar por localidad (ej: La Falda, Córdoba...)"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-describedby="search-icon"
              />
            </InputGroup>
          </Col>
        </Row>

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
          {currentDestinos.map((destino, index) => (
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
                      src={destino.imageUrl || getPlaceholderImage(destino.locality)}
                      alt={destino.locality}
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

        {!loading && !error && destinos.length > ITEMS_PER_PAGE && (
          <div className="d-flex justify-content-center mt-4">
            <PaginationComponent
              totalItems={destinos.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default DestinationsList;
