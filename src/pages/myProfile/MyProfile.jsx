import './myprofile.css';
import { useState } from 'react';
import { useUser } from "../../hooks/useUser";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import { PencilFill, TrashFill, Person, PersonVcard, EnvelopeFill, BriefcaseFill, PersonCircle } from "react-bootstrap-icons";
import ModalMyProfile from '../../components/modalMyProfile/ModalMyProfile';

const MyProfile = () => {

  const { user, setUser } = useUser();
  //console.log("Usuario: " , user);
  
  const [showEditModal, setShowEditModal] = useState(false);

  // Si el usuario no se ha cargado todavía, mostramos un estado de carga o null para evitar errores.
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" style={{ color: '#39d8a8', width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
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
          <PersonCircle className="profile-placeholder-icon" />
        )}
      </div>

      {/* Caja con datos del usuario */}
      <div className="details-card mb-4"> {/* Usamos details-card y añadimos mb-4 */}
        <h3 className="details-subtitle">Tus Datos</h3> {/* Título "Tus Datos" con estilo details-subtitle */}
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <Person className="detail-icon" />
                <strong>Nombre:</strong>
              </div>
              <span>{user.name || 'No especificado'}</span>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <PersonVcard className="detail-icon" />
                <strong>Apellido:</strong>
              </div>
              <span>{user.lastname || 'No especificado'}</span>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <EnvelopeFill className="detail-icon" />
                <strong>Email:</strong>
              </div>
              <span>{user.email || 'No especificado'}</span>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <BriefcaseFill className="detail-icon" />
                <strong>Rol:</strong>
              </div>
              <span>{user.role || 'No especificado'}</span>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </div>

      <div className="profile-buttons text-end"> {/* Alineamos los botones a la derecha */}
        <Button
          className="back-button me-2"
          style={{ "--service-color": "#44b4ffff" }} // Azul pastel para editar
          onClick={() => setShowEditModal(true)}
        >
          <PencilFill size={16} className="me-2" />
          Editar
        </Button>
        <Button
          className="back-button delete-button"
          style={{ "--service-color": "#ff6767ff" }} // Rojo pastel para eliminar
          onClick={() => {
            /* Lógica para eliminar el perfil */
          }}
        >
          <TrashFill size={16} className="me-2" />
          Eliminar
        </Button>
      </div>

      {/* Renderizamos el modal de edición */}
      <ModalMyProfile 
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={user}
      />
    </div>
  );
};


export default MyProfile;
