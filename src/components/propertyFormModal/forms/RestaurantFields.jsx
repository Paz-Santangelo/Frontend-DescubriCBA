import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useState, useEffect } from "react";
import restaurantService from "../../../services/restaurantService";

const RestaurantFields = ({
  formData,
  handleChange,
  handleCuisineTypeChange,
}) => {
  const [cuisineTypeOptionsList, setCuisineTypeOptionsList] = useState([]);

  useEffect(() => {
    const fetchCuisineTypes = async () => {
      try {
        const types = await restaurantService.getCuisineTypes();
        setCuisineTypeOptionsList(types);
      } catch (error) {
        console.error(
          "Error al cargar los tipos de cocina desde el backend:",
          error
        );
        // Opcional: manejar el error en la UI
      }
    };

    fetchCuisineTypes();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const cuisineTypeOptions = cuisineTypeOptionsList.map((type) => ({
    value: type,
    label: type.replace(/_/g, " "),
  }));

  const animatedComponents = makeAnimated();

  // Estilos personalizados para que react-select se vea bien en un tema oscuro
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: state.isFocused ? "#39d8a8" : "rgba(255, 255, 255, 0.2)",
      color: "white",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(57, 216, 168, 0.25)"
        : null,
      "&:hover": { borderColor: "#39d8a8" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#344944",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "180px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#39d8a8"
        : state.isFocused
        ? "rgba(57, 216, 168, 0.3)"
        : "transparent",
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgba(57, 216, 168, 0.8)",
      borderRadius: "8px",
      alignItems: "center",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
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
      ":hover": {
        backgroundColor: "white",
        color: "#344944",
      },
      "> svg": {
        transform: "scale(1.2)",
      },
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
      ":hover": {
        backgroundColor: "white",
        color: "#344944",
      },
      "> svg": {
        transform: "scale(5.2)",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <>
      <h3 className="mb-4 title-text-aquamarine text-center">
        Datos Específicos de Restaurante
      </h3>

      <h5 className="mb-3 subtitle-text-light-aquamarine">Gastronomía</h5>
      <Row className="justify-content-start">
        {/* Tipos de Cocina */}
        <Form.Group as={Col} md={8} lg={5} className="mb-3">
          <Form.Label>Tipos de Cocina</Form.Label>
          <Select
            isMulti
            name="cuisineType"
            options={cuisineTypeOptions}
            value={cuisineTypeOptions.filter((option) =>
              formData.cuisineType.includes(option.value)
            )}
            onChange={handleCuisineTypeChange}
            components={animatedComponents}
            styles={customStyles}
            placeholder="Selecciona uno o más tipos..."
            isClearable={true}
            required={formData.cuisineType.length === 0}
          />
          <Form.Text>Puedes buscar y seleccionar múltiples opciones.</Form.Text>
        </Form.Group>
      </Row>

      <hr className="centered-divider" />

      <h5 className="mb-3 subtitle-text-light-aquamarine">Servicios</h5>
      <Row className="justify-content-start">
        {/* Delivery */}
        <Form.Group as={Col} md="auto" className="d-flex align-items-center mb-3 me-md-5">
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
        <Form.Group as={Col} md="auto" className="d-flex align-items-center mb-3">
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
