/* eslint-disable no-unused-vars */
import "../serviceListPage/ServiceListPage.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import {
  StarFill,
  StarHalf,
  Star,
  PlusCircleFill,
} from "react-bootstrap-icons";
import { useUser } from "../../hooks/useUser";
import { Link } from "react-router-dom";
import PropertyFormModal from "../../components/propertyFormModal/PropertyFormModal";

const MyPropertiesListPage = () => {
  const { user, refreshUser } = useUser();
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const properties = user?.ownedDestinations || [];

  const handleCloseModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const handleUpdateSuccess = async () => {
    await refreshUser();
    handleCloseModal();
  };

  // Variante para cada tarjeta individual
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

  return (
    <div className="service-list-container logged-in">
      <Container>
        {/* Título centrado */}
        <h1 className="text-center mb-4 section-title">Mis Propiedades</h1>

        {/* Botón alineado a la derecha */}
        <div className="text-end mb-5">
          <Button
            className="back-button"
            style={{ "--service-color": "#39d8a8" }}
            onClick={() => {
              setSelectedProperty(null);
              setShowPropertyModal(true);
            }}
          >
            <PlusCircleFill size={20} className="me-2" />
            Agregar Propiedad
          </Button>
        </div>

        {properties.length === 0 && (
          <div className="text-center">
            <Alert variant="info" className="d-inline-block">
              Aún no tienes propiedades registradas.
            </Alert>
          </div>
        )}

        <Row>
          {properties.map((property, index) => (
            <Col md={4} key={property.id} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/destinations/${property.id}`}
                  className="text-decoration-none"
                >
                  <Card className="service-card h-100">
                    <Card.Img
                      variant="top"
                      src={
                        property.imagesDestinations?.[0]?.urlImage ||
                        "https://via.placeholder.com/400x250"
                      }
                      className="service-card-img"
                    />
                    <div className="card-img-overlay">
                      <div className="card-overlay-content">
                        <h5 className="card-title text-white">
                          {property.name}
                        </h5>
                        {renderStars(property.averageScore)}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Renderizamos el modal para agregar/editar propiedades */}
      <PropertyFormModal
        show={showPropertyModal}
        onHide={handleCloseModal}
        property={selectedProperty}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default MyPropertiesListPage;
