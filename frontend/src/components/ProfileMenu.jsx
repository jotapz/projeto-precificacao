import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Profile from "./Profile";
// import "bootstrap/dist/css/bootstrap.min.css";

function ProfileMenu() {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="card position-absolute shadow mt-2"
      style={{
        right: 0,
        width: "150px",
        zIndex: 1000,
      }}
      ref={profileRef}
    >
      <ul className="list-group list-group-flush">
        <li
          className="list-group-item list-group-item-action"
          style={{ cursor: "pointer" }}
          onClick={() => setShowProfile(!showProfile)}
        >
          Perfil
        </li>
        

        <li className="list-group-item list-group-item-action text-danger">
          <Link
            to="/Login"
            className="text-decoration-none text-danger d-block"
          >
            Sair
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileMenu;
