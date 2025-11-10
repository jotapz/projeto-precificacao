//implementação das chamadas pra API
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Registrar() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bairro, setBairro] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");

  async function handleRegistro(e) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }

    try {
  const res = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, confirmarSenha, bairro, cpf })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        alert(data.message || "Erro ao registrar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  }

  return (
    <div className="fade-in">
      <Header />
    <div className="bg-primary d-flex justify-content-center align-items-center vh-100">
      <div
        className="bg-white p-4 rounded shadow w-100 text-center"
        style={{ maxWidth: "600px"}}

      >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-short form-label align-self-start" viewBox="0 0 16 16" style={{cursor: "pointer", position: "relative", right: "270px", bottom: "10px",}} onClick={() => navigate(-1)}>
          <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
        </svg>
        <h2 className="text-center mb-4 text-primary fw-bold">Registro</h2>

        <form onSubmit={handleRegistro}>

          <div className="mb-3 d-flex justify-content-center">
            <input value={nome} onChange={e => setNome(e.target.value)} type="text" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite seu nome completo" required />
          </div>

          <div className="mb-3 d-flex justify-content-center">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite seu e-mail" required />
          </div>

          <div className="mb-3 d-flex justify-content-center">
            <input value={bairro} onChange={e => setBairro(e.target.value)} type="text" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite sua Bairro" required />
          </div>

          <div className="mb-3 d-flex justify-content-center">
            <input value={senha} onChange={e => setSenha(e.target.value)} type="password" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite sua senha" required />
          </div>

          <div className="mb-3 d-flex justify-content-center">

          <input value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} type="password" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Confirme sua senha" required />
          </div>
          <div className="mb-3 d-flex flex-column align-items-center">
            <label className="form-label align-self-start" style={{ width: "80%", maxWidth: "200px" }}>* Opcional</label>
            <input value={cpf} onChange={e => setCpf(e.target.value)} type="text" className="form-control rounded-4 py-2 px-3" style={{width: "80%", maxWidth: "500px"}} placeholder="Digite seu CPF" />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: "80%", maxWidth: "200px"}}>
            Registrar
          </button>
        </form>
        
      </div>
    </div>
    </div>
  );
}

export default Registrar;
