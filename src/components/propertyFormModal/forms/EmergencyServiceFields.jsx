import { Form, Row, Col } from 'react-bootstrap';

const EmergencyServiceFields = ({ formData, handleChange }) => {
  const emergencyTypes = ['SALUD', 'POLICIA', 'BOMBEROS', 'AUXILIO_MECANICO'];

  return (
    <>
      <h5 className="mt-4">Datos Específicos de Servicio de Emergencia</h5>
      <Row>
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Tipo de Servicio de Emergencia</Form.Label>
          <Form.Select
            name="typeOfEmergency"
            value={formData.typeOfEmergency}
            onChange={handleChange}
            required
            className="form-control-medium"
          >
            <option value="">Seleccionar tipo...</option>
            {emergencyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
    </>
  );
};

export default EmergencyServiceFields;