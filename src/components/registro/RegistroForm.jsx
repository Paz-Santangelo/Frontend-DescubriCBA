/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import './RegistroForm.css';

const initialState = {
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegistroForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    
    // Validar email
    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = 'Correo inválido.';
    }
    
    // Validar contraseña
    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (form.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres.';
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Debe tener una mayúscula.';
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Debe tener un número.';
    }
    
    // Validar confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirme la contraseña.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    
    return newErrors;
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    setErrors({ ...errors, [e.target.name]: undefined });
    setMessage(null);
  };

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
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      
      console.log('📝 Enviando datos de registro:', userData);
      
      // Llamar al servicio de registro
      const result = await authService.register(userData);
      
      if (result.success) {
        // Mostrar mensaje de éxito
        setMessage({ 
          type: 'success', 
          text: '¡Registro exitoso! Redirigiendo al login...' 
        });
        
        // Limpiar formulario
        setForm(initialState);
        
        // Redirigir después de un momento más corto
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 1500);
        
      } else {
        // Mostrar error del servidor con más detalles
        let errorText = result.message || 'Error en el registro.';
        
        // Si hay detalles adicionales del error, mostrarlos para debugging
        if (result.details) {
          console.error('❌ Detalles del error:', result.details);
          console.error('📤 Datos enviados:', result.details.sentData);
          console.error('📥 Respuesta del servidor:', result.details.data);
          console.error('🔢 Status code:', result.details.status);
          
          // Agregar información del estado HTTP para el usuario
          if (result.details.status === 400) {
            errorText += ` (Estado HTTP: ${result.details.status} - Datos inválidos)`;
          }
        }
        
        setMessage({ 
          type: 'error', 
          text: errorText
        });
      }
      
    } catch (error) {
      // Manejar errores de conexión
      console.error('❌ Error inesperado durante el registro:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error de conexión. Verifica que el servidor esté funcionando.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      className="registro-form"
      style={{ maxWidth: '550px' }}
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
        <label className={form.nombre ? 'floating active' : 'floating'}>
          Nombre y apellido
        </label>
        {errors.nombre && <span className="error">{errors.nombre}</span>}
        <small className="help-text">Ejemplo: Juan Pérez</small>
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
        <label className={form.email ? 'floating active' : 'floating'}>
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
        <label className={form.password ? 'floating active' : 'floating'}>
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
        <label className={form.confirmPassword ? 'floating active' : 'floating'}>
          Confirmar contraseña
        </label>
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>
      
      {/* Botón de envío */}
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
      
      {/* Mensaje de estado */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </motion.form>
  );
};

export default RegistroForm;