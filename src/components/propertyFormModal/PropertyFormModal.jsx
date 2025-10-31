import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useUser } from "../../hooks/useUser";
import { useNotification } from "../../context/NotificationContext";

import accommodationService from "../../services/accommodationService";
import restaurantService from "../../services/restaurantService";
import bodyOfWaterService from "../../services/bodyOfWaterService";
import emergencyService from "../../services/emergencyService";

import CommonFields from "./forms/CommonFields";
import AccommodationFields from "./forms/AccommodationFields";
import RestaurantFields from "./forms/RestaurantFields";
import BodyOfWaterFields from "./forms/BodyOfWaterFields";
import EmergencyServiceFields from "./forms/EmergencyServiceFields";

import "./PropertyFormModal.css";

const propertyTypes = [
  { key: "accommodation", name: "Alojamiento" },
  { key: "restaurant", name: "Restaurante" },
  { key: "bodyOfWater", name: "Cuerpo de Agua" },
  { key: "emergencyService", name: "Servicio de Emergencia" },
];

const propertyTypeOptions = propertyTypes.map((type) => ({
  value: type.key,
  label: type.name,
}));

const animatedComponents = makeAnimated();

// Custom styles for the react-select component in PropertyFormModal
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: state.isFocused ? "#39d8a8" : "rgba(255, 255, 255, 0.2)",
    color: "white",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(57, 216, 168, 0.25)" : null,
    "&:hover": { borderColor: "#39d8a8" },
    width: "50%",
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
    width: "50%", // Asegura que el menú tenga el mismo ancho que el control
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
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#39d8a8"
      : state.isFocused
      ? "rgba(57, 216, 168, 0.3)"
      : "transparent",
    color: state.isSelected ? "#151a19" : "white",
    "&:active": {
      backgroundColor: "#39d8a8",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
};

const initialFormData = {
  // Campos comunes de DestinationDTO
  name: "",
  department: "",
  locality: "",
  address: "",
  urlGoogleMaps: "",
  openingTime: "",
  closingTime: "",
  levelConcurrence: "",
  disabledAccessibility: false,
  numberPhone: "",
  cellPhone: "",
  website: [],
  paymentMethods: [],
  files: [],
  ownerId: null,
  // Campos específicos
  type: "",
  typeBodyOfWater: "",
  entrancePrice: 0,
  freeAdmission: false,
  cleaningLevel: "",
  cuisineType: [],
  delivery: false,
  reservations: false,
  typeOfEmergency: "",
};

const PropertyFormModal = ({ show, onHide, property }) => {
  const isEditing = !!property;
  const { user, refreshUser } = useUser();
  const { addNotification } = useNotification();
  const [propertyType, setPropertyType] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const {
        name,
        department,
        locality,
        address,
        openingTime,
        closingTime,
        levelConcurrence,
        cellPhone,
        files,
      } = formData;

      // Validación de campos comunes
      if (
        !name ||
        !department ||
        !locality ||
        !address ||
        !openingTime ||
        !closingTime ||
        !levelConcurrence ||
        !cellPhone ||
        files.length === 0
      ) {
        return false;
      }

      // Validación de campos específicos del tipo de propiedad
      switch (propertyType) {
        case "accommodation":
          if (!formData.type) return false;
          break;
        case "restaurant":
          if (!formData.cuisineType || formData.cuisineType.length === 0)
            return false;
          break;
        case "bodyOfWater":
          if (!formData.typeBodyOfWater || !formData.cleaningLevel) return false;
          if (!formData.freeAdmission && (!formData.entrancePrice || formData.entrancePrice <= 0)) return false;
          break;
        case "emergencyService":
          if (!formData.typeOfEmergency) return false;
          break;
        default:
          // Si no hay un tipo de propiedad seleccionado, el formulario no es válido
          return false;
      }

      return true;
    };

    setIsFormValid(validateForm());
  }, [formData, propertyType]);

  useEffect(() => {
    if (show) {
      setPropertyType("");
      setFormData(initialFormData);
    }
  }, [show]);

  const handlePropertyTypeChange = (selectedOption) => {
    const newPropertyType = selectedOption ? selectedOption.value : "";
    setPropertyType(newPropertyType);
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
      e.target.value = null;
    } else if (type === "checkbox") {
      // Lógica específica para el switch de admisión gratuita
      if (name === "freeAdmission") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
          entrancePrice: checked ? 0 : prev.entrancePrice, 
          paymentMethods: checked ? [] : prev.paymentMethods, 
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name === "website" || name === "paymentMethods") {
      const arrayValue = value.split(",").map((item) => item.trim());
      setFormData((prev) => ({ ...prev, [name]: arrayValue }));
    } else if (type === "select-multiple") {
      const arrayValue = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, [name]: arrayValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentMethodChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentMethods = prev.paymentMethods;
      if (checked) {
        return { ...prev, paymentMethods: [...currentMethods, value] };
      } else {
        return {
          ...prev,
          paymentMethods: currentMethods.filter((method) => method !== value),
        };
      }
    });
  };

  const handleCuisineTypeChange = (selectedOptions) => {
    const cuisineValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData((prev) => ({ ...prev, cuisineType: cuisineValues }));
  };

  const handleLevelConcurrenceChange = (selectedOption) => {
    const newLevel = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, levelConcurrence: newLevel }));
  };

  const handleAccommodationTypeChange = (selectedOption) => {
    const newType = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, type: newType }));
  };

  const handleBodyOfWaterTypeChange = (selectedOption) => {
    const newType = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, typeBodyOfWater: newType }));
  };

  const handleCleaningLevelChange = (selectedOption) => {
    const newLevel = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, cleaningLevel: newLevel }));
  };

  const handleEmergencyTypeChange = (selectedOption) => {
    const newType = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, typeOfEmergency: newType }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.files];
      updatedFiles.splice(index, 1);
      return { ...prev, files: updatedFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    const finalData = { ...formData, ownerId: user.id };

    for (const key in finalData) {
      if (key === "files") {
        if (finalData.files) {
          for (let i = 0; i < finalData.files.length; i++) {
            data.append("files", finalData.files[i]);
          }
        }
      } else if (Array.isArray(finalData[key])) {
        finalData[key].forEach((item) => data.append(key, item));
      } else {
        data.append(key, finalData[key]);
      }
    }

    try {
      let response;
      switch (propertyType) {
        case "accommodation":
          response = await accommodationService.createAccommodation(data);
          break;
        case "restaurant":
          response = await restaurantService.createRestaurant(data);
          break;
        case "bodyOfWater":
          response = await bodyOfWaterService.createBody(data);
          break;
        case "emergencyService":
          response = await emergencyService.createEmergencyService(data);
          break;
        default:
          throw new Error("Tipo de propiedad no válido");
      }
      // Refrescar los datos del usuario para obtener la propiedad recién creada
      await refreshUser();
      addNotification("Propiedad creada con éxito!", "success");
      onHide();
    } catch (error) {
      console.error("Error al crear la propiedad:", error);
      addNotification("Hubo un error al crear la propiedad.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSpecificFields = () => {
    switch (propertyType) {
      case "accommodation":
        return (
          <AccommodationFields
            formData={formData}
            handleAccommodationTypeChange={handleAccommodationTypeChange}
          />
        );
      case "restaurant":
        return (
          <RestaurantFields
            formData={formData}
            handleChange={handleChange}
            handleCuisineTypeChange={handleCuisineTypeChange}
          />
        );
      case "bodyOfWater":
        return (
          <BodyOfWaterFields
            formData={formData}
            handleChange={handleChange}
            handleBodyOfWaterTypeChange={handleBodyOfWaterTypeChange}
            handleCleaningLevelChange={handleCleaningLevelChange}
          />
        );
      case "emergencyService":
        return (
          <EmergencyServiceFields
            formData={formData}
            handleEmergencyTypeChange={handleEmergencyTypeChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="xl"
      contentClassName="property-form-modal-content"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>
          {isEditing ? "Editar Propiedad" : "Agregar Nueva Propiedad"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {!isEditing && (
            <Form.Group controlId="propertyTypeSelector" className="mb-4">
              <Form.Label>
                Selecciona el tipo de propiedad que deseas crear
              </Form.Label>
              <Select
                name="propertyType"
                options={propertyTypeOptions}
                value={
                  propertyTypeOptions.find(
                    (option) => option.value === propertyType
                  ) || null
                }
                onChange={handlePropertyTypeChange}
                components={animatedComponents}
                styles={customSelectStyles}
                placeholder="-- Elige una opción --"
                className="property-type-selector-responsive"
                classNamePrefix="property-type-select"
                isClearable={true}
              />
            </Form.Group>
          )}

          {propertyType && !isEditing && (
            <>
              <CommonFields
                formData={formData}
                handleChange={handleChange}
                handlePaymentMethodChange={handlePaymentMethodChange}
                handleLevelConcurrenceChange={handleLevelConcurrenceChange}
                handleRemoveImage={handleRemoveImage}
              />
              <hr className="section-divider" />
              {renderSpecificFields()}
            </>
          )}

          {isEditing && <p>Aquí irá el formulario para editar la propiedad.</p>}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-create-property"
            disabled={isSubmitting || (!isEditing && !isFormValid)}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ width: '1rem', height: '1rem', marginRight: '8px' }}
                />
                <span> Procesando...</span>
              </>
            ) : isEditing ? (
              "Guardar Cambios"
            ) : (
              "Crear Propiedad"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PropertyFormModal;
