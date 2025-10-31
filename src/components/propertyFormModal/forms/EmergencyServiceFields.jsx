import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const EmergencyServiceFields = ({ formData, handleEmergencyTypeChange }) => {
  const emergencyTypesList = [
    "SALUD",
    "POLICIA",
    "BOMBEROS",
    "AUXILIO_MECANICO",
  ];

  const emergencyTypeOptions = emergencyTypesList.map((type) => ({
    value: type,
    label: type.replace(/_/g, " "),
  }));

  const animatedComponents = makeAnimated();

  // Estilos personalizados para este react-select (consistentes con los demás)
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
      width: "50%",
    }),
    singleValue: (provided) => ({ ...provided, color: "white" }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 247, 247, 0.6)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#344944",
      width: "50%",
    }),
    menuList: (provided) => ({ ...provided, maxHeight: "120px" }),
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
      <h5 className="my-4">Datos Específicos de Servicio de Emergencia</h5>
      <Row>
        <Form.Group as={Col} md="6" className="mb-3">
          <Form.Label>Tipo de Servicio de Emergencia</Form.Label>
          <Select
            name="typeOfEmergency"
            options={emergencyTypeOptions}
            value={
              emergencyTypeOptions.find(
                (option) => option.value === formData.typeOfEmergency
              ) || null
            }
            onChange={handleEmergencyTypeChange}
            components={animatedComponents}
            styles={customSelectStyles}
            placeholder="Seleccionar tipo..."
            isClearable={true}
            required
          />
        </Form.Group>
      </Row>
    </>
  );
};

export default EmergencyServiceFields;
