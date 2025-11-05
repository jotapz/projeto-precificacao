import React from "react";
import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

function ProfileMenu() {
  return (
    <div
      className="card position-absolute shadow mt-2"
      style={{
        right: 0,
        width: "150px",
        zIndex: 1000,
      }}
    >
      <ul className="list-group list-group-flush">
        <li className="list-group-item list-group-item-action">
          <Link to="/Perfil" className="text-decoration-none text-dark d-block">
            Perfil{" "}
          </Link>
        </li>

        <li className="list-group-item list-group-item-action text-danger">
          <Link to="/Login" className="text-decoration-none text-danger d-block">Sair</Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileMenu;
