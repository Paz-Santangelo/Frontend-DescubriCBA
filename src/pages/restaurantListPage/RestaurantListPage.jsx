import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import restaurantService from "../../services/restaurantService";
import { motion } from "framer-motion";
import { ArrowLeft, StarFill, StarHalf, Star } from "react-bootstrap-icons";
import { useUser } from "../../hooks/useUser";
import "./RestaurantListPage.css";

const RestaurantListPage = () => {
  const { locality } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const { user } = useUser();
  const isLoggedIn = user && user.role;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!locality) return;

      try {
        setLoading(true);
        setError(null);
        const data = await restaurantService.dinamicFilterForRestaurants({
          locality,
        });
        setRestaurants(data);
      } catch (err) {
        setError("No se pudieron cargar los restaurantes para esta localidad.");
        console.error(`Error fetching restaurants for ${locality}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
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
    const roundedScore = Math.round(score * 2) / 2;

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
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  const destinationSlug = createSlug(locality);

  return (
    <div
      className={`restaurant-list-container ${isLoggedIn ? "logged-in" : ""}`}
    >
      <Container>
        <div className="back-button-container">
          <Link to={`/destino/${destinationSlug}`} className="back-button">
            <ArrowLeft size={20} className="me-2" />
            Volver a {locality}
          </Link>
        </div>

        <h1 className="text-center mb-5 section-title">
          Restaurantes en <span className="highlight">{locality}</span>
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

        {!loading && !error && restaurants.length === 0 && (
          <div className="text-center">
            <Alert variant="info" className="d-inline-block">
              No se encontraron restaurantes para esta localidad.
            </Alert>
          </div>
        )}

        <Row>
          {restaurants.map((restaurant) => (
            <Col md={4} key={restaurant.id} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                {/* En el futuro, este Link podría llevar al detalle del restaurante */}
                <Link to="#" className="text-decoration-none">
                  <Card className="restaurant-card h-100">
                    <Card.Img
                      variant="top"
                      src={
                        restaurant.imagesDestinations &&
                        restaurant.imagesDestinations.length > 0
                          ? restaurant.imagesDestinations[0].urlImage
                          : "https://via.placeholder.com/400x250"
                      }
                      className="restaurant-card-img"
                    />
                    <div className="card-img-overlay">
                      <div className="card-overlay-content">
                        <h5 className="card-title text-white">
                          {restaurant.name}
                        </h5>
                        {renderStars(restaurant.averageScore)}
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

export default RestaurantListPage;
