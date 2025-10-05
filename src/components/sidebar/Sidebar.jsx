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
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useRef } from "react";

function AppSidebar({ collapsed, setCollapsed, toggled, setToggled }) {
  const { user } = useUser();
  const location = useLocation();
  const sidebarContainerRef = useRef(null);

  const TooltipMenuItem = ({ collapsed, tooltipText, children }) => {
    if (collapsed) {
      return (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          container={sidebarContainerRef.current}
          popperConfig={{
            strategy: "fixed",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -160], // distancia lateral reducida
                },
              },
            ],
          }}
          overlay={
            <Tooltip
              id={`tooltip-${tooltipText.replace(/\s/g, "")}`}
              className="sidebar-tooltip"
            >
              {tooltipText}
            </Tooltip>
          }
        >
          <span>{children}</span>
        </OverlayTrigger>
      );
    }
    return <>{children}</>;
  };

  const commonMenuButtonStyle = ({ active }) => ({
    color: active ? "#ffffff" : "#f8f9fa",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#495E57",
      color: "#ffffff",
    },
  });

  return (
    <div className="sidebar-container" ref={sidebarContainerRef}>
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
          <TooltipMenuItem collapsed={collapsed} tooltipText="Mi Perfil">
            <MenuItem
              active={location.pathname === "/mi-perfil"}
              icon={<Person size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
              component={<Link to="/mi-perfil" />}
            >
              Mi Perfil
            </MenuItem>
          </TooltipMenuItem>

          <TooltipMenuItem
            collapsed={collapsed}
            tooltipText="Todos los Destinos"
          >
            <MenuItem
              active={location.pathname === "/destinos"}
              icon={<House size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
              component={<Link to="/destinos" />}
            >
              Todos los Destinos
            </MenuItem>
          </TooltipMenuItem>

          {user.role === "OWNER" && (
            <TooltipMenuItem
              collapsed={collapsed}
              tooltipText="Mis Propiedades"
            >
              <MenuItem
                active={location.pathname === "/mis-propiedades"}
                icon={<Building size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
                component={<Link to="/mis-propiedades" />}
              >
                Mis Propiedades
              </MenuItem>
            </TooltipMenuItem>
          )}

          {user.role === "ADMIN" && (
            <TooltipMenuItem collapsed={collapsed} tooltipText="Usuarios">
              <MenuItem
                active={location.pathname === "/usuarios"}
                icon={<Person size={22} stroke="#f8f9fa" strokeWidth={0.5} />}
                component={<Link to="/usuarios" />}
              >
                Usuarios
              </MenuItem>
            </TooltipMenuItem>
          )}

          <TooltipMenuItem collapsed={collapsed} tooltipText="Cerrar Sesión">
            <MenuItem
              active={location.pathname === "/"}
              icon={
                <BoxArrowRight size={22} stroke="#f8f9fa" strokeWidth={0.5} />
              }
              component={<Link to="/" />}
            >
              Cerrar Sesión
            </MenuItem>
          </TooltipMenuItem>
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
