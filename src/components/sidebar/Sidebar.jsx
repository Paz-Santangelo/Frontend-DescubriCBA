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
  const location = useLocation();

  const commonMenuButtonStyle = ({ active }) => ({
    color: active ? "#ffffff" : "#f8f9fa",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#495E57",
      color: "#ffffff",
    },
  });

  return (
    <div className="sidebar-container">
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint="lg"
        backgroundColor="#344944"
      >
        <Menu
          className="menu"
          iconShape="circle"
          menuItemStyles={{ button: commonMenuButtonStyle }}
        >
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
              Usuarios
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

      <button
        className="desktop-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
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