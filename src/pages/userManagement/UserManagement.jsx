import { useState, useEffect } from "react";
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
  Alert,
  Spinner,
} from "react-bootstrap";
import { useUser } from "../../hooks/useUser";
import RoleBasedComponent from "../../components/auth/RoleBasedComponent"; // 1. Importamos el componente
import userService from "../../services/userService";
import "./UserManagement.css";

const UserManagement = () => {
  const { user, hasRole } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Capturar errores globales que puedan causar página en blanco
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      originalError(...args);
      console.log("🚨 Error capturado en UserManagement:", args);
    };

    // Manejar errores no capturados
    const handleError = (event) => {
      console.error("🚨 Error no manejado:", event.error);
      setError("Error crítico detectado: " + event.error?.message);
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
        setError("");

        //console.log("🔄 Cargando usuarios desde el backend...");
        //console.log("🔄 Usuario actual:", user);
        /*console.log(
          "🔄 Token presente:",
          localStorage.getItem("jwt_token") ? "✅" : "❌"
        );*/

        // Ahora userService.getAllUsers() devuelve el array de usuarios directamente.
        const usersData = await userService.getAllUsers();

        /*         console.log('✅ Usuarios cargados exitosamente:', usersData);
        console.log('✅ Cantidad de usuarios:', usersData?.length || 0); */

        if (usersData && usersData.length > 0) {
          setUsers(usersData);
          setSuccess(`Se cargaron ${usersData.length} usuarios correctamente`);
        } else {
          setUsers([]);
          setError("No se encontraron usuarios en la base de datos.");
        }
      } catch (error) {
        // El error es lanzado por el servicio y capturado aquí.
        const errorMessage =
          error.response?.data?.message ||
          "Error de conexión al cargar usuarios.";
        console.error("❌ Error al cargar usuarios:", error.response || error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Función para recargar usuarios
  const handleReloadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("🔄 Recargando usuarios...");
      const usersData = await userService.getAllUsers();

      setUsers(usersData);
      setSuccess(
        `Usuarios recargados exitosamente. Total: ${usersData?.length || 0}`
      );
      //console.log("✅ Usuarios recargados:", usersData);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error de conexión al recargar usuarios.";
      console.error("❌ Error al recargar usuarios:", error.response || error);
      setError(errorMessage);
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
      setError("");
      setSuccess("");

      /*console.log(
        `🔄 Actualizando rol de ${selectedUser.email} de ${selectedUser.role} a ${newRole}`
      );*/

      // El servicio ahora devuelve el usuario actualizado directamente o lanza un error.
      const updatedUser = await userService.updateUserRole(
        selectedUser.id,
        newRole
      );

      //console.log("📥 Resultado de actualización:", updatedUser);

      // Actualizar en la lista local inmediatamente
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id
            ? { ...u, role: newRole } // O usar directamente updatedUser si el backend lo devuelve completo
            : u
        )
      );

      setSuccess(
        `Rol actualizado exitosamente para ${selectedUser.name} ${selectedUser.lastname}`
      );
      setShowEditModal(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error de conexión al actualizar el rol.";
      console.error(
        "❌ Error crítico al actualizar rol:",
        error.response || error
      );
      setError(errorMessage);
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
      case "CLIENTE":
        return "info";
      case "USER":
        return "secondary";
      default:
        return "light";
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando usuarios...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 user-management-container">
      <Row>
        <Col>
          <Card className="user-management-card">
            <Card.Header className="user-management-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-people-fill me-2"></i>
                  Gestión de Usuarios
                </h4>
                <div>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleReloadUsers}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    {loading ? "Cargando..." : "Recargar"}
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Alertas de éxito y error */}
              {success && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess("")}
                  className="alert-container"
                >
                  {success}
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                  className="alert-container"
                >
                  {error}
                </Alert>
              )}

                <Table striped bordered hover responsive className="user-table">
                  <thead className="table-dark">
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
                          <td className="text-center">
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
                            <Button variant="outline-info" size="sm">
                              Ver Perfil
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <div className="text-muted">
                            <i
                              className="bi bi-people me-2"
                              style={{ fontSize: "1.5em" }}
                            ></i>
                            <br />
                            {loading
                              ? "Cargando usuarios..."
                              : "No se encontraron usuarios"}
                            <br />
                            <small>
                              {error
                                ? "Error al cargar datos"
                                : "La base de datos no contiene usuarios registrados"}
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
                <Form.Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  disabled={updateLoading}
                >
                  <option value="USER">USER - Usuario normal</option>
                  <option value="CLIENTE">CLIENTE - Dueño de negocio</option>
                  <option value="MANAGEMENT">MANAGEMENT - Gestor</option>
                  <option value="ADMIN">ADMIN - Administrador</option>
                </Form.Select>
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
            variant="primary"
            onClick={() => {
              try {
                console.log("🔄 Botón Guardar presionado");
                console.log("📄 Selected User:", selectedUser);
                console.log("📄 New Role:", newRole);
                handleSaveRole();
              } catch (error) {
                console.error("❌ Error al ejecutar handleSaveRole:", error);
                setError("Error crítico al guardar rol: " + error.message);
                setUpdateLoading(false);
              }
            }}
            disabled={updateLoading || newRole === selectedUser?.role}
          >
            {updateLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
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
