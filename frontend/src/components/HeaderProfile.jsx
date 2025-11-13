import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

export const PROFILE_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
    <header className="bg-white bg-opacity-75 py-3 shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-5">
          <a
            href="#"
            className="navbar-brand d-flex align-items-center gap-3 fw-bold fs-2 ms-3"
            style={{ color: "#044CF4" }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s"
              alt="Logo"
              width="60"
              height="60"
            />
            NAF
          </a>

          <h1 className="fw-normal">Sistema Precificação</h1>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end flex-grow-0"
            id="navbarNav"
            ref={profileRef}
          >
            <ul className="navbar-nav gap-4 fs-5">
              <li className="nav-item">
                <img
                  src={PROFILE_IMAGE}
                  alt="Profile"
                  width="60"
                  height="60"
                  className="rounded-circle button-profile"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && <ProfileMenu />}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderProfile;
