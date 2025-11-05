import React from "react";

function CardProduto() {
  return (
    <div className="card border-info mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header d-flex align-items-center justify-content-between">
        Produto
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
          Nesta seção, você cria seus produtos finais, combinando as matérias-primas que já cadastrou. Você pode definir a quantidade de cada insumo usada.
          O sistema calculará o custo total na venda de cada produto com base nesses dados.
        </p>
      </div>
    </div>
  );
}

export default CardProduto;