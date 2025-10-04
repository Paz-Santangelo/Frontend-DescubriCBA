import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  Person,
  House,
  BoxArrowRight,
  ChevronLeft,
  ChevronRight,
  Building,
} from "react-bootstrap-icons";
import { useUser } from "../../context/UserContext";
import "./Sidebar.css";

function AppSidebar({ collapsed, setCollapsed, toggled, setToggled }) {
  const { user } = useUser();
  const location = useLocation(); // Get location object

  return (
    <div
      className="sidebar-container"
      style={{
        position: "fixed",
        top: "76px",
        height: "calc(100vh - 76px)",
        zIndex: 102,
      }}
    >
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint="lg"
        backgroundColor="#344944"
        rootStyles={{
          height: "100%",
        }}
      >
        <Menu
          className="menu"
          iconShape="circle"
          menuItemStyles={{
            button: ({ active }) => { // Use function to get active state
              return {
                color: active ? "#ffffff" : "#f8f9fa",
                backgroundColor: active ? "#495E57" : "transparent",
                position: "relative",
                "&:hover": {
                  backgroundColor: "#495E57",
                  color: "#ffffff",
                },
                "&::after": {
                  content: '""',
                  display: active ? "block" : "none",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#39d8a8",
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                },
              };
            },
          }}
        >
          {/* Pass active prop manually based on location */}
          <MenuItem
            active={location.pathname === "/mi-perfil"}
            icon={<Person size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
            component={<Link to="/mi-perfil" />}
          >
            Mi Perfil
          </MenuItem>

          <MenuItem
            active={location.pathname === "/destinos"}
            icon={<House size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
            component={<Link to="/destinos" />}
          >
            Todos los Destinos
          </MenuItem>

          {user.role === "OWNER" && (
            <MenuItem
              active={location.pathname === "/mis-propiedades"}
              icon={<Building size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
              component={<Link to="/mis-propiedades" />}
            >
              Mis Propiedades
            </MenuItem>
          )}

          {user.role === "ADMIN" && (
            <MenuItem
              active={location.pathname === "/usuarios"}
              icon={<Person size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
              component={<Link to="/usuarios" />}
            >
              Usuarios Registrados
            </MenuItem>
          )}

          <MenuItem
            active={location.pathname === "/"}
            icon={<BoxArrowRight size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
            component={<Link to="/" />}
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Desktop toggle button */}
      <button
        className="desktop-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: "20px",
          left: collapsed ? "80px" : "250px",
          transform: "translateX(-50%)",
          backgroundColor: "#39d8a8",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          zIndex: 10,
          cursor: "pointer",
          color: "white",
          transition: "left 0.3s ease",
        }}
      >
        {collapsed ? (
          <ChevronRight size={20} stroke="white" strokeWidth={1} />
        ) : (
          <ChevronLeft size={20} stroke="white" strokeWidth={1} />
        )}
      </button>
    </div>
  );
}

export default AppSidebar;
