import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'El correo es obligatorio.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Correo inválido.';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres.';
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
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: '¡Inicio de sesión exitoso! Redirigiendo...' });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al iniciar sesión.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <div className="form-group">
        <label>Correo electrónico</label>
        <input name="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <div className="login-link">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="link-btn">Registrate</Link>
      </div>
    </form>
  );
};

export default LoginForm;
