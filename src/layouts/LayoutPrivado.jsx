import { useState, useEffect } from "react";
import AppSidebar from "../components/sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import "./LayoutPrivado.css";

function LayoutPrivado({ toggled, setToggled }) {
  const [collapsed, setCollapsed] = useState(false);
  const [layoutMarginLeft, setLayoutMarginLeft] = useState(250);

  useEffect(() => {
    if (collapsed) {
      setLayoutMarginLeft(80);
    } else {
      const timer = setTimeout(() => setLayoutMarginLeft(250), 140);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  const mainStyle = {
    marginLeft: `${layoutMarginLeft}px`,
    transition: "margin-left 420ms cubic-bezier(.2,.8,.2,1)",
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
        <main
          className="flex-grow-1 p-3 main-content mainLayout"
          style={mainStyle}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutPrivado;