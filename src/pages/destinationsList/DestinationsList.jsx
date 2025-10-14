import { useUser } from "../../hooks/useUser";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./destinationsList.css";

// Importar imágenes de destinos
import Champaqui from "../../assets/Cerro-Champaqui.jpg";
import Calamuchita from "../../assets/Valle-Calamuchita.jpg";
import Uritorco from "../../assets/Cerro-Uritorco.jpg";

const DestinationsList = () => {
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  // Datos de destinos
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
      imagen: Calamuchita, // Temporal, puedes cambiar por imagen específica
      descripcion: "Ciudad turística con lago, teatro y vida nocturna"
    },
    {
      id: 5,
      nombre: "La Cumbrecita",
      imagen: Champaqui, // Temporal, puedes cambiar por imagen específica
      descripcion: "Pueblo peatonal estilo alpino en plena sierra"
    },
    {
      id: 6,
      nombre: "Capilla del Monte",
      imagen: Uritorco, // Temporal, puedes cambiar por imagen específica
      descripcion: "Pueblo místico al pie del Cerro Uritorco"
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
    <div className={`destinations-container ${isLoggedIn ? "logged-in" : ""}`}>
      <Container>
        <h1 className="text-center my-5 fw-semibold section-title">
          Seleccione un Destino
        </h1>
        
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
                <Link to={`/destino/${destino.id}`} className="text-decoration-none">
                  <Card className="destination-card h-100">
                    <Card.Img 
                      variant="top" 
                      src={destino.imagen} 
                      className="destination-card-img"
                    />
                    <div className="card-img-overlay">
                      <h5 className="card-title text-white card-overlay-content">
                        {destino.nombre}
                      </h5>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Text className="destination-description">
                        {destino.descripcion}
                      </Card.Text>
                      <div className="mt-auto">
                        <small className="text-muted">Click para explorar</small>
                      </div>
                    </Card.Body>
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
