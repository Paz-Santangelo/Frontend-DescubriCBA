/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import "./RegistroForm.css";

const initialState = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegistroForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Función para validar los campos del formulario
  const validate = () => {
    const newErrors = {};

    // Validar nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres.";
    }

    // Validar apellido
    if (!form.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio.";
    } else if (form.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres.";
    }

    // Validar email
    if (!form.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = "Correo inválido.";
    }

    // Validar contraseña
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres.";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Debe tener una mayúscula.";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Debe tener un número.";
    }

    // Validar confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirme la contraseña.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return newErrors;
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setMessage(null);
  };

  // Efecto para validar el formulario en tiempo real y actualizar el estado del botón
  useEffect(() => {
    const validationErrors = validate();
    const allFieldsFilled = Object.values(form).every(field => field.trim() !== '');
    setIsFormValid(Object.keys(validationErrors).length === 0 && allFieldsFilled);
  }, [form]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Preparar datos para enviar al backend
      const userData = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      // Llamar al servicio de registro
      const successMessage = await authService.register(userData);

      // Éxito: el backend devolvió un mensaje de éxito.
      setMessage({
        type: "success",
        text: `${successMessage} Redirigiendo al login...`,
      });

      setForm(initialState);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      // El error viene de Axios y contiene la respuesta del backend.
      console.error("❌ Error en el registro:", error.response || error);

      let errorMessage =
        "Error de conexión. Verifica que el servidor esté funcionando.";

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // Si el backend devuelve un objeto con un campo "message" (de CustomException)
        if (typeof errorData.message === "string") {
          errorMessage = errorData.message;
        }
        // Si el backend devuelve un mapa de errores de validación (de handleMethodArgumentNotValid)
        else if (typeof errorData === "object" && errorData !== null) {
          const validationErrors = Object.values(errorData).join(". ");
          errorMessage = `Datos inválidos: ${validationErrors}`;
        }
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      className="registro-form"
      style={{ maxWidth: "550px" }}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
    >
      <h2>Crear cuenta</h2>

      {/* Campo Nombre */}
      <div className="form-group floating-group">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <label className={form.nombre ? "floating active" : "floating"}>
          Nombre
        </label>
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </div>

      {/* Campo Apellido */}
      <div className="form-group floating-group">
        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <label className={form.apellido ? "floating active" : "floating"}>
          Apellido
        </label>
        {errors.apellido && <span className="error">{errors.apellido}</span>}
      </div>

      {/* Campo Email */}
      <div className="form-group floating-group">
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className={form.email ? "floating active" : "floating"}>
          Correo electrónico
        </label>
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      {/* Campo Contraseña */}
      <div className="form-group floating-group">
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label className={form.password ? "floating active" : "floating"}>
          Contraseña
        </label>
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      {/* Campo Confirmar Contraseña */}
      <div className="form-group floating-group">
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <label
          className={form.confirmPassword ? "floating active" : "floating"}
        >
          Confirmar contraseña
        </label>
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      {/* Botón de envío */}
      <button type="submit" disabled={!isFormValid || loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      {/* Mensaje de estado */}
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </motion.form>
  );
};

export default RegistroForm;
