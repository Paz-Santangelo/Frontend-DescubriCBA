import './myprofile.css';
import { useUser } from "../../hooks/useUser";

const MyProfile = () => {

  const { user, setUser } = useUser();

  // Si el usuario no se ha cargado todavía, mostramos un estado de carga o null para evitar errores.
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border" style={{ color: '#39d8a8' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title fw-semibold">Mi Perfil</h2>

      <div className="profile-image-container">
        {/* Corregimos la ruta para acceder a la imagen del usuario */}
        {user.imageUser && user.imageUser.urlImage ? (
          <img src={user.imageUser.urlImage} alt="Foto de perfil" className="profile-image" />
        ) : (
          <div className="profile-placeholder">
            <i className="bi bi-person-circle" style={{ fontSize: '5rem', color: '#ccc' }}></i>
          </div>
        )}
      </div>

      {/* Caja con datos */}
      <div className="profile-data-card">
        <div className="profile-item">
          <label>Nombre:</label>
          <p>{user.name}</p>
        </div>

        <div className="profile-item">
          <label>Apellido:</label>
          <p>{user.lastname}</p>
        </div>

        <div className="profile-item">
          <label>Email:</label>
          <p>{user.email}</p>
        </div>

        <div className="profile-item">
          <label>Rol:</label>
          <p>{user.role}</p>
        </div>
      </div>

      <div className="profile-buttons">
        <button className="btn-delete">Eliminar</button>
        <button className="btn-edit">Editar</button>
      </div>
    </div>
  );
};

export default MyProfile;
