import React, { useState } from "react";
import CardProduto from "./CardProduto";
import CardMateria from "./CardMateria";
import CardCusto from "./CardCusto";
import CardPrecificacao from "./CardPrecificacao";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function NavBar() {
  const [mostrarCard, setMostrarCard] = useState(false);
  const [mostrarCard1, setMostrarCard1] = useState(false);
  const [mostrarCard2, setMostrarCard2] = useState(false);
  const [mostrarCard3, setMostrarCard3] = useState(false);
  
  

  return (
    <div>
      <nav className="p-3 mb-2 bg-primary text-white">
        <div
          className="container-fluid d-flex justify-content-center"
          style={{ gap: "7rem", fontSize: "1.4rem" }}
        >
          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>

            <NavLink
              to="/materia-prima"
              end
              className={({ isActive }) =>
                `nav-link text-white fw-semibold ${
                  isActive ? "border-bottom border-2 border-white" : ""
                }`
              }
            >
              Matéria-Prima
            </NavLink>

            {/* Ícone que mostra o Card ao passar o mouse */}
            <button
              type="button"
              className="btn btn-link text-white p-0"
              onMouseEnter={() => setMostrarCard(true)}
              onMouseLeave={() => setMostrarCard(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
            </button>
          </div>
           <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            
            <NavLink
              to="/custos"
              className={({ isActive }) =>
                `nav-link text-white fw-semibold ${
                  isActive ? "border-bottom border-2 border-white" : ""
                }`
              }
            >
              Custos
            </NavLink>
            <button
              type="button"
              className="btn btn-link text-white p-0"
              onMouseEnter={() => setMostrarCard1(true)}
              onMouseLeave={() => setMostrarCard1(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
            </button>
           </div>
           <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <NavLink
              to="/produtos"
              className={({ isActive }) =>
                `nav-link text-white fw-semibold ${
                  isActive ? "border-bottom border-2 border-white" : ""
                }`
              }
            >
              Produtos
            </NavLink>

            <button
              type="button"
              className="btn btn-link text-white p-0"
              onMouseEnter={() => setMostrarCard2(true)}
              onMouseLeave={() => setMostrarCard2(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
            </button>

           </div>
           <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <NavLink
              to="/precificacao"
              className={({ isActive }) =>
                `nav-link text-white fw-semibold ${
                  isActive ? "border-bottom border-2 border-white" : ""
                }`
              }
            >
              Sistema de Precificação
            </NavLink>
            <button
              type="button"
              className="btn btn-link text-white p-0"
              onMouseEnter={() => setMostrarCard3(true)}
              onMouseLeave={() => setMostrarCard3(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
            </button>
           </div>
        </div>
      </nav>

      {/* Card aparece apenas enquanto o mouse estiver sobre o botão */}
      {mostrarCard && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "9rem" }}>
          <CardProduto />
        </div>
      )}

      {mostrarCard1 && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "25rem" }}>
          <CardMateria />
        </div>
      )}

      {mostrarCard2 && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "39rem" }}>
          <CardCusto />
        </div>
      )}
      {mostrarCard3 && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "56rem" }}>
          <CardPrecificacao />
        </div>
      )}
    </div>
  );
}

export default NavBar;