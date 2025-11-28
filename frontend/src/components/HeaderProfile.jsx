export const PROFILE_IMAGE = "https:cdn-icons-png.flaticon.com/512/149/149071.png";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaUser } from "react-icons/fa"; 
import ProfileMenu from "./ProfileMenu";

function HeaderProfile() {
  const [showMenu, setShowMenu] = useState(false);
  const profileRef = useRef(null);
  
  const [iniciais, setIniciais] = useState(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const usuarioStorage = localStorage.getItem("usuario");
      const adminStorage = localStorage.getItem("adminInfo"); // Caso seja admin
      
      console.log("--- DEBUG HEADER ---");
      console.log("Storage Usuário:", usuarioStorage);
      
      let nome = "";

      if (usuarioStorage) {
        const dados = JSON.parse(usuarioStorage);
        nome = dados.nome || dados.name || ""; 
      } else if (adminStorage) {
        const dados = JSON.parse(adminStorage);
        nome = dados.nome || "Admin";
      }

      if (nome && nome.trim().length > 0) {
        const partes = nome.trim().split(" ");
        let letras = partes[0].charAt(0).toUpperCase();
        
        if (partes.length > 1) {
          letras += partes[1].charAt(0).toUpperCase();
        }
        setIniciais(letras);
      } else {
        setIniciais(null); 
      }

    } catch (error) {
      console.error("Erro Header:", error);
      setIniciais(null);
    }
  }, []);

  return (
    <header className="bg-white py-3 shadow-sm" style={{ borderBottom: "1px solid #f0f0f0" }}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-5 position-relative">
          
          <a href="#" className="navbar-brand d-flex align-items-center gap-3 fw-bold fs-3 text-decoration-none" style={{ color: "#044CF4" }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s"
              alt="Logo"
              width="50"
              height="50"
            />
            NAF
          </a>

          <h1 className="fw-normal fs-3 text-secondary mx-auto d-none d-lg-block m-0">
            Sistema Precificação
          </h1>

          <div className="collapse navbar-collapse justify-content-end flex-grow-0" id="navbarNav" ref={profileRef}>
            <ul className="navbar-nav align-items-center">
              <li className="nav-item position-relative">
                
                <div 
                  className="d-flex align-items-center gap-2 p-1 pe-3 rounded-pill"
                  style={{ 
                    cursor: "pointer", 
                    transition: "background 0.2s",
                    border: showMenu ? "1px solid #dee2e6" : "1px solid transparent"
                  }}
                  onClick={() => setShowMenu(!showMenu)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  
                  <div 
                    className="d-flex justify-content-center align-items-center rounded-circle border shadow-sm"
                    style={{ 
                      width: "45px", 
                      height: "45px", 
                      backgroundColor: "#044CF4", 
                      color: "#FFFFFF",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      letterSpacing: "-1px"
                    }}
                  >
                    {iniciais ? iniciais : <FaUser size={18} />}
                  </div>

                  <FaChevronDown size={12} className="text-secondary opacity-50" />
                
                </div>

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