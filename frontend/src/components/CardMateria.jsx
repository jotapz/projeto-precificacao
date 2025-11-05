import React from "react";

function CardMateria() {
  return (
    <div className="card border-info mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header d-flex align-items-center justify-content-between">
        Matéria-Prima
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
          Aqui você cadastra todos os insumos usados na produção dos seus produtos. Inclua informações como nome, quantidade, unidade de medida e custo por unidade. Esses dados serão usados mais tarde para calcular automaticamente o custo de produção de cada item.
        </p>
      </div>
    </div>
  );
}

export default CardMateria;