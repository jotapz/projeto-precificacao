import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function HeaderProfile() {
  return (
    <header className="bg-white bg-opacity-75 py-3 shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-5">
          <a href="#" className="navbar-brand d-flex align-items-center gap-3 text-primary fw-bold fs-2 ms-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s"
              alt="Logo"
              width="60"
              height="60"
            />
            NAF
          </a>

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
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-4 fs-5">

            <li className="nav-item">
              <Link to="/profile-popup" className="button-profile" aria-label="Abrir perfil">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" width="60" height="60" className="rounded-circle"/>
              </Link>
            </li> 
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderProfile;