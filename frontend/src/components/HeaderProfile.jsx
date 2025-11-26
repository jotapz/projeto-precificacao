import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect } from "react";
import ProfileMenu from "./ProfileMenu";

import { FaChevronDown } from "react-icons/fa"; 

function HeaderProfile() {
  const [showMenu, setShowMenu] = useState(false);
  const profileRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white py-3 shadow-sm" style={{ borderBottom: "1px solid #f0f0f0" }}>
      <nav className="navbar navbar-expand-lg navbar-light">
        
        {/* Adicionei 'position-relative' para garantir a centralização absoluta do título se precisar */}
        <div className="container-fluid px-5 position-relative">
          
          {/* LOGO */}
          <a
            href="#"
            className="navbar-brand d-flex align-items-center gap-3 fw-bold fs-3 text-decoration-none"
            style={{ color: "#044CF4" }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s"
              alt="Logo"
              width="50" // Diminuí levemente para ficar mais harmônico
              height="50"
            />
            NAF
          </a>

          {/* TÍTULO CENTRALIZADO */}
          {/* Usei mx-auto para centralizar e diminuí um pouco a fonte para fs-3 para ficar mais elegante */}
          <h1 className="fw-normal fs-3 text-secondary mx-auto d-none d-lg-block m-0">
            Sistema Precificação
          </h1>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* ÁREA DO PERFIL */}
          <div
            className="collapse navbar-collapse justify-content-end flex-grow-0"
            id="navbarNav"
            ref={profileRef}
          >
            <ul className="navbar-nav align-items-center">
              <li className="nav-item position-relative">
                
                {/* BOTÃO DE PERFIL REFEITO */}
                <div 
                  className="d-flex align-items-center gap-2 p-1 pe-3 rounded-pill"
                  style={{ 
                    cursor: "pointer", 
                    transition: "background 0.2s",
                    border: showMenu ? "1px solid #dee2e6" : "1px solid transparent" // Efeito sutil ao clicar
                  }}
                  onClick={() => setShowMenu(!showMenu)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  
                  {/* Avatar com Iniciais (Estilo Google/Moderno) */}
                  <div 
                    className="d-flex justify-content-center align-items-center rounded-circle text-secondary fw-bold border"
                    style={{ 
                      width: "45px", 
                      height: "45px", 
                      backgroundColor: "#f8f9fa", // Cinza bem clarinho
                      fontSize: "1.1rem",
                      letterSpacing: "-1px"
                    }}
                  >
                    NC {/* Iniciais de "Nome Cadastrado" ou pegue do localStorage */}
                  </div>

                  {/* Seta indicativa */}
                  <FaChevronDown size={12} className="text-secondary opacity-50" />
                
                </div>

                {/* MENU SUSPENSO */}
                {showMenu && (
                  <div style={{ position: "absolute", right: 0, top: "110%", zIndex: 1000 }}>
                    <ProfileMenu />
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderProfile;