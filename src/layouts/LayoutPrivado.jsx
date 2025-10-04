import { useState } from "react";
import AppNavbar from "../components/navbar/Navbar";
import AppSidebar from "../components/sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import "./LayoutPrivado.css";

function LayoutPrivado({toggled, setToggled}) {
  const [collapsed, setCollapsed] = useState(false);

  const mainStyle = {
    marginLeft: collapsed ? "80px" : "250px",
    transition: "margin-left 0.3s ease",
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1 private-layout">
        <AppSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          toggled={toggled}
          setToggled={setToggled}
        />
        <main className="flex-grow-1 p-3 main-content mainLayout" style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutPrivado;
