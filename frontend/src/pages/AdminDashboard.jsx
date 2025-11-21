import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Badge, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUsers, FaTrash, FaEye, FaPlus } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     

  
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  
  
  const [showNovoAdmin, setShowNovoAdmin] = useState(false);
  const [novoAdmin, setNovoAdmin] = useState({ nome: "", matricula: "", senha: "" });

 
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios");
      
      if (!response.ok) {
        throw new Error("Erro ao conectar com a API.");
      }

      const data = await response.json();
      setUsuarios(data); 
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os usuários. Verifique se o servidor backend está rodando.");
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchUsuarios();
  }, []);


  const excluirUsuario = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário permanentemente?")) {
      try {
        
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
        
          setUsuarios(usuarios.filter(u => u._id !== id)); 
          setShowDetalhes(false);
          alert("Usuário excluído com sucesso!");
        } else {
          alert("Erro ao excluir usuário no servidor.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro de conexão ao tentar excluir.");
      }
    }
  };

 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login-admin");
  };

  const abrirDetalhes = (usuario) => {
    setUsuarioSelecionado(usuario);
    setShowDetalhes(true);
  };

  const salvarAdmin = () => {
    
    alert(`Administrador ${novoAdmin.nome} cadastrado com sucesso (Simulação)!`);
    setShowNovoAdmin(false);
    setNovoAdmin({ nome: "", matricula: "", senha: "" });
  };

  return (
    <div className="min-vh-100 bg-light">
      
    
      <div className="bg-white py-3 px-4 d-flex justify-content-between align-items-center shadow-sm" style={{ height: "80px" }}>
        <div className="d-flex align-items-center gap-2">
           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s" alt="Logo" width="50" />
           <h4 className="mb-0 fw-bold text-primary" style={{ color: "#044CF4" }}>NAF</h4>
        </div>
        <h4 className="mb-0 fw-normal text-secondary d-none d-md-block">Painel Administrativo</h4>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end lh-1">
            <div className="fw-bold">Admin</div>
            <small className="text-muted">Logado</small>
          </div>
          <div className="rounded-circle bg-light d-flex justify-content-center align-items-center fw-bold text-secondary" 
               style={{ width: "45px", height: "45px", cursor: "pointer" }} onClick={handleLogout}>
            JP
          </div>
        </div>
      </div>

     
      <div className="w-100 d-flex align-items-center px-4" style={{ backgroundColor: "#044CF4", height: "60px" }}>
        <div className="text-white fw-bold border-bottom border-3 border-white pb-1" style={{ cursor: "pointer" }}>
          Visão Geral
        </div>
        <div className="text-white opacity-75 ms-4 pb-1" style={{ cursor: "pointer" }} onClick={() => setShowNovoAdmin(true)}>
          Cadastrar Administradores
        </div>
      </div>


      <div className="container-fluid py-4" style={{ maxWidth: "1200px" }}>
        
        <h3 className="mb-4 fw-bold">Gerenciamento de Usuários</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-4">
       
          <Col lg={8}>
            <div className="bg-white p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Empreendedores Cadastrados</h5>
                <Badge bg="primary" pill>{usuarios.length} Total</Badge>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Carregando dados do banco...</p>
                </div>
              ) : (
                <Table hover responsive className="align-middle">
                  <thead className="text-secondary small text-uppercase">
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Bairro</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr><td colSpan="4" className="text-center text-muted">Nenhum usuário encontrado no banco de dados.</td></tr>
                    ) : (
                      usuarios.map((user) => (
                     
                        <tr key={user._id}>
                          <td className="fw-bold text-dark">{user.nome}</td>
                          <td className="text-muted small">{user.email}</td>
                         
                          <td><Badge bg="light" text="dark" className="border">{user.bairro || "N/A"}</Badge></td>
                          <td className="text-end">
                            <Button variant="link" className="p-0 me-3" onClick={() => abrirDetalhes(user)}>
                              <FaEye color="#044CF4" />
                            </Button>
                            <Button variant="link" className="p-0 text-danger" onClick={() => excluirUsuario(user._id)}>
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </div>
          </Col>

        
          <Col lg={4}>
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
              <h6 className="text-muted text-uppercase small fw-bold mb-3">Resumo do Sistema</h6>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div>
                  <h2 className="fw-bold mb-0">{usuarios.length}</h2>
                  <small className="text-muted">Usuários Ativos</small>
                </div>
                <div className="bg-light p-3 rounded-circle text-primary">
                  <FaUsers size={24} color="#044CF4"/>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-4 shadow-sm text-center">
              <h5 className="fw-bold mb-2">Novo Administrador</h5>
              <p className="text-muted small mb-4">Cadastre um aluno ou professor (Acesso Interno).</p>
              <Button 
                className="w-100 py-2 rounded-pill fw-bold" 
                style={{ backgroundColor: "#044CF4", border: "none" }}
                onClick={() => setShowNovoAdmin(true)}
              >
                <FaPlus className="me-2" /> Cadastrar Admin
              </Button>
            </div>
          </Col>
        </Row>

       
        <Row className="g-4">
          <Col md={4}>
            <div className="bg-white p-4 rounded-4 shadow-sm h-100">
               <h6 className="text-primary fw-bold mb-1">Servidor Backend</h6>
               <h4 className="fw-bold text-success">{error ? "Offline" : "Online"}</h4>
               <small className="text-muted">Porta: 3000</small>
            </div>
          </Col>
        
        </Row>

      </div>

      
      <Modal show={showDetalhes} onHide={() => setShowDetalhes(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Detalhes do Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioSelecionado && (
            <div className="p-2">
              <div className="d-flex align-items-center mb-4">
                <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold fs-4 me-3" 
                     style={{ width: "60px", height: "60px", backgroundColor: "#044CF4" }}>
                  {usuarioSelecionado.nome.charAt(0)}
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">{usuarioSelecionado.nome}</h5>
                  <span className="text-muted small">ID: {usuarioSelecionado._id}</span>
                </div>
              </div>
              
              <div className="bg-light p-3 rounded-3 mb-3">
                <p className="mb-1"><strong>Email:</strong> {usuarioSelecionado.email}</p>
                <p className="mb-1"><strong>CPF:</strong> {usuarioSelecionado.cpf || "Não informado"}</p>
                <p className="mb-0"><strong>Bairro:</strong> {usuarioSelecionado.bairro || "Não informado"}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowDetalhes(false)}>Fechar</Button>
          {usuarioSelecionado && (
            <Button variant="danger" onClick={() => excluirUsuario(usuarioSelecionado._id)}>Excluir Cadastro</Button>
          )}
        </Modal.Footer>
      </Modal>

     
      <Modal show={showNovoAdmin} onHide={() => setShowNovoAdmin(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Novo Administrador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">Adicione um colaborador da universidade.</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" onChange={e => setNovoAdmin({...novoAdmin, nome: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Matrícula</Form.Label>
              <Form.Control type="text" onChange={e => setNovoAdmin({...novoAdmin, matricula: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" onChange={e => setNovoAdmin({...novoAdmin, senha: e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowNovoAdmin(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: "#044CF4", border: "none" }} onClick={salvarAdmin}>Salvar</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default AdminDashboard;