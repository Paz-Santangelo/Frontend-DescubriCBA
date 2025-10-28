import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const RestaurantFields = ({ formData, handleChange }) => {
  return (
    <>
      <h5 className="mt-4">Datos Específicos de Restaurante</h5>

      {/* Tipos de Cocina */}
      <Form.Group className="mb-3">
        <Form.Label>Tipos de Cocina</Form.Label>
        <Form.Control
          type="text"
          name="cuisineType"
          value={formData.cuisineType.join(', ')}
          onChange={handleChange}
          placeholder="Parrilla, Pasta, Minutas, Vegano"
          required
        />
        <Form.Text>Separar múltiples tipos de cocina con comas.</Form.Text>
      </Form.Group>

      <Row>
        {/* Delivery */}
        <Form.Group as={Col} md="6" className="d-flex align-items-center mb-3">
          <Form.Check
            type="switch"
            id="delivery-switch"
            label="¿Tiene delivery?"
            name="delivery"
            checked={formData.delivery}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Reservas */}
        <Form.Group as={Col} md="6" className="d-flex align-items-center mb-3">
          <Form.Check
            type="switch"
            id="reservations-switch"
            label="¿Acepta reservas?"
            name="reservations"
            checked={formData.reservations}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>
    </>
  );
};

export default RestaurantFields;