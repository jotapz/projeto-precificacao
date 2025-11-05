import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function Materiaprimapage() {

  const [materiasPrimas, setMateriasPrimas] = useState([]);
  
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    quantidade: 0,
    unidade: "kg",
    valor: 0.0 
  });

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setNovoMaterial({
      nome: "",
      quantidade: 0,
      unidade: "kg",
      valor: 0.0 
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoMaterial(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    setMateriasPrimas(listaAnterior => [...listaAnterior, novoMaterial]);
    handleClose();
  };

  const handleExcluir = (indexParaExcluir) => {
    setMateriasPrimas(listaAnterior => 
      listaAnterior.filter((_, index) => index !== indexParaExcluir)
    );
  };

  return (
    <div className="container-fluid" style={{ maxWidth: "1200px", justifyContent: "center" }}>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Matéria Prima</h3>
        <Button variant="primary" onClick={handleShow} style={{ backgroundColor: "#044CF4" }}>+ Adicionar Matéria-Prima</Button>
      </div>
      
      <div
        className="p-4 rounded shadow w-100 mt-3"
        style={{ minHeight: '100px', maxWidth: "1200px", backgroundColor: "#FFFFFF" }}
      >
        {materiasPrimas.length === 0 ? (
          <p className="text-secondary text-center">Nenhuma Matéria-Prima cadastrada.</p>
        ) : (
          materiasPrimas.map((material, index) => (
            <div 
              key={index}
              className="d-flex justify-content-between align-items-center p-3 border rounded mt-2 text-start"
            >
              <div>
                <span className="fw-bold">{material.nome}</span><br/>
                <small className="text-muted">Quantidade: {material.quantidade} {material.unidade}</small>
                <small className="text-muted ms-3">Valor: R${material.valor}</small>
              </div>
              <div>
                <Button variant="link" size="sm" className="text-decoration-none">Editar</Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger text-decoration-none"
                  onClick={() => handleExcluir(index)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={handleClose} centered> 
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Matéria-Prima</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: farinha" 
                name="nome" 
                value={novoMaterial.nome} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formQuantidade">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control 
                type="number" 
                name="quantidade" 
                value={novoMaterial.quantidade} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUnidade">
              <Form.Label>Unidade</Form.Label>
              <Form.Select 
                name="unidade" 
                value={novoMaterial.unidade} 
                onChange={handleChange} 
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="un">un</option>
                <option value="L">L</option>
                <option value="mL">mL</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor Unitário (R$)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Ex: 3,30" 
                step="0.01" 
                name="valor" 
                value={novoMaterial.valor} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ backgroundColor: "#044CF4" }}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Materiaprimapage;