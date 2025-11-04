import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";


function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    alert("Login realizado com sucesso!");
    navigate("/"); // volta pra home
  }

  function sistemaPrec() {
    navigate("/SistemaPrec");
  }

  return (
    <div className="">
      <Header />
    <div className="bg-primary d-flex justify-content-center align-items-center vh-100">
      
      <div
        className="bg-white p-4 rounded shadow w-100 text-center"
        style={{ maxWidth: "600px", justifyContent: "center" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3 d-flex justify-content-center">
            <input type="email" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite seu email" required />
          </div>

          <div className="mb-3 d-flex justify-content-center">
            <input type="password" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite sua senha" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: "80%", maxWidth: "200px"}}>
            Entrar
          </button>
        </form>
        <button onClick={sistemaPrec} className="btn btn-secondary mt-3" style={{width: "80%", maxWidth: "200px"}}>
            Acessar Sistema de Precificação
          </button>
        <div className="text-center mt-3">
            <p>Não possui conta? <Link to="/registrar">Cadastre-se</Link> </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
