import React from "react";

function CardPrecificacao() {
  return (
    <div className="card border-info mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header d-flex align-items-center justify-content-between">
        Calculadora
        {/* ícone via classe bi (garanta import bootstrap-icons no main.jsx) */}
        <i
          className="bi bi-info-circle"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Esta é uma dica sobre o produto!"
          style={{ cursor: "pointer" }}
        ></i>
      </div>
      <div className="card-body text-info">
        <p className="card-text text-primary fw-bold">
          Depois de cadastrar tudo, é aqui que a mágica acontece!  Na calculadora, você escolhe o produto, define o percentual de lucro desejado e a quantidade a ser vendida.  O sistema calcula automaticamente o preço ideal por unidade, considerando o custo das matérias-primas, os custos externos e o lucro definido. Você também poderá visualizar o lucro total e o ponto de equilíbrio, ajudando a planejar melhor suas vendas.
        </p>
      </div>
    </div>
  );
}

export default CardPrecificacao;
