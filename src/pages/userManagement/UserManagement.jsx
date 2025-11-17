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
  InputGroup,
} from "react-bootstrap";
import { ArrowClockwise, Search } from "react-bootstrap-icons";
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleRoleChange = (selectedOption) => {
    setNewRole(selectedOption.value);
  };

  // Manejar errores no capturados
  useEffect(() => {
    const handleError = (event) => {
      addNotification("Error crítico detectado: " + event.error?.message, "danger");
      event.preventDefault();
    };
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, [addNotification]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      if (!initialLoadDone.current) {
        addNotification(`Se cargaron ${usersData.length} usuarios`, "success");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al cargar usuarios.";
      addNotification(errorMessage, "danger");
    } finally {
      setLoading(false);
      initialLoadDone.current = true;
    }
  };

  // Carga inicial de usuarios
  useEffect(() => {
    if (!initialLoadDone.current) {
        fetchUsers();
    }
  }, [user]);

  // Búsqueda con debounce
  useEffect(() => {
    const performSearch = async (query) => {
      if (query.trim() === "") {
        if (initialLoadDone.current) {
            await fetchUsers();
        }
        return;
      }
      try {
        setLoading(true);
        let results = [];
        if (query.includes("@")) {
          try {
            const userByEmail = await userService.getUserByEmail(query);
            if (userByEmail) results = [userByEmail];
          } catch {
            results = await userService.searchUsers(query);
          }
        } else {
          results = await userService.searchUsers(query);
        }
        setUsers(results);
        addNotification(`Se encontraron ${results.length} resultados`, "info");
      } catch (error) {
        setUsers([]);
        addNotification(error.response?.data?.message || "Error en la búsqueda", "warning");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (initialLoadDone.current) {
        performSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleReloadUsers = async () => {
    if (searchQuery) {
      setSearchQuery("");
    } else {
      await fetchUsers();
    }
  };

  const handleEditRole = (userData) => {
    setSelectedUser(userData);
    setNewRole(userData.role);
    setShowEditModal(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      setShowEditModal(false);
      return;
    }

    try {
      setUpdateLoading(true);
      await userService.updateUserRole(selectedUser.id, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      addNotification(
        `Rol actualizado para ${selectedUser.name} ${selectedUser.lastname}`,
        "success"
      );
      setShowEditModal(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el rol.";
      addNotification(errorMessage, "danger");
    } finally {
      setUpdateLoading(false);
    }
  };

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

  if (loading && !initialLoadDone.current) {
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

      {/* Contenedor para controles de búsqueda y recarga */}
      <div className="position-relative mb-3" style={{ minHeight: "38px" }}>
        
        {/* Campo de búsqueda centrado */}
        <div className="d-flex justify-content-center">
          <InputGroup className="user-search-input-group">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, apellido o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-search-input"
            />
          </InputGroup>
        </div>

        {/* Botón de recarga a la derecha */}
        <div className="position-absolute" style={{ top: 0, right: 0 }}>
          <Button
            className="back-button"
            onClick={handleReloadUsers}
            disabled={loading}
            style={{ "--service-color": "#007bff" }}
          >
            <ArrowClockwise size={20} />
            {loading && searchQuery === "" ? "Cargando..." : "Recargar"}
          </Button>
        </div>
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
