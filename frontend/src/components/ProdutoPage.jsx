import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

// Estado inicial para um novo produto
const estadoInicialProduto = {
  nome: '',
  lucroDesejado: '',
  ingredientes: [
    { nome: '', quantidade: '', unidade: 'g' } // Começa com 1 linha de ingrediente
  ]
};

// Recebe 'materiasPrimas' como prop para popular o dropdown
function ProdutoPage({ materiasPrimas = [] }) {
  
  // --- ESTADOS ---
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState(estadoInicialProduto);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // --- FUNÇÕES DO MODAL ---
  const handleClose = () => {
    setShowModal(false);
    setNovoProduto(estadoInicialProduto);
    setEditingIndex(null);
  };

  const handleShowAdicionar = () => {
    setNovoProduto(estadoInicialProduto);
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleShowEditar = (index) => {
    setNovoProduto(produtos[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  // --- FUNÇÕES DO FORMULÁRIO ---
  
  // Atualiza campos simples (nome, lucro)
  const handleChangeSimples = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza uma linha específica de ingrediente
  const handleIngredienteChange = (index, e) => {
    const { name, value } = e.target;
    const ingredientesAtualizados = [...novoProduto.ingredientes];
    ingredientesAtualizados[index] = { ...ingredientesAtualizados[index], [name]: value };
    setNovoProduto(prev => ({ ...prev, ingredientes: ingredientesAtualizados }));
  };

  // Adiciona uma nova linha de ingrediente
  const handleAddIngrediente = () => {
    setNovoProduto(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, { nome: '', quantidade: '', unidade: 'g' }]
    }));
  };

  // Remove uma linha de ingrediente
  const handleRemoveIngrediente = (index) => {
    setNovoProduto(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  // Salva (Adiciona ou Edita)
  const handleSubmit = () => {
    if (editingIndex !== null) {
      const listaAtualizada = produtos.map((p, i) => i === editingIndex ? novoProduto : p);
      setProdutos(listaAtualizada);
    } else {
      setProdutos(prev => [...prev, novoProduto]);
    }
    handleClose();
  };

  // Exclui um produto
  const handleExcluir = (index) => {
    setProdutos(prev => prev.filter((_, i) => i !== index));
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="container-fluid fade-in" style={{ maxWidth: "1200px", justifyContent: "center" }}>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Produto</h3>
        <Button onClick={handleShowAdicionar} style={{ backgroundColor: "#044CF4" }}>
          + Adicionar Produto
        </Button>
      </div>
      
      {/* LISTA DE PRODUTOS */}
      <div className="p-4 rounded shadow w-100 mt-3" style={{ minHeight: '100px', maxWidth: "1200px", backgroundColor: "#FFFFFF" }}>
        {produtos.length === 0 ? (
          <p className="text-secondary text-center">Nenhum Produto cadastrado.</p>
        ) : (
          produtos.map((produto, index) => (
            <div key={index} className="d-flex justify-content-between align-items-start p-3 border rounded mt-2 text-start">
              <div>
                <span className="fw-bold fs-5">{produto.nome}</span><br/>
                <small className="text-muted">Lucro Desejado: {produto.lucroDesejado}%</small>
                <div className="mt-2">
                  <strong>Ingredientes:</strong>
                  <ul className="mb-0 ps-3">
                    {produto.ingredientes.map((ing, i) => (
                      <li key={i}><small>{ing.quantidade}{ing.unidade} de {ing.nome}</small></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <Button variant="link" size="sm" onClick={() => handleShowEditar(index)} className="text-decoration-none">Editar</Button>
                <Button variant="link" size="sm" onClick={() => handleExcluir(index)} className="text-danger text-decoration-none">Excluir</Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE PRODUTO */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? 'Editar' : 'Adicionar'} Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Nome do Produto */}
            <Form.Group className="mb-3">
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Bolo de Chocolate"
                name="nome"
                value={novoProduto.nome}
                onChange={handleChangeSimples}
              />
            </Form.Group>

            {/* Ingredientes Dinâmicos */}
            <Form.Label>Ingredientes</Form.Label>
            {novoProduto.ingredientes.map((ingrediente, index) => (
              <Row key={index} className="mb-2 g-2 align-items-center">
                <Col md={5}>
                  <Form.Select 
                    name="nome" 
                    value={ingrediente.nome} 
                    onChange={(e) => handleIngredienteChange(index, e)}
                  >
                    <option value="">Selecione a Matéria-Prima...</option>
                    {materiasPrimas.map((mp, i) => (
                      <option key={i} value={mp.nome}>{mp.nome}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Control 
                    type="number" 
                    placeholder="Qtd"
                    name="quantidade"
                    value={ingrediente.quantidade}
                    onChange={(e) => handleIngredienteChange(index, e)}
                  />
                </Col>
                <Col md={2}>
                  <Form.Select 
                    name="unidade" 
                    value={ingrediente.unidade} 
                    onChange={(e) => handleIngredienteChange(index, e)}
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="mL">mL</option>
                    <option value="L">L</option>
                    <option value="un">un</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  {novoProduto.ingredientes.length > 1 && (
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveIngrediente(index)}>
                      Remover
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button variant="link" className="p-0 mb-3 text-decoration-none" onClick={handleAddIngrediente}>
              + Adicionar Ingrediente
            </Button>

            <hr />

            {/* Lucro Desejado */}
            <Form.Group className="mb-3">
              <Form.Label>Lucro Desejado (%)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Ex: 30"
                name="lucroDesejado"
                value={novoProduto.lucroDesejado}
                onChange={handleChangeSimples}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: "#044CF4" }}>
            {editingIndex !== null ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProdutoPage;