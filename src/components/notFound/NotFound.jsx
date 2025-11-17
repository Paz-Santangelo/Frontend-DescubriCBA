import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import { ArrowLeft } from "react-bootstrap-icons";
import notFoundAnimation from "../../assets/Not-Found-Page.json";

const NotFound = React.memo(() => {
  return (
    <div className="not-found-container">
      <Lottie
        animationData={notFoundAnimation}
        loop
        autoplay
        className="lottie-animation"
      />
      <h1 className="not-found-title">¡Ups! Página no encontrada</h1>
      <p className="not-found-text">
        Parece que te has perdido. La página que buscas no existe o no tienes
        permisos para verla.
      </p>
      <Link to="/" className="not-found-button">
        <ArrowLeft size={20} className="me-2" />
        Volver al Inicio
      </Link>
    </div>
  );
});

export default NotFound;
