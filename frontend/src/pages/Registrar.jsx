import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function Registrar() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

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
        body: JSON.stringify({ nome, email, senha, confirmarSenha, bairro, cpf, tipoNegocio }),
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
    <div className="">
      <Header />
      <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: "#004AF7", minHeight: "100vh", padding: "20px 0" }}>
        <div className="bg-white p-5 rounded-4 shadow w-100 text-center position-relative" style={{ maxWidth: "600px" }} data-aos="zoom-in">
          <FaArrowLeft size={20} className="position-absolute text-primary" style={{ top: "30px", left: "30px", cursor: "pointer" }} onClick={() => navigate(-1)} />
          <h2 className="fw-bold mb-3 mt-2">Registro</h2>
          <hr className="mx-auto opacity-25" style={{ width: "60%", color: "#ccc", borderTop: "2px solid" }} />
          <form onSubmit={handleRegistro} className="mt-4">
            <div className="mb-3 d-flex justify-content-center">
              <input value={nome} onChange={(e) => setNome(e.target.value)} type="text" className="form-control rounded-pill p-3 bg-light border-0 shadow-sm" style={{ width: "90%" }} placeholder="Digite seu nome completo" required />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control rounded-pill p-3 bg-light border-0 shadow-sm" style={{ width: "90%" }} placeholder="Digite seu e-mail" required />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <input value={bairro} onChange={(e) => setBairro(e.target.value)} type="text" className="form-control rounded-pill p-3 bg-light border-0 shadow-sm" style={{ width: "90%" }} placeholder="Digite seu Bairro" required />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <div className="input-group shadow-sm rounded-pill overflow-hidden" style={{ width: "90%" }}>
                <input value={senha} onChange={(e) => setSenha(e.target.value)} type={mostrarSenha ? "text" : "password"} className="form-control bg-light border-0 p-3" style={{ boxShadow: "none" }} placeholder="Digite sua senha" required />
                <button type="button" className="btn btn-light border-0 px-3 d-flex align-items-center" onClick={() => setMostrarSenha(!mostrarSenha)}>
                  {mostrarSenha ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
                </button>
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <div className="input-group shadow-sm rounded-pill overflow-hidden" style={{ width: "90%" }}>
                <input value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} type={mostrarConfirmarSenha ? "text" : "password"} className="form-control bg-light border-0 p-3" style={{ boxShadow: "none" }} placeholder="Confirme sua senha" required />
                <button type="button" className="btn btn-light border-0 px-3 d-flex align-items-center" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
                  {mostrarConfirmarSenha ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
                </button>
              </div>
            </div>
            <div className="mb-4 d-flex flex-column align-items-center">
              <div style={{ width: "90%" }} className="text-start mb-1"><small className="text-muted ms-3">* Opcional</small></div>
              <input value={cpf} onChange={(e) => setCpf(e.target.value)} type="text" className="form-control rounded-pill p-3 bg-light border-0 shadow-sm" style={{ width: "90%" }} placeholder="Digite seu CPF" />
            </div>
            <div className="mb-4 d-flex flex-column align-items-center">
              <div style={{ width: "90%" }} className="text-start mb-1"><small className="text-muted ms-3">Tipo de negócio (opcional)</small></div>
              <select value={tipoNegocio} onChange={(e) => setTipoNegocio(e.target.value)} className="form-select rounded-pill p-3 bg-light border-0 shadow-sm" style={{ width: "90%" }}>
                <option value="">Selecione o tipo de negócio</option>
                <option value="pastelaria">Pastelaria</option>
                <option value="pizzaria">Pizzaria</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary rounded-pill py-3 fw-bold btn-hover-lift mx-auto d-block" style={{ width: "80%", maxWidth: "150px", backgroundColor: "#004AF7" }}>Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registrar;