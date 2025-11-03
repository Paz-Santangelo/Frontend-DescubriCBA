/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import Select from "react-select";
import { useUser } from "../../hooks/useUser";
import { useNotification } from "../../context/NotificationContext";
import RoleBasedComponent from "../../components/auth/RoleBasedComponent";
import userService from "../../services/userService";
import "./UserManagement.css";

const roleOptions = [
  { value: "USER", label: "USER - Usuario normal" },
  { value: "OWNER", label: "OWNER - Dueño de negocio" },
  { value: "MANAGEMENT", label: "MANAGEMENT - Gestor" },
  { value: "ADMIN", label: "ADMIN - Administrador" },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: state.isFocused ? "#39d8a8" : "rgba(255, 255, 255, 0.2)",
    color: "white",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(57, 216, 168, 0.25)" : null,
    "&:hover": { borderColor: "#39d8a8" },
    width: "100%",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "rgba(255, 247, 247, 0.6)",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#344944",
    width: "100%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#39d8a8"
      : state.isFocused
      ? "rgba(57, 216, 168, 0.3)"
      : "transparent",
    color: state.isSelected ? "#151a19" : "white",
    "&:active": {
      backgroundColor: "#39d8a8",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
};

const UserManagement = () => {
  const { user, hasRole } = useUser();
  const { addNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const initialLoadDone = useRef(false);

  const handleRoleChange = (selectedOption) => {
    setNewRole(selectedOption.value);
  };

  // Capturar errores globales que puedan causar página en blanco
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      originalError(...args);
    };

    // Manejar errores no capturados
    const handleError = (event) => {
      addNotification(
        "Error crítico detectado: " + event.error?.message,
        "danger"
      );
      event.preventDefault();
    };

    window.addEventListener("error", handleError);

    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Cargar usuarios desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const usersData = await userService.getAllUsers();

        if (usersData && usersData.length > 0) {
          setUsers(usersData);
          if (!initialLoadDone.current) {
            addNotification(
              `Se cargaron ${usersData.length} usuarios correctamente`,
              "success"
            );
          }
        } else {
          setUsers([]);
          if (!initialLoadDone.current) {
            addNotification(
              "No se encontraron usuarios en la base de datos.",
              "warning"
            );
          }
        }
      } catch (error) {
        // El error es lanzado por el servicio y capturado aquí.
        const errorMessage =
          error.response?.data?.message ||
          "Error de conexión al cargar usuarios.";
        addNotification(errorMessage, "danger");
      } finally {
        setLoading(false);
        initialLoadDone.current = true;
      }
    };

    fetchUsers();
  }, [user]);

  // Función para recargar usuarios
  const handleReloadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      addNotification(
        `Usuarios recargados exitosamente. Total: ${usersData?.length || 0}`,
        "success"
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error de conexión al recargar usuarios.";
      addNotification(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  // Manejar edición de rol
  const handleEditRole = (userData) => {
    setSelectedUser(userData);
    setNewRole(userData.role);
    setShowEditModal(true);
  };

  // Guardar cambios de rol
  const handleSaveRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      setShowEditModal(false);
      return;
    }

    try {
      setUpdateLoading(true);
      const updatedUser = await userService.updateUserRole(
        selectedUser.id,
        newRole
      );

      // Actualizar en la lista local inmediatamente
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );

      addNotification(
        `Rol actualizado exitosamente para ${selectedUser.name} ${selectedUser.lastname}`,
        "success"
      );
      setShowEditModal(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error de conexión al actualizar el rol.";
      addNotification(errorMessage, "danger");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Obtener badge variant según el rol
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "OWNER":
        return "success";
      case "MANAGEMENT":
        return "warning";
      case "USER":
        return "secondary";
      default:
        return "light";
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" style={{ color: "#34b890" }} />
        <p className="ms-3 mb-0">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <Container className="mt-2 user-management-container">
      {/* Título principal con el estilo unificado */}
      <h1 className="text-center section-title">Gestión de Usuarios</h1>

      {/* Contenedor para el botón de recarga, alineado a la derecha */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          className="back-button"
          onClick={handleReloadUsers}
          disabled={loading}
          style={{ "--service-color": "#007bff" }}
        >
          {/* El icono de recarga de Bootstrap */}
          <ArrowClockwise className="me-2" size={20} />
          {loading ? "Cargando..." : "Recargar"}
        </Button>
      </div>

      <Row>
        <Col>
          <Card className="user-management-card">
            <Card.Body>
              <Table
                striped
                bordered
                hover
                responsive
                className="user-table text-center"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol Actual</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((userData) => (
                      <tr key={userData.id}>
                        <td>{userData.id}</td>
                        <td>
                          {userData.name} {userData.lastname}
                        </td>
                        <td>{userData.email}</td>
                        <td>
                          <Badge
                            bg={getRoleBadgeVariant(userData.role)}
                            className="role-badge"
                          >
                            {userData.role}
                          </Badge>
                        </td>
                        <td>
                          {/* 2. Envolvemos el botón con RoleBasedComponent */}
                          <RoleBasedComponent requiredRole="ADMIN">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditRole(userData)}
                              className="me-2 edit-role-btn"
                            >
                              Editar Rol
                            </Button>
                          </RoleBasedComponent>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="text-muted">
                          <br />
                          {loading
                            ? "Cargando usuarios..."
                            : "No se encontraron usuarios"}
                          <br />
                          <small>
                            {
                              "La base de datos no contiene usuarios registrados"
                            }
                          </small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para editar rol */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Rol de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                <strong>Usuario:</strong> {selectedUser.name}{" "}
                {selectedUser.lastname}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Rol actual:</strong>{" "}
                <Badge bg={getRoleBadgeVariant(selectedUser.role)}>
                  {selectedUser.role}
                </Badge>
              </p>

              <Form.Group className="mt-3">
                <Form.Label>Nuevo Rol:</Form.Label>
                <Select
                  options={roleOptions}
                  value={roleOptions.find((option) => option.value === newRole)}
                  onChange={handleRoleChange}
                  styles={customSelectStyles}
                  isDisabled={updateLoading}
                  placeholder="-- Elige un rol --"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={updateLoading}
          >
            Cancelar
          </Button>
          <Button
            className="save-changes-btn"
            onClick={() => {
              try {
                handleSaveRole();
              } catch (error) {
                addNotification(
                  "Error crítico al guardar rol: " + error.message,
                  "danger"
                );
                setUpdateLoading(false);
              }
            }}
            disabled={updateLoading || newRole === selectedUser?.role}
          >
            {updateLoading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2 update-spinner"
                />
                Actualizando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
