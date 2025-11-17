/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import "./RegistroForm.css";
import { useNotification } from "../../context/NotificationContext"; // Importar el hook de notificación

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({});
  const { addNotification, removeNotification } = useNotification();

  // Estado para almacenar el ID de la notificación persistente
  const [persistentNotificationId, setPersistentNotificationId] =
    useState(null);

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

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  // Efecto para mostrar la alerta persistente al cargar el componente
  useEffect(() => {
    const adminEmail = "admin@descubricba.com"; // Puedes cambiar esto o moverlo a una variable de entorno
    const emailSubject = "Solicitud de rol Dueño";

    const id = addNotification(
      <>
        <strong>¿Quieres ser Dueño y publicar tus propiedades?</strong>
        <br />
        Por favor{" "}
        <a href={`mailto:${adminEmail}?subject=${emailSubject}`}>
          contacta al administrador
        </a>{" "}
        para que apruebe tu solicitud y se te responderá por correo a la
        brevedad.
        <br />
        ¡Gracias por tu interés en formar parte de nuestra comunidad!
      </>,
      "info",
      null
    );
    setPersistentNotificationId(id);

    // Función de limpieza para remover la notificación cuando el componente se desmonte
    return () => {
      removeNotification(id);
    };
  }, [addNotification, removeNotification]);

  // Función de validación reutilizable
  const validate = useCallback((isSubmitting = false, currentTouched = {}) => {
    const newErrors = {};
    const { nombre, apellido, email, password, confirmPassword } = form;

    // Validación de Nombre
    if ((isSubmitting || currentTouched.nombre) && !nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (nombre.trim() && nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres.";
    }

    // Validación de Apellido
    if ((isSubmitting || currentTouched.apellido) && !apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio.";
    } else if (apellido.trim() && apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres.";
    }

    // Validación de Email
    if ((isSubmitting || currentTouched.email) && !email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = "Correo inválido.";
    }

    // Validación de Contraseña
    if ((isSubmitting || currentTouched.password) && !password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password) { // Solo validar formato si hay algo escrito
      const passwordErrors = [];
      if (password.length < 8) passwordErrors.push("8+ caracteres");
      if (!/[A-Z]/.test(password)) passwordErrors.push("una mayúscula");
      if (!/[0-9]/.test(password)) passwordErrors.push("un número");
      if (passwordErrors.length > 0) newErrors.password = `Debe contener: ${passwordErrors.join(", ")}.`;
    }

    // Validación de Confirmar Contraseña
    if ((isSubmitting || currentTouched.confirmPassword) && !confirmPassword) {
      newErrors.confirmPassword = "Confirme la contraseña.";
    } else if (confirmPassword && password !== confirmPassword) { // Solo validar coincidencia si hay algo escrito
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return newErrors;
  }, [form]);

  // Efecto para validar el formulario en tiempo real y actualizar el estado del botón
  useEffect(() => {
    const validationErrors = validate(false, touched); // Validar considerando los campos tocados
    setErrors(validationErrors); // Actualizar los errores para mostrarlos en la UI

    const allFieldsFilled = Object.values(form).every(
      (field) => field.trim() !== ""
    );
    setIsFormValid(Object.keys(validationErrors).length === 0 && allFieldsFilled);
  }, [form, touched, validate]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    // Al enviar, consideramos que todos los campos han sido "tocados" para mostrar todos los errores.
    const allFieldsTouched = Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allFieldsTouched); // Actualizar el estado 'touched' para que se muestren todos los errores

    const validationErrors = validate(true, allFieldsTouched); // Validar para el envío
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

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
      addNotification(`${successMessage} Redirigiendo al login...`, "success");

      setForm(initialState);

      setTimeout(() => {
        // Remover la notificación persistente antes de redirigir
        if (persistentNotificationId) {
          removeNotification(persistentNotificationId);
        }
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      let errorMessage =
        "Error de conexión. Verifica que el servidor esté funcionando.";

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // Si el backend devuelve un objeto con un campo "message" (de CustomException) o un string
        if (typeof errorData.message === "string") {
          errorMessage = errorData.message;
        }
        // Si el backend devuelve un mapa de errores de validación (de handleMethodArgumentNotValid)
        else if (typeof errorData === "object" && errorData !== null) {
          const validationErrors = Object.values(errorData).join(". ");
          errorMessage = `Datos inválidos: ${validationErrors}`;
        }
      }

      addNotification(errorMessage, "danger");
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
          onBlur={handleBlur}
          required
        />
        <label className={form.nombre ? "floating active" : "floating"}>
          Nombre
        </label>
        <div className="error-container">
          {touched.nombre && errors.nombre && (
            <span className="error">{errors.nombre}</span>
          )}
        </div>
      </div>

      {/* Campo Apellido */}
      <div className="form-group floating-group">
        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label className={form.apellido ? "floating active" : "floating"}>
          Apellido
        </label>
        <div className="error-container">
          {touched.apellido && errors.apellido && (
            <span className="error">{errors.apellido}</span>
          )}
        </div>
      </div>

      {/* Campo Email */}
      <div className="form-group floating-group">
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label className={form.email ? "floating active" : "floating"}>
          Correo electrónico
        </label>
        <div className="error-container">
          {touched.email && errors.email && (
            <span className="error">{errors.email}</span>
          )}
        </div>
      </div>

      {/* Campo Contraseña */}
      <div className="form-group floating-group">
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label className={form.password ? "floating active" : "floating"}>
          Contraseña
        </label>
        <div className="error-container">
          {touched.password && errors.password && (
            <span className="error">{errors.password}</span>
          )}
        </div>
      </div>

      {/* Campo Confirmar Contraseña */}
      <div className="form-group floating-group">
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label
          className={form.confirmPassword ? "floating active" : "floating"}
        >
          Confirmar contraseña
        </label>
        <div className="error-container">
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
      </div>

      {/* Botón de envío */}
      <button type="submit" disabled={!isFormValid || loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </motion.form>
  );
};

export default RegistroForm;
