import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const estadoInicialFormulario = {
  nome: '',
  valorMensal: '' 
};

const API_URL = 'http://localhost:3000/api';

function CustosPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      alert('Você precisa fazer login para acessar esta página');
      navigate('/login');
    }
  }, [userId, navigate]);

  const [custos, setCustos] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custosResponse, despesasResponse] = await Promise.all([
          fetch(`${API_URL}/custos/user/${userId}`),
          fetch(`${API_URL}/despesas/user/${userId}`)
        ]);

        const custosData = await custosResponse.json();
        const despesasData = await despesasResponse.json();

        setCustos(custosData);
        setDespesas(despesasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar custos e despesas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);


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
    
    setFormData({
      nome: itemParaEditar.nome,
      valorMensal: itemParaEditar.valorMensal.toString()
    });
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

 
  const handleSubmit = async () => {
    try {
      const endpoint = currentType === 'custo' ? 'custos' : 'despesas';
      const item = {
        ...formData,
        valorMensal: Number(formData.valorMensal),
        usuario: userId
      };

      console.log('Dados sendo enviados:', {
        endpoint,
        data: item,
        userId: userId
      });

      let response;
      if (editingIndex !== null) {
        const itemId = currentType === 'custo' 
          ? custos[editingIndex]._id 
          : despesas[editingIndex]._id;

        console.log('Editando item:', itemId);
        response = await fetch(`${API_URL}/${endpoint}/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } else {
        console.log('Criando novo item');
        response = await fetch(`${API_URL}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }

      const responseData = await response.json();
      console.log('Resposta da API:', responseData);

      if (!response.ok) {
        throw new Error(`Erro ao salvar: ${responseData.message || 'Erro desconhecido'}`);
      }

      const listResponse = await fetch(`${API_URL}/${endpoint}/user/${userId}`);
      const updatedList = await listResponse.json();
      console.log('Lista atualizada:', updatedList);
      
      if (currentType === 'custo') {
        setCustos(updatedList);
      } else {
        setDespesas(updatedList);
      }

      handleClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar. Por favor, tente novamente.');
    }
  };

  const handleExcluir = async (type, index) => {
    try {
      const endpoint = type === 'custo' ? 'custos' : 'despesas';
      const list = type === 'custo' ? custos : despesas;
      const itemId = list[index]._id;

      const response = await fetch(`${API_URL}/${endpoint}/${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir');
      }

      const setList = type === 'custo' ? setCustos : setDespesas;
      setList(prevList => prevList.filter((_, idx) => idx !== index));
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir. Por favor, tente novamente.');
    }
  };



  const modalTitle = (editingIndex !== null ? 'Editar' : 'Adicionar') + (currentType === 'custo' ? ' Custo Operacional' : ' Despesa');

  return (
    <div className="container-fluid fade-in" style={{ maxWidth: "1200px", justifyContent: "center" }}>
      
      
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
        {loading ? (
          <p className="text-secondary text-center">Carregando...</p>
        ) : custos.length === 0 ? (
          <p className="text-secondary text-center">Nenhum Custo Operacional cadastrado.</p>
        ) : (
          custos.map((custo, index) => (
            <div key={custo._id || index} className="d-flex justify-content-between align-items-center p-3 border rounded mt-2 text-start">
              <div>
                <span className="fw-bold">{custo.nome}</span><br/>
                <small className="text-muted">Valor Mensal: R${custo.valorMensal.toFixed(2)}</small>
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
        {loading ? (
          <p className="text-secondary text-center">Carregando...</p>
        ) : despesas.length === 0 ? (
          <p className="text-secondary text-center">Nenhuma Despesa cadastrada.</p>
        ) : (
          despesas.map((despesa, index) => (
            <div key={despesa._id || index} className="d-flex justify-content-between align-items-center p-3 border rounded mt-2 text-start">
              <div>
                <span className="fw-bold">{despesa.nome}</span><br/>
                <small className="text-muted">Valor Mensal: R${despesa.valorMensal.toFixed(2)}</small>
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
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor Mensal (R$)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="500.00" 
                step="0.01"
                name="valorMensal"
                value={formData.valorMensal}
                onChange={handleChange}
                required
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