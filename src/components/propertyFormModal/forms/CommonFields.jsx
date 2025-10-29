import { Form, Row, Col } from 'react-bootstrap';

const CommonFields = ({ formData, handleChange, handleRemoveImage }) => {
  const concurrenceLevels = ['BAJA', 'MEDIA', 'ALTA'];

  // Trash icon SVG for the delete button
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m3 0a.5.5 0 0 0-1 0v8.5a.5.5 0 0 0 1 0zM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
    </svg>
  );

  return (
    <>
      <h4 className="mb-3">Datos Generales</h4>

      {/* Image Preview Section */}
      {formData.files && formData.files.length > 0 && (
        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm={12}>Imágenes seleccionadas</Form.Label>
          <Col sm={12}>
            <div className="image-preview-container">
              {Array.from(formData.files).map((file, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="image-preview-img"
                  />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          </Col>
        </Form.Group>
      )}

      {/* Selector de Imágenes Personalizado */}
      <Form.Group as={Row} className="mb-4">
        <Form.Label column sm={12}>Imágenes del lugar</Form.Label>
        <Col sm={12} className="d-flex align-items-center">
          <Form.Label htmlFor="file-upload" className="custom-file-upload-btn">
            Elegir archivos
          </Form.Label>
          {formData.files && formData.files.length > 0 && (
            <span className="file-counter-text ms-3">
              {formData.files.length} {formData.files.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}
            </span>
          )}
          <Form.Control 
            id="file-upload"
            type="file" 
            name="files" 
            multiple 
            onChange={handleChange} 
            style={{ display: 'none' }} // Oculta el input nativo
          />
        </Col>
        <Col sm={12}>
          <Form.Text>Puedes seleccionar múltiples imágenes.</Form.Text>
        </Col>
      </Form.Group>

      <Row>
        {/* Nombre */}
        <Form.Group as={Col} md="6" className="mb-4">
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
        <Form.Group as={Col} md="6" className="mb-4">
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
        <Form.Group as={Col} md="6" className="mb-4">
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
        <Form.Group as={Col} md="6" className="mb-4">
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

      {/* Horario Apertura y Cierre - Fila Centrada */}
      <Row className="justify-content-center">
        <Form.Group as={Col} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
          <Form.Label>Horario de Apertura</Form.Label>
          <Form.Control
            type="time"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
            required
            className="time-input-white-icon form-control-medium"
          />
        </Form.Group>
        <Form.Group as={Col} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
          <Form.Label>Horario de Cierre</Form.Label>
          <Form.Control
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            required
            className="time-input-white-icon form-control-medium"
          />
        </Form.Group>
      </Row>

      {/* Teléfono y Celular - Fila Centrada */}
      <Row className="justify-content-center">
        <Form.Group as={Col} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
          <Form.Label>Teléfono Fijo</Form.Label>
          <Form.Control
            type="tel"
            name="numberPhone"
            value={formData.numberPhone}
            onChange={handleChange}
            className="form-control-medium"
          />
        </Form.Group>
        <Form.Group as={Col} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
          <Form.Label>Celular</Form.Label>
          <Form.Control
            type="tel"
            name="cellPhone"
            value={formData.cellPhone}
            onChange={handleChange}
            className="form-control-medium"
            required
          />
        </Form.Group>
      </Row>

      {/* URL Google Maps */}
      <Form.Group className="mb-4">
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
        <Form.Group as={Col} md="auto" className="mb-4">
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
        <Form.Group as={Col} md="auto" className="d-flex align-items-end mb-4">
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
      <Form.Group className="mb-4">
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
      <Form.Group className="mb-4">
        <Form.Label>Métodos de Pago</Form.Label>
        <Form.Control
          type="text"
          name="paymentMethods"
          value={formData.paymentMethods.join(', ')}
          onChange={handleChange}
          placeholder="Efectivo, Tarjeta de Crédito, Mercado Pago"
          className="form-control-medium"
        />
        <Form.Text>Separar múltiples métodos de pago con comas.</Form.Text>
      </Form.Group>
    </>
  );
};

export default CommonFields;
