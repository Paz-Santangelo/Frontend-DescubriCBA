import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Carousel,
  Badge,
  ListGroup,
  Button,
} from "react-bootstrap";
import {
  GeoAltFill,
  ClockFill,
  TelephoneFill,
  Globe,
  CreditCard,
  CheckCircleFill,
  XCircleFill,
  Water,
  ShieldLockFill,
  CupStraw,
  Building,
  PeopleFill,
  PersonWheelchair,
  MapFill,
  Whatsapp,
  StarFill,
  StarHalf,
  Star,
  ChatQuoteFill,
  ArrowLeft,
  PencilFill,
  TrashFill,
} from "react-bootstrap-icons";
import destinationService from "../../services/DestinationService";
import "./DestinationDetailPage.css";
import { useUser } from "../../hooks/useUser";

// Componente para mostrar los detalles de una propiedad específica.
const DestinationDetailPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const location = useLocation();

  const isLoggedIn = user && user.role;

  const canSeeBackButton =
    user && ["OWNER", "MANAGEMENT", "ADMIN"].includes(user.role);

  const previousState = location.state;

  const canEditOrDelete = user && user.id === destination?.ownerId;

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getDestinationById(id);
        setDestination(data);
        setError(null);
      } catch (err) {
        setError(
          "No se pudieron cargar los detalles del destino. Por favor, intente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" style={{ color: "#39d8a8" }} />
        <p className="ms-3 mb-0">Cargando propiedad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!destination) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">No se encontró el destino.</Alert>
      </Container>
    );
  }

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
    // Se envuelve en un div para aplicar estilos y mostrar el puntaje numérico
    return (
      <div className="star-rating-container">
        {stars}{" "}
        <span className="score-text">({roundedScore.toFixed(1)} de 5)</span>
      </div>
    );
  };

  // --- Funciones de renderizado para detalles específicos ---
  const renderRestaurantDetails = (dest) => (
    <>
      <ListGroup.Item>
        <CupStraw className="detail-icon" />
        <div>
          <strong>Tipo de Cocina:</strong> {dest.cuisineType.join(", ")}
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <CheckCircleFill className="detail-icon text-success" />
        <div>
          <strong>Delivery:</strong> {dest.delivery ? "Sí" : "No"}
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <XCircleFill className="detail-icon text-danger" />
        <div>
          <strong>Admite Reservas:</strong> {dest.reservations ? "Sí" : "No"}
        </div>
      </ListGroup.Item>
    </>
  );

  const renderAccommodationDetails = (dest) => (
    <ListGroup.Item>
      <Building className="detail-icon" />
      <div>
        <strong>Tipo de Alojamiento:</strong> {dest.type}
      </div>
    </ListGroup.Item>
  );

  const renderBodyOfWaterDetails = (dest) => (
    <>
      <ListGroup.Item>
        <Water className="detail-icon" />
        <div>
          <strong>Tipo:</strong> {dest.typeBodyOfWater}
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <CreditCard className="detail-icon" />
        <div>
          <strong>Precio de Entrada:</strong>{" "}
          {dest.freeAdmission ? "Gratis" : `$${dest.entrancePrice}`}
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <CheckCircleFill className="detail-icon text-info" />
        <div>
          <strong>Nivel de Limpieza:</strong> {dest.cleaningLevel}
        </div>
      </ListGroup.Item>
    </>
  );

  const renderEmergencyServiceDetails = (dest) => (
    <ListGroup.Item>
      <ShieldLockFill className="detail-icon" />
      <div>
        <strong>Tipo de Emergencia:</strong> {dest.typeOfEmergency}
      </div>
    </ListGroup.Item>
  );

  return (
    <div className={`destination-detail-page ${isLoggedIn ? "logged-in" : ""}`}>
      <Container>
        {previousState?.fromLink && (
          <div className="back-button-container">
            <Link
              to={previousState.fromLink}
              className="back-button"
              style={{
                "--service-color": previousState.fromColor || "#39d8a8",
              }}
            >
              <ArrowLeft size={20} className="me-2" />
              Volver a {previousState.fromTitle}
            </Link>
          </div>
        )}
        {/* 2. Si es un OWNER/ADMIN y NO viene de una lista, muestra el botón a "Mis Propiedades" */}
        {canSeeBackButton && !previousState?.fromLink && (
          <div className="back-button-container">
            <Link
              to="/mis-propiedades"
              className="back-button"
              style={{ "--service-color": "#39d8a8" }}
            >
              <ArrowLeft size={20} className="me-2" />
              Volver a Mis Propiedades
            </Link>
          </div>
        )}

        <h1 className="text-center fw-semibold section-title">
          {destination?.name || "Detalles de la Propiedad"}
        </h1>

        {/* Botones de Editar y Eliminar */}
        {canEditOrDelete && (
          <div className="text-end mb-4">
            <Button
              className="back-button me-2"
              style={{ "--service-color": "#44b4ffff" }} // Azul pastel para editar
              onClick={() => {
                /* Lógica para editar */
              }}
            >
              <PencilFill size={16} className="me-2" />
              Editar
            </Button>
            <Button
              className="back-button delete-button"
              style={{ "--service-color": "#ff6767ff" }} // Rojo pastel para eliminar
              onClick={() => {
                /* Lógica para eliminar */
              }}
            >
              <TrashFill size={16} className="me-2" />
              Eliminar
            </Button>
          </div>
        )}

        <Row className="justify-content-center">
          {/* Sección del Carrusel de Imágenes */}
          <Col lg={10} md={12} className="mb-5">
            <Carousel fade className="destination-carousel" interval={3000}>
              {destination.imagesDestinations &&
              destination.imagesDestinations.length > 0 ? (
                destination.imagesDestinations.map((img) => (
                  <Carousel.Item key={img.id}>
                    <img
                      className="d-block w-100 carousel-image"
                      src={img.urlImage}
                      alt={img.name}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousel-image"
                    src="https://via.placeholder.com/800x500?text=Sin+Imágenes"
                    alt="No hay imágenes disponibles"
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {/* Sección de Detalles */}
          <Col lg={10} md={12}>
            <div className="details-card">
              <h3 className="details-subtitle">Información General</h3>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <GeoAltFill className="detail-icon" />
                  <div>
                    <strong>Dirección:</strong> {destination.address},{" "}
                    {destination.locality}, {destination.department}.
                  </div>
                </ListGroup.Item>
                {destination.urlGoogleMaps && (
                  <ListGroup.Item>
                    <MapFill className="detail-icon" />
                    <div>
                      <a
                        href={destination.urlGoogleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm google-maps-btn"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <ClockFill className="detail-icon" />
                  <div>
                    <strong>Horario:</strong> {destination.openingTime} -{" "}
                    {destination.closingTime}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <TelephoneFill className="detail-icon" />
                  <div>
                    <strong>Teléfono:</strong>{" "}
                    {destination.numberPhone || "N/A"}
                  </div>
                </ListGroup.Item>
                {destination.cellPhone && (
                  <ListGroup.Item>
                    <Whatsapp className="detail-icon text-success" />
                    <div>
                      <strong>Celular:</strong> {destination.cellPhone}
                    </div>
                  </ListGroup.Item>
                )}
                {destination.website && destination.website.length > 0 && (
                  <ListGroup.Item>
                    <Globe className="detail-icon" />
                    <div>
                      <strong>Sitio Web:</strong>{" "}
                      <a
                        href={destination.website[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {destination.website[0]}
                      </a>
                    </div>
                  </ListGroup.Item>
                )}
                {destination.paymentMethods &&
                  destination.paymentMethods.length > 0 && (
                    <ListGroup.Item>
                      <CreditCard className="detail-icon" />
                      <div>
                        <strong>Métodos de Pago:</strong>{" "}
                        {destination.paymentMethods.map((method) => (
                          <Badge
                            pill
                            bg="secondary"
                            className="me-1"
                            key={method}
                          >
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </ListGroup.Item>
                  )}
                <ListGroup.Item>
                  <PeopleFill className="detail-icon" />
                  <div>
                    <strong>Concurrencia:</strong>{" "}
                    <Badge pill bg="info">
                      {destination.levelConcurrence}
                    </Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <PersonWheelchair className="detail-icon" />
                  <div>
                    <strong>Acceso para discapacitados:</strong>{" "}
                    {destination.disabledAccessibility ? "Sí" : "No"}
                  </div>
                </ListGroup.Item>

                {/* --- Renderizado Condicional de Detalles Específicos --- */}
                {destination.cuisineType &&
                  destination.cuisineType.length > 0 &&
                  renderRestaurantDetails(destination)}
                {destination.type && renderAccommodationDetails(destination)}
                {destination.typeBodyOfWater &&
                  renderBodyOfWaterDetails(destination)}
                {destination.typeOfEmergency &&
                  renderEmergencyServiceDetails(destination)}
              </ListGroup>
            </div>
          </Col>
        </Row>

        {/* Sección de Calificaciones y Comentarios */}
        <Row className="justify-content-center mt-5">
          <Col lg={10} md={12}>
            <div className="comments-card">
              <h3 className="details-subtitle">Calificaciones y Comentarios</h3>
              <div className="mb-4">
                {renderStars(destination.averageScore)}
              </div>

              {destination.comments && destination.comments.length > 0 ? (
                <ListGroup variant="flush">
                  {destination.comments.map((comment) => (
                    <ListGroup.Item key={comment.id} className="comment-item">
                      <ChatQuoteFill className="comment-icon" />
                      <div className="comment-body">
                        <div className="comment-header">
                          <strong className="comment-user">
                            {comment.user.name} {comment.user.lastname}
                          </strong>
                          <span className="comment-date">
                            {new Date(comment.commentDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-text mb-0">{comment.comment}</p>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Alert variant="secondary" className="text-center">
                  Esta propiedad aún no tiene comentarios.
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DestinationDetailPage;
