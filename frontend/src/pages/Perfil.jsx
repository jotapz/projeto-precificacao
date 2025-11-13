import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { PROFILE_IMAGE } from "../components/HeaderProfile";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    try {
      const usuarioArmazenado = localStorage.getItem("usuario");

      if (!usuarioArmazenado) {
        setErro("Usuário não autenticado");
        return;
      }

      const dados = JSON.parse(usuarioArmazenado);
      setUsuario(dados);
    } catch (erro) {
      console.error("Erro:", erro);
      setErro("Erro ao carregar perfil");
    }
  }, []);

  if (erro) return <div className="alert alert-danger mt-5">{erro}</div>;

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div
        className="d-flex gap-4 flex-column border p-4 rounded shadow"
        style={{ width: "400px" }}
      >
        <h1>Meu perfil</h1>
        <div className="d-flex justify-content-center">
          <img
            src={PROFILE_IMAGE}
            alt="Foto de perfil"
            width="100"
            height="100"
            className="rounded-circle"
          />
        </div>
        <div>
          <ul className="list-unstyled d-flex flex-column gap-3">
            <li>
              <p className="fw-bold mb-1">Nome:</p>
              <p>{usuario?.nome || "Sem NOME cadastrado"}</p>
            </li>
            <li>
              <p className="fw-bold mb-1">Email:</p>
              <p>{usuario?.email || "Sem Email cadastrado"}</p>
            </li>
            <li>
              <p className="fw-bold mb-1">Bairro:</p>
              <p>{usuario?.bairro || "Sem BAIRRO cadastrado"}</p>
            </li>
            <li>
              <p className="fw-bold mb-1">CPF/CNPJ:</p>
              <p>{usuario?.cpf || "Sem CPF/CNPJ cadastrado"}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
