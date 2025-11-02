
import { motion } from "framer-motion";
import "./ServiceListPage.css"; // Usaremos un CSS unificado
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Select from "react-select";
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
  const { serviceType, locality } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  // Estado para los filtros
  const [filters, setFilters] = useState({
    minAverageScore: "",
    type: "",
    freeAdmission: "",
    delivery: "",
    reservations: "",
  });

  const config = serviceConfig[serviceType];

  const formattedLocality = locality
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Opciones para el selector de puntuación con react-select
  const scoreOptions = [
    { value: "", label: "Puntuaciones" },
    { value: "1", label: "1 estrella" },
    { value: "2", label: "2 estrellas" },
    { value: "3", label: "3 estrellas" },
    { value: "4", label: "4 estrellas" },
    { value: "5", label: "5 estrellas" },
  ];

  const [accommodationTypeOptions, setAccommodationTypeOptions] = useState([]);
  const [bodyOfWaterTypeOptions, setBodyOfWaterTypeOptions] = useState([]);
  const [emergencyServiceTypeOptions, setEmergencyServiceTypeOptions] = useState([]);

  // Estilos personalizados para react-select para que coincida con la paleta de la app
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#39d8a8" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.25rem rgba(57, 216, 168, 0.25)"
        : "none",
      "&:hover": {
        borderColor: "#39d8a8",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#39d8a8"
        : state.isFocused
        ? "rgba(57, 216, 168, 0.1)"
        : "white",
      color: state.isSelected ? "white" : "#333",
      "&:active": {
        backgroundColor: "#39d8a8",
      },
    }),
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (value, action) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [action.name]: value.value,
    }));
  };

  // Cargar dinámicamente los tipos de alojamiento si es la página de alojamientos
  useEffect(() => {
    if (serviceType === "alojamientos") {
      const fetchAccommodationTypes = async () => {
        try {
          const types = await accommodationService.getAccommodationTypes();
          const formattedOptions = [
            { value: "", label: "Todos" },
            ...types.map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
            })),
          ];
          setAccommodationTypeOptions(formattedOptions);
        } catch (error) {
          console.error("Error al cargar los tipos de alojamiento:", error);
          setAccommodationTypeOptions([{ value: "", label: "Todos" }]); // Fallback
        }
      };
      fetchAccommodationTypes();
    }
  }, [serviceType]);

  // Cargar dinámicamente los tipos de cuerpos de agua
  useEffect(() => {
    if (serviceType === "cuerpos-de-agua") {
      const fetchBodyOfWaterTypes = async () => {
        try {
          const types = await bodyOfWaterService.getBodiesOfWaterTypes();
          const formattedOptions = [
            { value: "", label: "Todos" },
            ...types.map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
            })),
          ];
          setBodyOfWaterTypeOptions(formattedOptions);
        } catch (error) {
          console.error("Error al cargar los tipos de cuerpos de agua:", error);
        }
      };
      fetchBodyOfWaterTypes();
    }
  }, [serviceType]);

  // Cargar dinámicamente los tipos de servicios de emergencia
  useEffect(() => {
    if (serviceType === "emergencias") {
      const fetchEmergencyServiceTypes = async () => {
        try {
          const types = await emergencyService.getEmergencyServicesTypes();
          const formattedOptions = [
            { value: "", label: "Todos" },
            ...types.map((type) => ({
              value: type,
              label: type.replace(/_/g, " ").charAt(0).toUpperCase() + type.replace(/_/g, " ").slice(1).toLowerCase(),
            })),
          ];
          setEmergencyServiceTypeOptions(formattedOptions);
        } catch (error) {
          console.error("Error al cargar los tipos de servicios de emergencia:", error);
        }
      };
      fetchEmergencyServiceTypes();
    }
  }, [serviceType]);

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

        // Construir los parámetros de filtro, incluyendo la localidad
        const queryParams = { locality: formattedLocality };
        for (const key in filters) {
          if (filters[key] !== "" && filters[key] !== false) {
            queryParams[key] = filters[key];
          }
        }

        const data = await config.fetchData(queryParams);
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
  }, [locality, serviceType, config, formattedLocality, filters]);



  // Variantes de animación para el contenedor y las tarjetas
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Retraso entre la animación de cada tarjeta
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, // Duración ligeramente mayor para suavidad
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

        {/* Sección de Filtros */}
        <div className="filters-section mb-4">
          <h5 className="filters-title mb-4">Filtrar por:</h5>
          <Row>
            {/* Filtro por Puntuación Mínima (Común a todos) */}
            <Col md={3}>
              <div className="form-group">
                <label htmlFor="minAverageScore">Puntuación Mínima</label>
                <Select
                  id="minAverageScore-select"
                  name="minAverageScore"
                  options={scoreOptions}
                  styles={customSelectStyles}
                  value={scoreOptions.find(
                    (option) => option.value === filters.minAverageScore
                  )}
                  onChange={handleFilterChange}
                  placeholder="Seleccionar..."
                  aria-label="Selector de Puntuación Mínima"
                />
              </div>
            </Col>

            {/* Filtros Específicos por Tipo de Servicio */}
            {serviceType === "alojamientos" && (
              <Col md={3}>
                <div className="form-group">
                  <label htmlFor="type-select">Tipo de Alojamiento</label>
                  <Select
                    id="type-select"
                    name="type"
                    options={accommodationTypeOptions}
                    styles={customSelectStyles}
                    value={accommodationTypeOptions.find(
                      (option) => option.value === filters.type
                    )}
                    onChange={handleFilterChange}
                    placeholder="Seleccionar..."
                    aria-label="Selector de Tipo de Alojamiento"
                  />
                </div>
              </Col>
            )}

            {serviceType === "cuerpos-de-agua" && (
              <>
                <Col md={3}>
                  <div className="form-group">
                    <label htmlFor="type-body-of-water-select">Tipo</label>
                    <Select
                      id="type-body-of-water-select"
                      name="type"
                      options={bodyOfWaterTypeOptions}
                      styles={customSelectStyles}
                      value={bodyOfWaterTypeOptions.find(
                        (option) => option.value === filters.type
                      )}
                      onChange={handleFilterChange}
                      placeholder="Seleccionar..."
                      aria-label="Selector de Tipo de Cuerpo de Agua"
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="form-check align-self-end">
                    <input
                      type="checkbox"
                      id="freeAdmission"
                      name="freeAdmission"
                      className="form-check-input"
                      checked={!!filters.freeAdmission}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="freeAdmission" className="form-check-label">
                      Entrada Gratuita
                    </label>
                  </div>
                </Col>
              </>
            )}

            {serviceType === "emergencias" && (
              <Col md={3}>
                <div className="form-group">
                  <label htmlFor="type-emergency-select">Tipo de Emergencia</label>
                  <Select
                    id="type-emergency-select"
                    name="type"
                    options={emergencyServiceTypeOptions}
                    styles={customSelectStyles}
                    value={emergencyServiceTypeOptions.find(option => option.value === filters.type)}
                    onChange={handleFilterChange}
                    placeholder="Seleccionar..."
                    aria-label="Selector de Tipo de Emergencia"
                  />
                </div>
              </Col>
            )}

            {serviceType === "restaurantes" && (
              <>
                {/* Agrupamos los checkboxes en una sola columna para que se muestren verticalmente */}
                <Col md={4} className="d-flex">
                  <div className="form-check mb-2">
                    {" "}
                    {/* Margen inferior para separar los checkboxes verticalmente */}
                    <input
                      type="checkbox"
                      id="delivery"
                      name="delivery"
                      className="form-check-input"
                      checked={!!filters.delivery}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="delivery" className="form-check-label">
                      Con Delivery
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="reservations"
                      name="reservations"
                      className="form-check-input"
                      checked={!!filters.reservations}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="reservations" className="form-check-label">
                      Acepta Reservas
                    </label>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>

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

                        <motion.div
                          className="row"
                          key={JSON.stringify(filters)}
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {items.map((item) => (
                            <Col md={4} key={item.id} className="mb-4">
                              <motion.div variants={itemVariants}>
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
                        </motion.div>      </Container>
    </div>
  );
};

export default ServiceListPage;
