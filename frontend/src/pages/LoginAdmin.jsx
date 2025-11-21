import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginAdmin() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (matricula.trim() !== "" && senha.trim() !== "") {
        localStorage.setItem('userType', 'admin'); 
        navigate("/admin-dashboard"); 
    } else {
        alert("Por favor, preencha matrícula e senha.");
    }
  }

  return (

    <div className="d-flex flex-column vh-100 overflow-hidden">
      

      <Header />
      <div 
        className="d-flex justify-content-center align-items-center flex-grow-1" 
        style={{ backgroundColor: "#004AF7" }}
      >

        <div
          className="bg-white p-4 rounded-4 shadow w-100 text-center d-flex flex-column"
          style={{ maxWidth: "700px", justifyContent: "center", minHeight: "400px" }}
          data-aos="zoom-in">
          
          <h2 className="text-center mb-2 mt-4 fw-bold">Área Administrativa</h2>
          <p className="text-muted small mb-0">Acesso restrito para colaboradores</p>
          <hr className="mx-auto opacity-25" style={{ width: "45%", color: "gray" }} />

          <form onSubmit={handleLogin}>
            
            <div className="mb-3 mt-4 d-flex justify-content-center">
              <input
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                type="text"
                className="form-control rounded-4 py-2 px-3 bg-light shadow-sm border-0"
                style={{ width: "80%", maxWidth: "300px" }}
                placeholder="Digite sua Matrícula"
                required
              />
            </div>

            <div className="mb-3 d-flex justify-content-center">
              <div className="input-group shadow-sm rounded-4 overflow-hidden" style={{ width: "80%", maxWidth: "300px" }}>
                <input
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  type={mostrarSenha ? "text" : "password"}
                  className="form-control bg-light border-0 py-2 px-3"
                  style={{ boxShadow: "none" }}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  className="btn btn-light border-0 d-flex align-items-center px-3"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary rounded-pill mt-3 btn-hover-lift" style={{ width: "80%", maxWidth: "100px", backgroundColor: "#004AF7" }}>
              Acessar
            </button>

            <button><Link to="/admin-dashboard">clica e vai</Link></button>
          </form>

          <div className="text-center mt-4">
            <div className="border-top pt-3 w-75 mx-auto">
              <p className="mb-0 text-muted">
                Não é administrador? <br/>
                <Link to="/Login" className="fw-bold text-decoration-none" style={{ color: "#004AF7" }}>
                   Voltar para Login de Usuário
                </Link> 
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;