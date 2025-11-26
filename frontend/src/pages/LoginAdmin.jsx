import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginAdmin() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdmins, setHasAdmins] = useState(true);

  useEffect(() => {
    async function checkAdmins() {
      try {
        const res = await fetch('http://localhost:3000/api/admin/exists');
        if (!res.ok) return setHasAdmins(true);
        const body = await res.json();
        setHasAdmins(Boolean(body?.hasAdmins));
      } catch (err) {
        console.error('checkAdmins', err);
        setHasAdmins(true);
      }
    }
    checkAdmins();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    if (matricula.trim() === "" || senha.trim() === "") {
      setError("Por favor, preencha matrícula e senha.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula: matricula.trim(), senha })
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.message || 'Falha ao autenticar');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', body.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('adminInfo', JSON.stringify(body.admin));
      setLoading(false);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('login error', err);
      setError('Erro de conexão');
      setLoading(false);
    }
  }

  function handleBypass() {
    localStorage.setItem('userType', 'admin');
    localStorage.setItem('adminBypass', '1');
    navigate('/admin-dashboard');
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

            {error && (
              <div className="alert alert-danger w-75 mx-auto" role="alert">{error}</div>
            )}

            <div className="d-flex justify-content-center mt-3">
              <button 
                type="submit" 
                className="btn btn-primary rounded-pill btn-hover-lift d-flex align-items-center justify-content-center" 
                style={{ width: "140px", backgroundColor: "#004AF7", border: "none" }} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Acessando...
                  </>
                ) : 'Acessar'}
              </button>
            </div>

            {/* bypass button for initial setup */}
            {!hasAdmins && (
              <div className="mt-3">
                <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={handleBypass}>
                  Entrar sem login (apenas enquanto não houver administradores)
                </button>
              </div>
            )}
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