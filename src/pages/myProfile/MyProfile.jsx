import "./myprofile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  Person,
  PersonVcard,
  EnvelopeFill,
  BriefcaseFill,
  PersonCircle,
} from "react-bootstrap-icons";
import ModalMyProfile from "../../components/modalMyProfile/ModalMyProfile";
import ConfirmationModal from "../../components/confirmationModal/ConfirmationModal";
import userService from "../../services/userService";

const MyProfile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await userService.deleteUserById(user.id);
      logout();
      navigate("/login");
    } catch (error) {
      setDeleteError(
        error.response?.data?.message ||
          "No se pudo eliminar el perfil. Inténtalo de nuevo."
      );
      setIsDeleting(false);
    }
  };

  // Si el usuario no se ha cargado todavía, mostramos un estado de carga o null para evitar errores.
  if (!user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner
          animation="border"
          style={{ color: "#39d8a8", width: "3rem", height: "3rem" }}
          role="status"
        >
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
          <img
            src={user.imageUser.urlImage}
            alt="Foto de perfil"
            className="profile-image"
          />
        ) : (
          <PersonCircle className="profile-placeholder-icon" />
        )}
      </div>

      {/* Caja con datos del usuario */}
      <div className="details-card mb-4">
        <h3 className="details-subtitle">Tus Datos</h3>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <Person className="detail-icon" />
                <strong>Nombre:</strong>
              </div>
              <span>{user.name || "No especificado"}</span>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <PersonVcard className="detail-icon" />
                <strong>Apellido:</strong>
              </div>
              <span>{user.lastname || "No especificado"}</span>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <EnvelopeFill className="detail-icon" />
                <strong>Email:</strong>
              </div>
              <span>{user.email || "No especificado"}</span>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <div className="profile-data-item">
              <div className="profile-data-label">
                <BriefcaseFill className="detail-icon" />
                <strong>Rol:</strong>
              </div>
              <span>{user.role || "No especificado"}</span>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </div>

      <div className="profile-buttons text-end">
        <Button
          className="back-button me-2"
          style={{ "--service-color": "#44b4ffff" }}
          onClick={() => setShowEditModal(true)}
        >
          <PencilFill size={16} className="me-2" />
          Editar
        </Button>
        <Button
          className="back-button delete-button"
          style={{ "--service-color": "#ff6767ff" }}
          onClick={() => setShowDeleteModal(true)}
        >
          <TrashFill size={16} className="me-2" />
          Darse de baja
        </Button>
      </div>

      <ModalMyProfile
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={user}
      />

      {/* Usamos el nuevo modal de confirmación reutilizable */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProfile}
        title={
          <>
            <TrashFill className="me-2 text-danger" /> Confirmar Eliminación de
            Perfil
          </>
        }
        body={
          <>
            <p>
              <strong>¿Estás seguro de que quieres eliminar tu perfil?</strong>
            </p>
            <p className="text-muted">
              Esta acción es irreversible. Se eliminarán permanentemente tu
              cuenta y todos los datos asociados a ella.
            </p>
          </>
        }
        isConfirming={isDeleting}
        confirmButtonText="Sí, eliminar mi perfil"
        confirmButtonVariant="danger"
        customContentClass="profile-modal-content"
        error={deleteError}
      />
    </div>
  );
};

export default MyProfile;
