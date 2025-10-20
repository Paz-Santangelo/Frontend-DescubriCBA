import { Accordion, Container } from "react-bootstrap";
import "./preguntas.css";

const Preguntas = () => {
  return (
    <Container className="faq-container">
      <h1 className="faq-title text-center mb-4">Preguntas Frecuentes</h1>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Qué es “Descubrí Córdoba”?</Accordion.Header>
          <Accordion.Body className="faq-answer">
            Es una plataforma desarrollada por estudiantes del Instituto Superior
            Dr. Bernardo Houssay para promover y facilitar el turismo en la
            provincia de Córdoba, Argentina.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>¿Necesito registrarme para usar la app?</Accordion.Header>
          <Accordion.Body className="faq-answer">
            No, podés navegar como visitante. Sin embargo, al registrarte
            desbloqueás funciones adicionales como calificar destinos,
            recomendar y ofrecer servicios.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>¿Quién aprueba a los proveedores de servicios?</Accordion.Header>
          <Accordion.Body className="faq-answer">
            El administrador del sistema revisa y aprueba las solicitudes de los
            proveedores de servicios para garantizar la calidad y seguridad de la
            plataforma.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>¿Qué tipo de alojamientos puedo encontrar?</Accordion.Header>
          <Accordion.Body className="faq-answer">
            En DescubríCBA ofrecemos una variedad de alojamientos: cabañas, hoteles y hosterías. 
            Podés filtrar según tus necesidades y presupuesto.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>¿Puedo recomendar un lugar?</Accordion.Header>
          <Accordion.Body className="faq-answer">
            Sí, si estás registrado como usuario podés dejar recomendaciones y calificaciones de los destinos y alojamientos que visitaste.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Preguntas;
