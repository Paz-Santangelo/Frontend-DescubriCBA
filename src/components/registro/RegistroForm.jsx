/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import './RegistroForm.css';

const initialState = {
  nombre: '',
  apellido: '',
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

  const validate = () => {
    const newErrors = {};
    if (!form.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!form.apellido) newErrors.apellido = 'El apellido es obligatorio.';
    if (!form.email) newErrors.email = 'El correo es obligatorio.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Correo inválido.';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres.';
    else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Debe tener una mayúscula.';
    else if (!/[0-9]/.test(form.password)) newErrors.password = 'Debe tener un número.';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirme la contraseña.';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: '¡Registro exitoso! Redirigiendo...' });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error en el registro.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      className="registro-form"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
    >
      <h2>Crear cuenta</h2>
      <div className="form-group floating-group">
        <input name="nombre" value={form.nombre} onChange={handleChange} required />
        <label className={form.nombre ? 'floating active' : 'floating'}>Nombre</label>
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </div>
      <div className="form-group floating-group">
        <input name="apellido" value={form.apellido} onChange={handleChange} required />
        <label className={form.apellido ? 'floating active' : 'floating'}>Apellido</label>
        {errors.apellido && <span className="error">{errors.apellido}</span>}
      </div>
      <div className="form-group floating-group">
        <input name="email" value={form.email} onChange={handleChange} required />
        <label className={form.email ? 'floating active' : 'floating'}>Correo electrónico</label>
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group floating-group">
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
        <label className={form.password ? 'floating active' : 'floating'}>Contraseña</label>
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <div className="form-group floating-group">
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        <label className={form.confirmPassword ? 'floating active' : 'floating'}>Confirmar contraseña</label>
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </motion.form>
  );
};

export default RegistroForm;