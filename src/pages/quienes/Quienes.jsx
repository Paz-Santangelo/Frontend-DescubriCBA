import React from "react";
import "./quienes.css";
import { Carousel } from "react-bootstrap";

// Imágenes
import Instituto from "../../assets/instituto.jpg";
import Yamil from "../../assets/Yamil.jpg";
import Roxy from "../../assets/Roxy.jpg";
import Alejandro from "../../assets/Alejandro.jpg";
import MariaPaz from "../../assets/MariaPaz.jpg";
import EquipoFondo from "../../assets/equipo.jpg";

function Quienes() {
  const equipo = [
    { nombre: "Yamil Alvarado", descripcion: "Profesora de Práctica profesionalizante", foto: Yamil },
    { nombre: "María Roxana Mancuello", descripcion: "Desarrolladora FullStack", foto: Roxy },
    { nombre: "Alejandro Santángelo", descripcion: "Desarrollador FullStack", foto: Alejandro },
    { nombre: "María Paz Santángelo", descripcion: "Desarrolladora FullStack", foto: MariaPaz },
  ];

  return (
    <div className="quienes-container">
      {/* Título principal */}
      <h2 className="quienes-title">Quiénes Somos</h2>

      {/* Sección Instituto */}
      <section className="descripcion-instituto" style={{ backgroundImage: `url(${Instituto})` }}>
        <div className="overlay">
          <p>
            Somos estudiantes del Instituto Superior Dr. Bernardo Houssay, desarrollando la página web de turismo <strong>“Descubrí Córdoba”</strong>.
          </p>
        </div>
      </section>

      {/* Sección Equipo */}
      <h2 className="equipo-title">Nuestro Equipo</h2>
      <section className="equipo-foto-fondo" style={{ backgroundImage: `url(${EquipoFondo})` }}>
        <div className="overlay">
          <p className="descripcion-equipo">
            Nuestro objetivo es brindar información clara y atractiva sobre los destinos de la provincia,
            facilitando la experiencia de quienes nos visitan.
          </p>
          <div id="equipoCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
            <div className="carousel-inner">
              {equipo.map((miembro, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                  <div className="equipo-card text-center mx-auto">
                    <img src={miembro.foto} alt={miembro.nombre} />
                    <p className="nombre">{miembro.nombre}</p>
                    <p className="descripcion">{miembro.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Indicadores */}
            <div className="carousel-indicators">
              {equipo.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#equipoCarousel"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
                  aria-current={i === 0 ? "true" : undefined}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Quienes;
