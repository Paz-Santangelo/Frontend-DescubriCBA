import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import DestinationService from "../../../services/DestinationService";

const CommonFields = ({
  formData,
  handleChange,
  handlePaymentMethodChange,
  handleRemoveImage,
  handleLevelConcurrenceChange,
}) => {
  const [concurrenceLevels, setConcurrenceLevels] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const levels = await DestinationService.getlevelsConcurrenceTypes();
        setConcurrenceLevels(levels);

        const methods = await DestinationService.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const concurrenceLevelOptions = concurrenceLevels.map((level) => ({
    value: level,
    label: level,
  }));

  const animatedComponents = makeAnimated();

  // Estilos personalizados para este react-select (consistentes con los demás)
  const customConcurrenceSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: state.isFocused ? "#39d8a8" : "rgba(255, 255, 255, 0.2)",
      color: "white",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(57, 216, 168, 0.25)"
        : null,
      "&:hover": { borderColor: "#39d8a8" },
      minWidth: "220px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 247, 247, 0.6)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#344944",
      width: "100%",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "180px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "white",
      backgroundColor: "transparent",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "4px",
      transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
      ":hover": { backgroundColor: "white", color: "#344944" },
      "> svg": { transform: "scale(5.2)" },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#39d8a8"
        : state.isFocused
        ? "rgba(57, 216, 168, 0.3)"
        : "transparent",
      color: state.isSelected ? "#151a19" : "white",
      "&:active": { backgroundColor: "#39d8a8" },
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  const TrashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-trash3-fill"
      viewBox="0 0 16 16"
    >
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m3 0a.5.5 0 0 0-1 0v8.5a.5.5 0 0 0 1 0zM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
    </svg>
  );

  return (
    <>
      <h4 className="mb-3">Datos Generales</h4>

      {/* Sección de Previsualización de imágenes seleccionadas */}
      {formData.files && formData.files.length > 0 && (
        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm={12}>
            Imágenes seleccionadas
          </Form.Label>
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
        <Form.Label column sm={12}>
          Imágenes del lugar
        </Form.Label>
        <Col sm={12} className="d-flex align-items-center">
          <Form.Label htmlFor="file-upload" className="custom-file-upload-btn">
            Elegir archivos
          </Form.Label>
          {formData.files && formData.files.length > 0 && (
            <span className="file-counter-text ms-3">
              {formData.files.length}{" "}
              {formData.files.length === 1
                ? "archivo seleccionado"
                : "archivos seleccionados"}
            </span>
          )}
          <Form.Control
            id="file-upload"
            type="file"
            name="files"
            multiple
            onChange={handleChange}
            style={{ display: "none" }} // Oculta el input nativo
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
        <Form.Group
          as={Col}
          md={5}
          lg={4}
          className="mb-4 d-flex flex-column align-items-center"
        >
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
        <Form.Group
          as={Col}
          md={5}
          lg={4}
          className="mb-4 d-flex flex-column align-items-center"
        >
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
        <Form.Group
          as={Col}
          md={5}
          lg={4}
          className="mb-4 d-flex flex-column align-items-center"
        >
          <Form.Label>Teléfono Fijo</Form.Label>
          <Form.Control
            type="tel"
            name="numberPhone"
            value={formData.numberPhone}
            onChange={handleChange}
            className="form-control-medium"
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md={5}
          lg={4}
          className="mb-4 d-flex flex-column align-items-center"
        >
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

      <Row className="align-items-end">
        {/* Nivel de Concurrencia */}
        <Form.Group as={Col} md="auto" className="mb-4">
          <Form.Label>Nivel de Concurrencia</Form.Label>
          <Select
            name="levelConcurrence"
            options={concurrenceLevelOptions}
            value={
              concurrenceLevelOptions.find(
                (option) => option.value === formData.levelConcurrence
              ) || null
            }
            onChange={handleLevelConcurrenceChange}
            components={animatedComponents}
            styles={customConcurrenceSelectStyles}
            placeholder="Seleccionar nivel..."
            isClearable={true}
            required
          />
        </Form.Group>

        {/* Accesibilidad */}
        <Form.Group as={Col} md="auto" className="mb-4">
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
          value={formData.website.join(", ")}
          onChange={handleChange}
          placeholder="www.ejemplo.com, www.otro.com"
        />
        <Form.Text>Separar múltiples sitios web con comas.</Form.Text>
      </Form.Group>

      {/* Métodos de Pago */}
      <Form.Group className="mb-4 payment-methods-group">
        <Form.Label>Métodos de Pago</Form.Label>
        <Row>
          {paymentMethods.map((method) => (
            <Col md={4} sm={6} xs={12} key={method}>
              <Form.Check
                type="checkbox"
                id={`payment-${method}`}
                label={method.replace(/_/g, " ")}
                value={method}
                checked={formData.paymentMethods.includes(method)}
                onChange={handlePaymentMethodChange}
                className="mb-1 payment-method-check"
                disabled={formData.freeAdmission}
              />
            </Col>
          ))}
        </Row>
        <Form.Text>Puedes seleccionar múltiples opciones.</Form.Text>
      </Form.Group>
    </>
  );
};

export default CommonFields;
