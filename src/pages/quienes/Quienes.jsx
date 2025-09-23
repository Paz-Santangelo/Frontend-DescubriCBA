import React from "react";
import "./quienes.css";
import { Carousel } from "react-bootstrap";

// Importar imágenes
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
      <h1 className="quienes-title">Quiénes Somos</h1>

      {/* Sección Instituto */}
      <section
        className="descripcion-instituto"
        style={{ backgroundImage: `url(${Instituto})` }}
      >
        <div className="overlay">
          <p>
            Somos estudiantes del Instituto Superior Dr. Bernardo Houssay, desarrollando la página web de turismo <strong>“Descubrí Córdoba”</strong>.
          </p>
        </div>
      </section>

      {/* Sección Equipo */}
      <section
        className="equipo-foto-fondo"
        style={{ backgroundImage: `url(${EquipoFondo})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="overlay">
          <h2 className="quienes-subtitle">Nuestro Equipo</h2>
          <p className="descripcion-equipo">
            Nuestro objetivo es brindar información clara y atractiva sobre los destinos de la provincia,
            facilitando la experiencia de quienes nos visitan.
          </p>

          {/* Carousel react-bootstrap */}
          <Carousel interval={6000} className="equipo-carousel">
            {equipo.map((miembro, index) => (
              <Carousel.Item key={index}>
                <div className="equipo-card text-center mx-auto">
                  <img src={miembro.foto} alt={miembro.nombre} />
                  <p className="nombre">{miembro.nombre}</p>
                  <p className="descripcion">{miembro.descripcion}</p>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </section>
    </div>
  );
}

export default Quienes;
