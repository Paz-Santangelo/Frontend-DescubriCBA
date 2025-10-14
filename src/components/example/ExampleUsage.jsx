import { useState } from 'react';
import authService from '../../services/authService';
import userService from '../../services/userService';
import BackendStatus from '../backendStatus/BackendStatus';
import './ExampleUsage.css';

/**
 * Componente de ejemplo que demuestra el uso completo de la integración JWT
 * Incluye registro, login y obtención de usuarios en un solo componente
 */
const ExampleUsage = () => {
  // Estados para formularios
  const [registerData, setRegisterData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'Password123'
  });
  
  const [loginData, setLoginData] = useState({
    email: 'juan@example.com',
    password: 'Password123'
  });

  // Estados para resultados y UI
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Función para agregar mensajes al log
  const addMessage = (type, text) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, { type, text, timestamp }]);
  };

  // Función para registrar usuario
  const handleRegister = async () => {
    setLoading(true);
    addMessage('info', '🔄 Intentando registrar usuario...');
    
    try {
      const result = await authService.register(registerData);
      
      if (result.success) {
        addMessage('success', '✅ Usuario registrado exitosamente');
      } else {
        addMessage('error', `❌ Error en registro: ${result.message}`);
      }
    } catch (error) {
      addMessage('error', `❌ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para hacer login
  const handleLogin = async () => {
    setLoading(true);
    addMessage('info', '🔄 Intentando hacer login...');
    
    try {
      const result = await authService.login(loginData);
      
      if (result.success) {
        addMessage('success', '✅ Login exitoso - Token guardado en localStorage');
        addMessage('info', `🔑 Token: ${authService.getToken()?.substring(0, 50)}...`);
      } else {
        addMessage('error', `❌ Error en login: ${result.message}`);
      }
    } catch (error) {
      addMessage('error', `❌ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener usuarios
  const handleGetUsers = async () => {
    setLoading(true);
    addMessage('info', '🔄 Obteniendo usuarios desde /api/usuarios...');
    
    try {
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
        addMessage('success', `✅ Se obtuvieron ${result.data.length} usuarios`);
      } else {
        addMessage('error', `❌ Error al obtener usuarios: ${result.message}`);
      }
    } catch (error) {
      addMessage('error', `❌ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar datos
  const handleClear = () => {
    setUsers([]);
    setMessages([]);
    authService.logout();
    addMessage('info', '🧹 Datos limpiados y sesión cerrada');
  };

  return (
    <div className="example-usage">
      {/* Componente de estado del backend */}
      <BackendStatus />
      
      <div className="example-header">
        <h1>🚀 Ejemplo de Integración JWT</h1>
        <p>Prueba completa de registro, login y obtención de datos desde Spring Boot</p>
      </div>

      <div className="example-content">
        {/* Panel de Acciones */}
        <div className="actions-panel">
          <h2>📋 Acciones Disponibles</h2>
          
          {/* Sección de Registro */}
          <div className="action-section">
            <h3>1️⃣ Registro de Usuario</h3>
            <div className="form-inline">
              <input 
                type="text"
                placeholder="Nombre"
                value={registerData.nombre}
                onChange={(e) => setRegisterData({...registerData, nombre: e.target.value})}
              />
              <input 
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              />
              <input 
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              />
              <button onClick={handleRegister} disabled={loading}>
                Registrar
              </button>
            </div>
          </div>

          {/* Sección de Login */}
          <div className="action-section">
            <h3>2️⃣ Login de Usuario</h3>
            <div className="form-inline">
              <input 
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
              <input 
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
              <button onClick={handleLogin} disabled={loading}>
                Login
              </button>
            </div>
          </div>

          {/* Sección de Obtener Datos */}
          <div className="action-section">
            <h3>3️⃣ Obtener Usuarios</h3>
            <div className="form-inline">
              <button onClick={handleGetUsers} disabled={loading}>
                GET /api/usuarios
              </button>
              <span className="endpoint-info">
                Requiere: Authorization: Bearer &lt;token&gt;
              </span>
            </div>
          </div>

          {/* Botón de Limpiar */}
          <div className="action-section">
            <button onClick={handleClear} className="clear-btn">
              🧹 Limpiar Todo
            </button>
          </div>
        </div>

        {/* Panel de Log */}
        <div className="log-panel">
          <h2>📝 Log de Actividad</h2>
          <div className="log-content">
            {messages.length === 0 ? (
              <p className="no-messages">No hay actividad aún...</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`log-message ${message.type}`}>
                  <span className="timestamp">[{message.timestamp}]</span>
                  <span className="message-text">{message.text}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de Usuarios */}
        {users.length > 0 && (
          <div className="users-panel">
            <h2>👥 Usuarios Obtenidos del Backend</h2>
            <div className="users-list">
              {users.map((user, index) => (
                <div key={user.id || index} className="user-item">
                  <strong>{user.nombre || 'Sin nombre'}</strong>
                  <span>{user.email}</span>
                  {user.id && <span>ID: {user.id}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel de Estado */}
        <div className="status-panel">
          <h2>ℹ️ Estado Actual</h2>
          <div className="status-info">
            <div className="status-item">
              <strong>🔐 Autenticado:</strong> 
              <span className={authService.isAuthenticated() ? 'status-success' : 'status-error'}>
                {authService.isAuthenticated() ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div className="status-item">
              <strong>🎯 Backend URL:</strong> 
              <span>http://localhost:8080</span>
            </div>
            <div className="status-item">
              <strong>🔑 Token en localStorage:</strong> 
              <span className={authService.getToken() ? 'status-success' : 'status-error'}>
                {authService.getToken() ? '✅ Presente' : '❌ Ausente'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;