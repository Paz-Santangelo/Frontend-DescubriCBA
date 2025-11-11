import React from 'react';
import { Carousel, Card, Container } from 'react-bootstrap';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'Juan Pérez',
    comment: '¡Increíble experiencia! Córdoba tiene paisajes que te dejan sin aliento. Totalmente recomendado.',
  },
  {
    name: 'Ana Gómez',
    comment: 'La plataforma me ayudó a planificar todo mi viaje. Súper útil y fácil de usar. ¡Volveré!',
  },
  {
    name: 'Carlos Rodríguez',
    comment: 'Gracias a DescubríCBA encontré lugares que no conocía. Una joya para los amantes de la aventura.',
  },
  {
    name: 'Laura Fernández',
    comment: 'Los mejores atardeceres que vi en mi vida. La gente, la comida, todo fue perfecto. ¡Quiero volver ya!',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <Container>
        <h2 className="text-center fw-semibold section-title">Testimonios</h2>
        <Carousel indicators={false} interval={3000}>
          {testimonialsData.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <Card className="testimonial-card">
                <Card.Body>
                  <Card.Text>"{testimonial.comment}"</Card.Text>
                  <footer className="blockquote-footer">{testimonial.name}</footer>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default Testimonials;
