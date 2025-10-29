import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useUser } from "../../hooks/useUser";

// Importa los servicios
import accommodationService from "../../services/accommodationService";
import restaurantService from "../../services/restaurantService";
import bodyOfWaterService from "../../services/bodyOfWaterService";
import emergencyService from "../../services/emergencyService";

// Importa los componentes de formulario
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
  type: "", // Accommodation
  typeBodyOfWater: "", // BodyOfWater
  entrancePrice: 0, // BodyOfWater
  freeAdmission: false, // BodyOfWater
  cleaningLevel: "", // BodyOfWater
  cuisineType: [], // Restaurant
  delivery: false, // Restaurant
  reservations: false, // Restaurant
  typeOfEmergency: "", // EmergencyService
};

const PropertyFormModal = ({ show, onHide, property }) => {
  const isEditing = !!property;
  const { user } = useUser();
  const [propertyType, setPropertyType] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Resetea el formulario y el tipo cuando el modal se abre
    if (show) {
      setPropertyType("");
      setFormData(initialFormData);
    }
  }, [show]);

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
    setFormData(initialFormData); // Resetea al cambiar de tipo
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
      // Resetea el valor del input para permitir la selección de los mismos archivos
      // y para que no muestre un estado obsoleto.
      e.target.value = null;
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "website" || name === "paymentMethods") {
      const arrayValue = value.split(",").map((item) => item.trim());
      setFormData((prev) => ({ ...prev, [name]: arrayValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    // Agrega todos los campos al FormData
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
      alert("Propiedad creada con éxito!");
      onHide(); // Cierra el modal
    } catch (error) {
      console.error("Error al crear la propiedad:", error);
      alert("Hubo un error al crear la propiedad.");
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
            handleChange={handleChange}
          />
        );
      case "restaurant":
        return (
          <RestaurantFields formData={formData} handleChange={handleChange} />
        );
      case "bodyOfWater":
        return (
          <BodyOfWaterFields formData={formData} handleChange={handleChange} />
        );
      case "emergencyService":
        return (
          <EmergencyServiceFields
            formData={formData}
            handleChange={handleChange}
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
              <Form.Select
                value={propertyType}
                onChange={handlePropertyTypeChange}
                className="property-type-selector"
              >
                <option value="">-- Elige una opción --</option>
                {propertyTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {propertyType && !isEditing && (
            <>
              <CommonFields 
                formData={formData} 
                handleChange={handleChange} 
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
            disabled={(!propertyType && !isEditing) || isSubmitting}
          >
            {isSubmitting
              ? "Creando..."
              : isEditing
              ? "Guardar Cambios"
              : "Crear Propiedad"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PropertyFormModal;
