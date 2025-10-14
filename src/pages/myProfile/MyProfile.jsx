import './myprofile.css';
import { useUser } from "../../hooks/useUser";

const MyProfile = () => {

  const { user, setUser } = useUser();

  return (
    <div className="profile-container">
      <h2 className="profile-title fw-semibold">Mi Perfil</h2>

      <div className="profile-image-container">
        {user.image ? (
          <img src={user.image} alt="Foto de perfil" className="profile-image" />
        ) : (
          <div className="profile-placeholder">Foto Perfil</div>
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

