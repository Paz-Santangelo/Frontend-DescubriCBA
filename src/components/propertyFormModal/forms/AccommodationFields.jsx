import { Form, Row, Col } from 'react-bootstrap';

const AccommodationFields = ({ formData, handleChange }) => {
  const accommodationTypes = ['HOTEL', 'HOSTEL', 'CAMPING', 'CABANIA'];

  return (
    <>
      <h5 className="mt-4">Datos Específicos de Alojamiento</h5>
      <Row>
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Tipo de Alojamiento</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-control-medium"
          >
            <option value="">Seleccionar tipo...</option>
            {accommodationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
    </>
  );
};

export default AccommodationFields;