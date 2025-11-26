import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaSignOutAlt } from "react-icons/fa"; 

function ProfileMenu() {
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const primeiroNome = usuario?.nome?.split(" ")[0] || "Visitante";

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="card position-absolute shadow-lg border-0 rounded-4 overflow-hidden"
      style={{
        right: 0,
        top: "100%",       
        marginTop: "10px",  
        width: "240px",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-out"
      }}
    >
    
      <div className="px-4 py-3 bg-light border-bottom">
        <p className="mb-0 small text-muted">Logado como</p>
        <p className="mb-0 fw-bold text-dark">{primeiroNome}</p>
      </div>

      <div className="list-group list-group-flush py-2">
        
        <Link
          to="/Perfil"
          className="list-group-item list-group-item-action border-0 px-4 py-2 d-flex align-items-center gap-3 text-secondary"
        >
          <FaUser size={14} /> 
          <span>Meu Perfil</span>
        </Link>

        <hr className="my-2 mx-3 opacity-25" />

        <button
          onClick={handleLogout}
          className="list-group-item list-group-item-action border-0 px-4 py-2 d-flex align-items-center gap-3 text-danger bg-transparent w-100 text-start"
        >
          <FaSignOutAlt size={14} />
          <span className="fw-bold">Sair</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileMenu;