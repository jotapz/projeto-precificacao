import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">NAF</h5>
            <p className="mb-0">
              Núcleo de Apoio Contábil e Fiscal da Universidade de Fortaleza
            </p>
          </div>


          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Contato</h5>
            <p className="mb-1">
              <i className="bi bi-envelope me-2"></i> naf@unifor.br
            </p>
            <p className="mb-1">
              <i className="bi bi-telephone me-2"></i> (85) 3477-3193
            </p>
            <p className="mb-0">
              <i className="bi bi-geo-alt me-2"></i> Bloco R | Sala 3A | Sob Agendamento
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Horários</h5>
            <p className="mb-1">Segunda a Sexta: 8h às 17h</p>
            <p className="mb-0">Sábado: 8h às 12h</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;