import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import userService from '../../services/userService';
import BackendStatus from '../backendStatus/BackendStatus';
import './Dashboard.css';

const Dashboard = () => {
  // Estados para manejar la UI y datos
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      // En lugar de redirigir automáticamente, solo mostrar mensaje
      setMessage({
        type: 'error',
        text: 'Debes iniciar sesión para acceder al dashboard. Ve a /login o /registro primero.'
      });
      return;
    }

    // Obtener datos del usuario actual
    const userData = authService.getCurrentUser();
    setCurrentUser(userData);
  }, []);

  // Función para obtener usuarios desde la API
  const handleGetUsers = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Llamar al servicio para obtener usuarios
      const result = await userService.getAllUsers();
      
      if (result.success) {
        // Mostrar usuarios obtenidos
        setUsers(result.data);
        setMessage({
          type: 'success',
          text: `Se obtuvieron ${result.data.length} usuarios exitosamente`
        });
      } else {
        // Mostrar error del servidor
        setMessage({
          type: 'error',
          text: result.message
        });
        setUsers([]);
      }
      
    } catch (error) {
      // Manejar errores de conexión
      console.error('Error al obtener usuarios:', error);
      setMessage({
        type: 'error',
        text: 'Error inesperado al obtener usuarios'
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar datos de autenticación
    authService.logout();
    
    // Redirigir al login
    navigate('/login');
  };

  // Función para limpiar usuarios y mensajes
  const handleClearData = () => {
    setUsers([]);
    setMessage(null);
  };

  return (
    <div className="dashboard-container">
      {/* Componente de estado del backend */}
      <BackendStatus />
      
      <div className="dashboard-header">
        <h1>Panel de Usuario</h1>
        
        {/* Información del usuario actual */}
        {currentUser && (
          <div className="user-info">
            <p>Bienvenido, <strong>{currentUser.nombre || currentUser.email}</strong></p>
            <button 
              onClick={handleLogout} 
              className="logout-btn"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-content">
        {/* Sección de acciones */}
        <div className="actions-section">
          <h2>Acciones Disponibles</h2>
          
          <div className="action-buttons">
            {/* Botón para obtener usuarios */}
            <button 
              onClick={handleGetUsers} 
              disabled={loading}
              className="primary-btn"
            >
              {loading ? 'Cargando...' : 'Obtener Usuarios'}
            </button>
            
            {/* Botón para limpiar datos */}
            {(users.length > 0 || message) && (
              <button 
                onClick={handleClearData}
                className="secondary-btn"
              >
                Limpiar Datos
              </button>
            )}
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Sección de resultados */}
        {users.length > 0 && (
          <div className="users-section">
            <h2>Usuarios del Sistema</h2>
            
            <div className="users-grid">
              {users.map((user, index) => (
                <div key={user.id || index} className="user-card">
                  <div className="user-info-card">
                    <h3>{user.nombre || 'Sin nombre'}</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.id && <p><strong>ID:</strong> {user.id}</p>}
                    {user.fechaRegistro && (
                      <p><strong>Fecha registro:</strong> {
                        new Date(user.fechaRegistro).toLocaleDateString('es-ES')
                      }</p>
                    )}
                    {user.activo !== undefined && (
                      <p><strong>Estado:</strong> {
                        user.activo ? 'Activo' : 'Inactivo'
                      }</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información técnica */}
        <div className="tech-info">
          <h3>Información Técnica</h3>
          <div className="tech-details">
            <p><strong>Endpoint API:</strong> http://localhost:8080/api/usuarios</p>
            <p><strong>Método:</strong> GET</p>
            <p><strong>Autenticación:</strong> Bearer Token (JWT)</p>
            <p><strong>Token almacenado en:</strong> localStorage</p>
            <p><strong>Estado de autenticación:</strong> {
              authService.isAuthenticated() ? '✅ Autenticado' : '❌ No autenticado'
            }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;