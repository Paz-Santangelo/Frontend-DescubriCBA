import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { useUser } from "../../hooks/useUser";
import { useNotification } from "../../context/NotificationContext";
import "./ModalMyProfile.css";

const ModalMyProfile = ({ show, onHide, user: initialUser }) => {
  const { logout } = useUser();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    currentPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (show && initialUser) {
      setFormData({
        name: initialUser.name || "",
        lastname: initialUser.lastname || "",
        email: initialUser.email || "",
        password: "",
        currentPassword: "",
      });
      setImagePreview(initialUser.imageUser?.urlImage || null);
      setImageFile(null);
      setValidationErrors({}); 
    }
  }, [initialUser, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(initialUser.imageUser?.urlImage || null);
    }
  };

  // Función de validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validación de Email
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido.";
    }

    // Validación de Nueva Contraseña (solo si se ha ingresado una)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "La contraseña debe contener al menos una mayúscula.";
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "La contraseña debe contener al menos un número.";
      }
    }

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword =
        "La contraseña actual es obligatoria para guardar cambios.";
    }

    return newErrors;
  };

  // Efecto para validar el formulario en tiempo real
  useEffect(() => {
    const newErrors = {};

    // Validación de Email
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido.";
    }

    // Validación de Nueva Contraseña (solo si se ha ingresado una)
    if (formData.password) {
      const passwordErrors = [];
      if (formData.password.length < 8) {
        passwordErrors.push("8+ caracteres");
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push("una mayúscula");
      }
      if (!/[0-9]/.test(formData.password)) {
        passwordErrors.push("un número");
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Debe contener: ${passwordErrors.join(", ")}.`;
      }
    } else {
      // Si el campo de contraseña está vacío, nos aseguramos de que no haya error.
      delete newErrors.password;
    }

    setValidationErrors(newErrors);
  }, [formData.email, formData.password]); // Se ejecuta cuando cambian estos campos

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Si la nueva contraseña está presente, pero tiene errores, también deshabilitamos
    if (formData.password && errors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("lastname", formData.lastname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("oldPassword", formData.currentPassword);
      if (imageFile) {
        data.append("image", imageFile);
      }

      const message = await userService.updateProfile(initialUser.id, data);
      addNotification(message, "success");
      onHide();

      // Después de 2 segundos, cerramos sesión y redirigimos.
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "No se pudo actualizar el perfil. Inténtalo de nuevo.";
      addNotification(errorMessage, "error");
      onHide();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      contentClassName="profile-modal-content"
      size="lg"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <>
            <Row>
              <Col md={5} className="text-center">
                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label>Foto de perfil</Form.Label>
                  {/* Contenedor para la vista previa de la imagen */}
                  <div className="mb-2">
                    <img
                      src={
                        imagePreview ||
                        "https://via.placeholder.com/150?text=Sin+Foto"
                      }
                      alt="Vista previa"
                      className="image-preview"
                    />
                  </div>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    size="sm"
                    className="custom-file-input"
                  />
                </Form.Group>
              </Col>

              <Col md={7}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastname">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2" controlId="formCurrentPassword">
                  <Form.Label>Contraseña Actual (requerida)</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    isInvalid={!!validationErrors.currentPassword}
                  />
                  <div className="validation-feedback-container">
                    {validationErrors.currentPassword}
                  </div>
                </Form.Group>
              </Col>
               <Col md={6}>
                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>Nueva Contraseña (opcional)</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para no cambiar"
                    isInvalid={!!validationErrors.password}
                  />
                  <div className="validation-feedback-container">
                    {validationErrors.password}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mt-3">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.currentPassword.trim() ||
                  Object.values(validationErrors).some((error) => error)
                }
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMyProfile;
