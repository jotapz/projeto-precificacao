import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:3000/api';

function Materiaprimapage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Redirecionar para login se não houver userId
  useEffect(() => {
    if (!userId) {
      alert('Você precisa fazer login para acessar esta página');
      navigate('/login');
    }
  }, [userId, navigate]);

  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    quantidade: 0,
    unidade: "kg",
    valorUnitario: 0.0  // Alterado de valor para valorUnitario para corresponder ao backend
  });

  // Carregar matérias-primas do usuário
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
          const response = await fetch(`${API_URL}/materiasprimas/user/${userId}`);
        if (!response.ok) throw new Error('Falha ao carregar matérias-primas');
        const data = await response.json();
        setMateriasPrimas(data);
      } catch (error) {
        console.error('Erro ao carregar matérias-primas:', error);
        alert('Erro ao carregar matérias-primas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMaterias();
    }
  }, [userId]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setNovoMaterial({
      nome: "",
      quantidade: 0,
      unidade: "kg",
      valorUnitario: 0.0 
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoMaterial(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Enviando dados:', {
        ...novoMaterial,
        usuario: userId
      });

        // Garantir que os campos numéricos sejam enviados como numbers
        const payload = {
          ...novoMaterial,
          quantidade: Number(novoMaterial.quantidade),
          valorUnitario: Number(novoMaterial.valorUnitario),
          usuario: userId
        };

        let response;
        if (editingId) {
          response = await fetch(`${API_URL}/materiasprimas/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          response = await fetch(`${API_URL}/materiasprimas`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar matéria-prima');
      }

      // Recarregar a lista após salvar
    const listResponse = await fetch(`${API_URL}/materiasprimas/user/${userId}`);
      const updatedList = await listResponse.json();
  setMateriasPrimas(updatedList);

  setEditingId(null);
  handleClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(error.message || 'Erro ao salvar matéria-prima. Por favor, tente novamente.');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta matéria-prima?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/materiasprimas/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao excluir matéria-prima');
      }

      // Atualizar lista local após excluir
      setMateriasPrimas(materiasPrimas.filter(item => item._id !== id));
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert(error.message || 'Erro ao excluir matéria-prima. Por favor, tente novamente.');
    }
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
          {loading ? (
            <p className="text-secondary text-center">Carregando...</p>
          ) : materiasPrimas.length === 0 ? (
          <p className="text-secondary text-center">Nenhuma Matéria-Prima cadastrada.</p>
        ) : (
          materiasPrimas.map((material, index) => (
            <div 
                key={material._id}
              className="d-flex justify-content-between align-items-center p-3 border rounded mt-2 text-start"
            >
              <div>
                <span className="fw-bold">{material.nome}</span><br/>
                <small className="text-muted">Quantidade: {material.quantidade} {material.unidade}</small>
                  <small className="text-muted ms-3">Valor Unitário: R${material.valorUnitario.toFixed(2)}</small>
              </div>
              <div>
                <Button variant="link" size="sm" className="text-decoration-none" onClick={() => {
                  setNovoMaterial({
                    nome: material.nome,
                    quantidade: material.quantidade,
                    unidade: material.unidade,
                    valorUnitario: material.valorUnitario
                  });
                  setEditingId(material._id);
                  setShowModal(true);
                }}>Editar</Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger text-decoration-none"
                    onClick={() => handleExcluir(material._id)}
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
          <Modal.Title>{editingId ? 'Editar Matéria-Prima' : 'Adicionar Matéria-Prima'}</Modal.Title>
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
                required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formQuantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  name="quantidade"
                  value={novoMaterial.quantidade}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUnidade">
                <Form.Label>Unidade</Form.Label>
                <Form.Select
                  name="unidade"
                  value={novoMaterial.unidade}
                  onChange={handleChange}
                  required
                >
                  <option value="kg">Quilograma (kg)</option>
                  <option value="g">Grama (g)</option>
                  <option value="L">Litro (L)</option>
                  <option value="ml">Mililitro (ml)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formValorUnitario">
                <Form.Label>Valor Unitário (R$)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  name="valorUnitario"
                  value={novoMaterial.valorUnitario}
                  onChange={handleChange}
                  required
              />
            </Form.Group>

            {/* Apenas um conjunto de campos: nome, quantidade, unidade, valorUnitario */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ backgroundColor: "#044CF4" }}>
            {editingId ? 'Salvar' : 'Adicionar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Materiaprimapage;