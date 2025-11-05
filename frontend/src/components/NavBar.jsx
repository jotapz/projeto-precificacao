import React, { useState } from "react";
import CardProduto from "./CardProduto";
import CardMateria from "./CardMateria";
import CardCusto from "./CardCusto";
import CardPrecificacao from "./CardPrecificacao";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Materiaprima from "./Materiaprimapage";
import ProdutoPage from "./ProdutoPage";
import CustosPage from "./CustosPage";
import PrecificacaoPage from "./PrecificacaoPage";


function NavBar() {
  const [mostrarCard, setMostrarCard] = useState(false);
  const [mostrarCard1, setMostrarCard1] = useState(false);
  const [mostrarCard2, setMostrarCard2] = useState(false);
  const [mostrarCard3, setMostrarCard3] = useState(false);
  const [ativo, setAtivo] = useState("materia");

  const handleClick = (nome) => {
    if (ativo !== nome) {
      setAtivo(nome);
    }
  };
  
  

  return (
    <div>
      <nav className="p-3 mb-2 text-white" style={{ backgroundColor: "#044CF4", boxShadow: "0 5px 10px rgba(0, 0, 0, 0.35)" }}>
        <div
          className="container-fluid d-flex justify-content-center"
          style={{ gap: "7rem", fontSize: "1.4rem" }}
        >
          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>

            <button
              onClick={() => handleClick("materia")}
              className={`bg-transparent border-0 text-white font-bold focus:outline-none ${
              ativo === "materia" ? "border-bottom border-white" : ""}`}
            >
              Matéria-Prima
            </button>

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
            
            <button
              onClick={() => handleClick("custo")}
              className={`bg-transparent border-0 text-white font-bold focus:outline-none ${
              ativo === "custo" ? "border-bottom border-white" : ""
            }`}
            >
              Custos
            </button>
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
            <button
              onClick={() => handleClick("produto")}
              className={`bg-transparent border-0 text-white font-bold focus:outline-none ${
              ativo === "produto" ? "border-bottom border-white" : ""
            }`}
            >
              Produtos
            </button>

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
            <button
              onClick={() => handleClick("precificacao")}
              className={`bg-transparent border-0 text-white font-bold focus:outline-none ${
              ativo === "precificacao" ? "border-bottom border-white" : ""
            }`}
            >
              Calculadora de preços
            </button>
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

      {mostrarCard && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "9rem" }}>
          <CardMateria />
        </div>
      )}

      {mostrarCard1 && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "25rem" }}>
          <CardCusto />
        </div>
      )}

      {mostrarCard2 && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "39rem" }}>
          <CardProduto />
        </div>
      )}
      {mostrarCard3 && (
        <div className="position-absolute " style={{ zIndex: 1000, marginLeft: "56rem" }}>
          <CardPrecificacao />
        </div>
      )}
    
    <div className="mt-4 d-flex justify-content-inter">
        {ativo === "materia" && <Materiaprima />}
        {ativo === "produto" && <ProdutoPage />}
        {ativo === "custo" && <CustosPage />}
        {ativo === "precificacao" && <PrecificacaoPage />}
      </div>
    
    </div>




  );
}

export default NavBar;