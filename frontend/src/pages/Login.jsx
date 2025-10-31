import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    alert("Login realizado com sucesso!");
    navigate("/"); // volta pra home
  }

  return (
    <div className="bg-primary d-flex justify-content-center align-items-center vh-100">
      <div
        className="bg-white p-4 rounded shadow w-100"
        style={{ maxWidth: "600px", marginBottom: "300px" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control" required />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
        <div className="text-center mt-3">
            <p>Não possui conta? <Link to="/registrar">Cadastre-se</Link> </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
