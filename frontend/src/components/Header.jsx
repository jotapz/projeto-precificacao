import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white bg-opacity-75 py-3 shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-5">
          {/* Logo e nome */}
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
                <Link to="/" className="nav-link text-dark fw-medium">
                Início
                </Link>
              </li>


              <li className="nav-item">
                <a className="nav-link text-dark fw-medium" href="#">Sobre</a>
              </li>


              <li className="nav-item">
                <Link to="/login" className="nav-link text-dark fw-medium">
                Entrar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;