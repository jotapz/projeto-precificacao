import React from "react";

function CardCusto() {
  return (
    <div className="card border-info mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header d-flex align-items-center justify-content-between">
        Custos
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
          Aqui você adiciona os custos gerais de operação que não pertencem a um produto específico, mas influenciam no preço final. Inclua despesas como energia elétrica, água, aluguel, mão de obra, impostos, entre outros. Esses custos serão distribuídos proporcionalmente no cálculo final de cada produto, garantindo uma precificação mais realista.
        </p>
      </div>
    </div>
  );
}

export default CardCusto;