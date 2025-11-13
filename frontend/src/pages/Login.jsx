//implementação das chamadas pra API
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // icones

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userId', data.usuario._id);
        localStorage.setItem('usuario', JSON.stringify(data.usuario)); // armazena dados do usuário
        alert(data.message || "Login realizado com sucesso!");
        navigate("/SistemaPrec"); // redireciona para o sistema
      } else {
        alert(data.message || "Falha ao logar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  }

  function sistemaPrec() {
    navigate("/SistemaPrec");
  }

  return (
    <div className="">
      <Header />
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#004AF7" }}>

        <div
          className="bg-white p-4 rounded-4 shadow w-100 text-center"
          style={{ maxWidth: "700px", justifyContent: "center", minHeight: "400px" }}
          data-aos="zoom-in">
          <h2 className="text-center mb-2 mt-5 fw-bold">Login</h2>
          <hr className="mx-auto opacity-25" style={{ width: "45%", color: "gray" }} />

          <form onSubmit={handleLogin}>
            {/* Input de Email */}
            <div className="mb-3 mt-4 d-flex justify-content-center">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="form-control rounded-4 py-2 px-3 bg-light shadow-sm border-0"
                style={{ width: "80%", maxWidth: "300px" }}
                placeholder="Digite seu email"
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
              Entrar
            </button>
          </form>
          <div className="text-center mt-3">
            <p>Não possui conta? <Link to="/registrar">Cadastre-se</Link> </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;