import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { ArrowLeft, House, Star, Camera } from "react-bootstrap-icons";
import "./DestinationDetail.css";

// Importar imágenes temporales (puedes cambiarlas por las específicas)
import Champaqui from "../../assets/Cerro-Champaqui.jpg";
import Calamuchita from "../../assets/Valle-Calamuchita.jpg";
import Uritorco from "../../assets/Cerro-Uritorco.jpg";

const DestinationDetail = () => {
  const { id } = useParams();
  
  // Datos de destinos (mismos que en DestinationsList)
  const destinos = [
    {
      id: 1,
      nombre: "Cerro Champaquí",
      imagen: Champaqui,
      descripcion: "El punto más alto de Córdoba, perfecto para trekking y aventura"
    },
    {
      id: 2,
      nombre: "Valle de Calamuchita",
      imagen: Calamuchita,
      descripcion: "Paisajes serranos, ríos cristalinos y pueblos pintorescos"
    },
    {
      id: 3,
      nombre: "Cerro Uritorco",
      imagen: Uritorco,
      descripcion: "Místico cerro con vistas panorámicas y energías especiales"
    },
    {
      id: 4,
      nombre: "Villa Carlos Paz",
      imagen: Calamuchita,
      descripcion: "Ciudad turística con lago, teatro y vida nocturna"
    },
    {
      id: 5,
      nombre: "La Cumbrecita",
      imagen: Champaqui,
      descripcion: "Pueblo peatonal estilo alpino en plena sierra"
    },
    {
      id: 6,
      nombre: "Capilla del Monte",
      imagen: Uritorco,
      descripcion: "Pueblo místico al pie del Cerro Uritorco"
    }
  ];

  // Encontrar el destino seleccionado
  const destino = destinos.find(d => d.id === parseInt(id));

  // Si no se encuentra el destino, mostrar error
  if (!destino) {
    return (
      <div className="destination-detail-container">
        <Container>
          <div className="text-center">
            <h2>Destino no encontrado</h2>
            <Link to="/destinos" className="btn btn-primary">
              Volver a destinos
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Datos de servicios
  const servicios = [
    {
      tipo: "Donde alojarse",
      icono: <House size={48} className="service-icon" />,
      descripcion: "Hoteles, cabañas y hospedajes en la zona",
      color: "#39d8a8"
    },
    {
      tipo: "Donde comer",
      icono: <Star size={48} className="service-icon" />,
      descripcion: "Gastronomía local y restaurantes recomendados",
      color: "#ff6b6b"
    },
    {
      tipo: "Donde pasear",
      icono: <Camera size={48} className="service-icon" />,
      descripcion: "Actividades y lugares para visitar",
      color: "#4ecdc4"
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
    <div className="destination-detail-container">
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
            Tu destino seleccionado es "{destino.nombre}"
          </h1>
        </motion.div>

        {/* Imagen del destino */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="destination-hero mb-5"
        >
          <img 
            src={destino.imagen} 
            alt={destino.nombre}
            className="destination-hero-img"
          />
          <div className="destination-hero-overlay">
            <p className="destination-hero-description">
              {destino.descripcion}
            </p>
          </div>
        </motion.div>

        {/* Cards de servicios */}
        <Row className="justify-content-center">
          {servicios.map((servicio, index) => (
            <Col md={4} key={servicio.tipo} className="mb-4">
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
                    <Button 
                      variant="outline-primary" 
                      className="mt-auto service-button"
                      style={{ borderColor: servicio.color, color: servicio.color }}
                    >
                      Ver opciones
                    </Button>
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