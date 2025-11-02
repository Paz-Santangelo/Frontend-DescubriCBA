import { Form, Row, Col, InputGroup } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import bodyOfWaterService from "../../../services/bodyOfWaterService";

const BodyOfWaterFields = ({
  formData,
  handleChange,
  handleBodyOfWaterTypeChange,
  handleCleaningLevelChange,
}) => {
  const [bodyOfWaterTypes, setBodyOfWaterTypes] = useState([]);
  const cleaningLevelsList = ["EXCELENTE", "BUENO", "REGULAR", "MALO"];

  useEffect(() => {
    const fetchBodyOfWaterTypes = async () => {
      try {
        const types = await bodyOfWaterService.getBodiesOfWaterTypes();
        setBodyOfWaterTypes(types);
      } catch (error) {
        console.error("Error fetching body of water types:", error);
      }
    };

    fetchBodyOfWaterTypes();
  }, []);

  const bodyOfWaterTypeOptions = bodyOfWaterTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const cleaningLevelOptions = cleaningLevelsList.map((level) => ({
    value: level,
    label: level,
  }));

  const animatedComponents = makeAnimated();

  // Estilos reutilizables para los selectores de este componente
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: state.isFocused ? "#39d8a8" : "rgba(255, 255, 255, 0.2)",
      color: "white",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(57, 216, 168, 0.25)"
        : null,
      "&:hover": { borderColor: "#39d8a8" },
      width: "80%",
    }),
    singleValue: (provided) => ({ ...provided, color: "white" }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 247, 247, 0.6)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#344944",
      width: "80%",
    }),
    menuList: (provided) => ({ ...provided, maxHeight: "180px" }),
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
    input: (provided) => ({ ...provided, color: "white" }),
  };

  return (
    <>
      <h5 className="my-4">Datos Específicos de Cuerpo de Agua</h5>

      <Row>
        {/* Tipo de Cuerpo de Agua */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Tipo de Cuerpo de Agua</Form.Label>
          <Select
            name="typeBodyOfWater"
            options={bodyOfWaterTypeOptions}
            value={
              bodyOfWaterTypeOptions.find(
                (option) => option.value === formData.typeBodyOfWater
              ) || null
            }
            onChange={handleBodyOfWaterTypeChange}
            components={animatedComponents}
            styles={customSelectStyles}
            placeholder="Seleccionar tipo..."
            isClearable={true}
            required
          />
        </Form.Group>

        {/* Nivel de Limpieza */}
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Nivel de Limpieza</Form.Label>
          <Select
            name="cleaningLevel"
            options={cleaningLevelOptions}
            value={
              cleaningLevelOptions.find(
                (option) => option.value === formData.cleaningLevel
              ) || null
            }
            onChange={handleCleaningLevelChange}
            components={animatedComponents}
            styles={customSelectStyles}
            placeholder="Seleccionar nivel..."
            isClearable={true}
            required
          />
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
          <InputGroup className="form-control-medium">
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              name="entrancePrice"
              value={formData.entrancePrice}
              onChange={handleChange}
              disabled={formData.freeAdmission}
              required={!formData.freeAdmission}
              step="0.01"
              min="0"
            />
          </InputGroup>
        </Form.Group>
      </Row>
    </>
  );
};

export default BodyOfWaterFields;
