import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const estadoInicialFormulario = {
  nome: '',
  valor: ''
};

function CustosPage() {



  const [custos, setCustos] = useState([]);
  const [despesas, setDespesas] = useState([]);


  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(estadoInicialFormulario);
  const [editingIndex, setEditingIndex] = useState(null);
  

  const [currentType, setCurrentType] = useState(null); 


  const handleClose = () => {
    setShowModal(false);
    setFormData(estadoInicialFormulario);
    setEditingIndex(null);
    setCurrentType(null); 
  };


  const handleShowModalAdicionar = (type) => {
    setFormData(estadoInicialFormulario);
    setEditingIndex(null);
    setCurrentType(type); 
    setShowModal(true);
  };


  const handleShowModalEditar = (type, index) => {

    const itemParaEditar = type === 'custo' ? custos[index] : despesas[index];
    
    setFormData(itemParaEditar);
    setEditingIndex(index);
    setCurrentType(type);
    setShowModal(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

 
  const handleSubmit = () => {
    const setList = currentType === 'custo' ? setCustos : setDespesas;
    const list = currentType === 'custo' ? custos : despesas;

    if (editingIndex !== null) {

      const listaAtualizada = list.map((item, index) => 
        index === editingIndex ? formData : item
      );
      setList(listaAtualizada);
    } else {

      setList(listaAnterior => [...listaAnterior, formData]);
    }
    
    handleClose();
  };


  const handleExcluir = (type, indexParaExcluir) => {
    const setList = type === 'custo' ? setCustos : setDespesas;
    setList(listaAnterior => 
      listaAnterior.filter((_, index) => index !== indexParaExcluir)
    );
  };



  const modalTitle = (editingIndex !== null ? 'Editar' : 'Adicionar') + (currentType === 'custo' ? ' Custo Operacional' : ' Despesa');

  return (
    <div className="container-fluid" style={{ maxWidth: "1200px", justifyContent: "center" }}>
      
      
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Custos Operacional</h3>
        
        <Button onClick={() => handleShowModalAdicionar('custo')} style={{ backgroundColor: "#044CF4" }}>
          + Adicionar Custo Operacional
        </Button>
      </div>
      
      <div
        className="p-4 rounded shadow w-100 mt-3"
        style={{ minHeight: '100px', maxWidth: "1200px", backgroundColor: "#FFFFFF" }}
      >
        {custos.length === 0 ? (
          <p className="text-secondary text-center">Nenhum Custo Operacional cadastrado.</p>
        ) : (
          custos.map((custo, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center p-3 border rounded mt-2 text-start">
              <div>
                <span className="fw-bold">{custo.nome}</span><br/>
                <small className="text-muted">Valor: R${custo.valor}</small>
              </div>
              <div>
                <Button variant="link" size="sm" className="text-decoration-none" onClick={() => handleShowModalEditar('custo', index)}>
                  Editar
                </Button>
                <Button variant="link" size="sm" className="text-danger text-decoration-none" onClick={() => handleExcluir('custo', index)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

 
      <div className="d-flex justify-content-between align-items-center mt-5">
        <h3>Despesas</h3>
   
        <Button onClick={() => handleShowModalAdicionar('despesa')} style={{ backgroundColor: "#044CF4" }}>
          + Adicionar Despesa
        </Button>
      </div>
      
      <div
        className="p-4 rounded shadow w-100 mt-3"
        style={{ minHeight: '100px', maxWidth: "1200px", backgroundColor: "#FFFFFF" }}
      >
        {despesas.length === 0 ? (
          <p className="text-secondary text-center">Nenhuma Despesa cadastrada.</p>
        ) : (
          despesas.map((despesa, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center p-3 border rounded mt-2 text-start">
              <div>
                <span className="fw-bold">{despesa.nome}</span><br/>
                <small className="text-muted">Valor: R${despesa.valor}</small>
              </div>
              <div>
                <Button variant="link" size="sm" className="text-decoration-none" onClick={() => handleShowModalEditar('despesa', index)}>
                  Editar
                </Button>
                <Button variant="link" size="sm" className="text-danger text-decoration-none" onClick={() => handleExcluir('despesa', index)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>


      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Aluguel, Energia" 
                name="nome"
                value={formData.nome} 
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor (R$)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="500.00" 
                step="0.01"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} style={{ backgroundColor: "#044CF4" }}>
            {editingIndex !== null ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default CustosPage;