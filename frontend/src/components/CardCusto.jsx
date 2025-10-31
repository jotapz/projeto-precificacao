
import React from "react";

function CardCusto() {
  return (
    <div className="card border-info mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header d-flex align-items-center justify-content-between">
        Header
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
        <h5 className="card-title">Materia</h5>
        <p className="card-text">
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </p>
      </div>
    </div>
  );
}

export default CardCusto;
