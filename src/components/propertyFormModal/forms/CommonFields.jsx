import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CommonFields = ({ formData, handleChange }) => {
  const concurrenceLevels = ['BAJA', 'MEDIA', 'ALTA'];

  return (
    <>
      <h4 className="mb-3">Datos Generales</h4>

      {/* Selector de Imágenes */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={12}>Imágenes del lugar</Form.Label>
        <Col sm={12}>
          <Form.Control 
            type="file" 
            name="files" 
            multiple 
            onChange={handleChange} 
          />
          <Form.Text>Puedes seleccionar múltiples imágenes.</Form.Text>
        </Col>
      </Form.Group>

      <Row>
        {/* Nombre */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Departamento */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Departamento</Form.Label>
          <Form.Control
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Row>
        {/* Localidad */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Localidad</Form.Label>
          <Form.Control
            type="text"
            name="locality"
            value={formData.locality}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Dirección */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Row>
        {/* Horario Apertura y Cierre */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Horario de Apertura</Form.Label>
          <Form.Control
            type="time"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Horario de Cierre</Form.Label>
          <Form.Control
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Row>
        {/* Teléfono y Celular */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Teléfono Fijo</Form.Label>
          <Form.Control
            type="tel"
            name="numberPhone"
            value={formData.numberPhone}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Celular</Form.Label>
          <Form.Control
            type="tel"
            name="cellPhone"
            value={formData.cellPhone}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {/* URL Google Maps */}
      <Form.Group className="mb-3">
        <Form.Label>URL de Google Maps</Form.Label>
        <Form.Control
          type="url"
          name="urlGoogleMaps"
          value={formData.urlGoogleMaps}
          onChange={handleChange}
          placeholder="https://maps.app.goo.gl/example"
        />
      </Form.Group>

      <Row>
        {/* Nivel de Concurrencia */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Nivel de Concurrencia</Form.Label>
          <Form.Select
            name="levelConcurrence"
            value={formData.levelConcurrence}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar nivel...</option>
            {concurrenceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Accesibilidad */}
        <Form.Group as={Col} md="6" className="d-flex align-items-end mb-3">
          <Form.Check
            type="switch"
            id="disabled-accessibility-switch"
            label="¿Es accesible para discapacitados?"
            name="disabledAccessibility"
            checked={formData.disabledAccessibility}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      {/* Sitios Web */}
      <Form.Group className="mb-3">
        <Form.Label>Sitios Web</Form.Label>
        <Form.Control
          type="text"
          name="website"
          value={formData.website.join(', ')}
          onChange={handleChange}
          placeholder="www.ejemplo.com, www.otro.com"
        />
        <Form.Text>Separar múltiples sitios web con comas.</Form.Text>
      </Form.Group>

      {/* Métodos de Pago */}
      <Form.Group className="mb-3">
        <Form.Label>Métodos de Pago</Form.Label>
        <Form.Control
          type="text"
          name="paymentMethods"
          value={formData.paymentMethods.join(', ')}
          onChange={handleChange}
          placeholder="Efectivo, Tarjeta de Crédito, Mercado Pago"
        />
        <Form.Text>Separar múltiples métodos de pago con comas.</Form.Text>
      </Form.Group>
    </>
  );
};

export default CommonFields;