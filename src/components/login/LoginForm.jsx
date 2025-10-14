/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import { useUser } from '../../hooks/useUser';
import './LoginForm.css';

const initialState = {
  email: '',
  password: '',
};

const LoginForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  
  const userContext = useUser();
  
  // Verificación segura del contexto
  if (!userContext) {
    console.error('❌ UserContext no está disponible en LoginForm');
    return <div>Error: Contexto de usuario no disponible</div>;
  }
  
  const { login } = userContext;

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
    
    // Validar email
    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = 'Correo inválido.';
    }
    
    // Validar contraseña
    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
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

  // Manejar envío del formulario de login
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
      const loginData = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      
      // Llamar al servicio de login
      const result = await authService.login(loginData);
      
      if (result.success) {
        // Actualizar el contexto de usuario
        if (result.data && result.data.user) {
          login(result.data.user);
        } else if (result.data) {
          // Si la respuesta tiene el usuario directamente
          login(result.data);
        }
        
        // Mostrar mensaje de éxito
        setMessage({ 
          type: 'success', 
          text: '¡Inicio de sesión exitoso! Redirigiendo al inicio...' 
        });
        
        // Limpiar formulario
        setForm(initialState);
        
        // Redirigir después de un momento
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            // Si no hay callback, redirigir a la página principal
            navigate('/');
          }
        }, 1500);
        
      } else {
        // Mostrar error del servidor
        setMessage({ 
          type: 'error', 
          text: result.message || 'Credenciales incorrectas.' 
        });
      }
      
    } catch (error) {
      // Manejar errores de conexión
      console.error('Error durante el login:', error);
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
      className="login-form"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
    >
      <h2>Iniciar sesión</h2>
      
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
      
      {/* Botón de envío */}
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
      
      {/* Mensaje de estado */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {/* Link de registro */}
      <div className="login-link">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="link-btn">Registrate</Link>
      </div>
    </motion.form>
  );
};

export default LoginForm;
