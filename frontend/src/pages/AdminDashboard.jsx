import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Badge, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUsers, FaTrash, FaEye, FaPlus } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [creatingAdminLoading, setCreatingAdminLoading] = useState(false);
  const [creatingAdminError, setCreatingAdminError] = useState(null);

  
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
    const token = localStorage.getItem('adminToken');
    const bypass = localStorage.getItem('adminBypass');

    // If there is a token -> load protected dashboard + admin list
    if (token) {
      fetchUsuarios();
      fetchDashboard(token);
      fetchAdmins(token);
      return;
    }

    // If bypass is active, use public dashboard so admin can enter without login
    if (bypass) {
      fetchUsuarios();
      fetchDashboardPublic();
      // admin list will not be available without token
      return;
    }

    // If no token and no bypass, check if any admins exist. If none, allow public dashboard
    (async () => {
      try {
        const r = await fetch('http://localhost:3000/api/admin/exists');
        if (!r.ok) throw new Error('could not check admins');
        const b = await r.json();
        if (!b.hasAdmins) {
          // no admins yet: allow public access to dashboard
          fetchUsuarios();
          fetchDashboardPublic();
        } else {
          // admins exist and there is no token: redirect to login
          navigate('/login-admin');
        }
      } catch (error) {
        console.error('admin existence check error', error);
        // fallback: try loading users
        fetchUsuarios();
      }
    })();
  }, [navigate]);


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

  // NOTE: real creation is handled by salvarAdminReal

  // new implementation: POST to backend and refresh admin list
  const salvarAdminReal = async () => {
    setCreatingAdminError(null);
    if (!novoAdmin.nome || !novoAdmin.matricula || !novoAdmin.senha) {
      setCreatingAdminError('Todos os campos são obrigatórios');
      return;
    }
    setCreatingAdminLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:3000/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ nome: novoAdmin.nome, matricula: novoAdmin.matricula, senha: novoAdmin.senha })
      });
      const body = await res.json();
      if (!res.ok) {
        setCreatingAdminError(body?.message || 'Erro ao criar administrador');
        setCreatingAdminLoading(false);
        return;
      }
      setShowNovoAdmin(false);
      setNovoAdmin({ nome: '', matricula: '', senha: '' });
      await fetchAdmins(localStorage.getItem('adminToken'));
      alert('Administrador criado com sucesso');
    } catch (err) {
      console.error('salvarAdminReal error', err);
      setCreatingAdminError('Erro de conexão ao criar administrador');
    } finally {
      setCreatingAdminLoading(false);
    }
  };

  const fetchDashboard = async (token) => {
    setLoadingDashboard(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Erro ao buscar métricas');
      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.error('fetchDashboard error', err);
      setError('Não foi possível carregar métricas do dashboard');
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchDashboardPublic = async () => {
    setLoadingDashboard(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/dashboard-public');
      if (!res.ok) throw new Error('Erro ao buscar métricas públicas');
      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.error('fetchDashboardPublic error', err);
      setError('Não foi possível carregar métricas do dashboard');
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchAdmins = async (token) => {
    try {
      if (!token) return;
      const res = await fetch('http://localhost:3000/api/admin', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const body = await res.json();
      setAdmins(body.value || body);
    } catch (err) {
      console.error('fetchAdmins error', err);
    }
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
                  <h2 className="fw-bold mb-0">{loadingDashboard ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (dashboard?.totalUsuarios ?? usuarios.length)}</h2>
                  <small className="text-muted">Usuários Ativos</small>
                  <div className="mt-2 small text-muted">
                    <div>Total Produtos: {loadingDashboard ? <em>—</em> : (dashboard?.totalProdutos ?? '—')}</div>
                    <div>Total Matérias-primas: {loadingDashboard ? <em>—</em> : (dashboard?.totalMaterias ?? '—')}</div>
                  </div>
                </div>
                <div className="bg-light p-3 rounded-circle text-primary">
                  <FaUsers size={24} color="#044CF4"/>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-4 shadow-sm text-center">
              <h5 className="fw-bold mb-2">Novo Administrador</h5>
              <p className="text-muted small mb-4">Cadastre um aluno ou professor (Acesso Interno).</p>
              <div className="small text-muted mb-3">Administradores cadastrados: {admins ? admins.length : 0}</div>
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
              <hr />
              <div className="small text-muted">
                <div>Total Despesas: R$ {loadingDashboard ? <em>—</em> : (dashboard?.totalDespesas ?? '0.00')}</div>
                <div>Total Custos Operacionais: R$ {loadingDashboard ? <em>—</em> : (dashboard?.totalCustosOperacionais ?? '0.00')}</div>
              </div>
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
          {creatingAdminError && (
            <Alert variant="danger">{creatingAdminError}</Alert>
          )}
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
          <Button style={{ backgroundColor: "#044CF4", border: "none" }} onClick={salvarAdminReal} disabled={creatingAdminLoading}>
            {creatingAdminLoading ? (<span className="spinner-border spinner-border-sm me-2" />) : null}Salvar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default AdminDashboard;