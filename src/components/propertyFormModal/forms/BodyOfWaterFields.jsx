import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const BodyOfWaterFields = ({ formData, handleChange }) => {
  const bodyOfWaterTypes = ['RIO', 'LAGUNA', 'ARROYO', 'CASCADA', 'BALNEARIO', 'LAGO', 'EMBALSE', 'DIQUE'];
  const cleaningLevels = ['EXCELENTE', 'BUENO', 'REGULAR', 'MALO'];

  return (
    <>
      <h5 className="mt-4">Datos Específicos de Cuerpo de Agua</h5>

      <Row>
        {/* Tipo de Cuerpo de Agua */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Tipo de Cuerpo de Agua</Form.Label>
          <Form.Select
            name="typeBodyOfWater"
            value={formData.typeBodyOfWater}
            onChange={handleChange}
            required
            className="form-control-medium"
          >
            <option value="">Seleccionar tipo...</option>
            {bodyOfWaterTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Nivel de Limpieza */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Nivel de Limpieza</Form.Label>
          <Form.Select
            name="cleaningLevel"
            value={formData.cleaningLevel}
            onChange={handleChange}
            required
            className="form-control-medium"
          >
            <option value="">Seleccionar nivel...</option>
            {cleaningLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>

      <Row>
        {/* Admisión Gratuita */}
        <Form.Group as={Col} md="6" className="d-flex align-items-center mb-3">
          <Form.Check
            type="switch"
            id="free-admission-switch"
            label="¿La entrada es gratuita?"
            name="freeAdmission"
            checked={formData.freeAdmission}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Precio de Entrada */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Precio de Entrada</Form.Label>
          <Form.Control
            type="number"
            name="entrancePrice"
            value={formData.entrancePrice}
            onChange={handleChange}
            disabled={formData.freeAdmission} // Deshabilitado si la admisión es gratuita
            required={!formData.freeAdmission} // Requerido si la admisión NO es gratuita
            step="0.01"
            min="0"
          />
        </Form.Group>
      </Row>
    </>
  );
};

export default BodyOfWaterFields;