import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Table, Badge, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUsers, FaTrash, FaEye, FaPlus, FaSignOutAlt, FaUserShield, FaBoxOpen } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('geral');

  const [usuarios, setUsuarios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  
  const [userProducts, setUserProducts] = useState([]);
  const [loadingUserProducts, setLoadingUserProducts] = useState(false);
  const [showUserProducts, setShowUserProducts] = useState(false);

  const [showProductIngredients, setShowProductIngredients] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [creatingAdminLoading, setCreatingAdminLoading] = useState(false);
  const [creatingAdminError, setCreatingAdminError] = useState(null);

  const [showDetalhes, setShowDetalhes] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [showNovoAdmin, setShowNovoAdmin] = useState(false);
  const [novoAdmin, setNovoAdmin] = useState({ nome: "", matricula: "", senha: "" });

  const [showMenu, setShowMenu] = useState(false);
  const profileRef = useRef(null);
  const [adminInitials, setAdminInitials] = useState("AD");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const adminStorage = localStorage.getItem('adminInfo');
      let nome = "Admin";
      if (adminStorage) {
        const data = JSON.parse(adminStorage);
        if (data.nome) nome = data.nome;
      }
      const partes = nome.trim().split(" ");
      let letras = partes[0].charAt(0).toUpperCase();
      if (partes.length > 1) {
        letras += partes[1].charAt(0).toUpperCase();
      } else if (partes[0].length > 1) {
        letras += partes[0].charAt(1).toUpperCase();
      }
      setAdminInitials(letras);
    } catch (e) {
      setAdminInitials("AD");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const bypass = localStorage.getItem('adminBypass');

    if (token) {
      fetchUsuarios();
      fetchDashboard(token);
      fetchAdmins(token);
      return;
    }

    if (bypass) {
      fetchUsuarios();
      fetchDashboardPublic();
      return;
    }

    (async () => {
      try {
        const r = await fetch('http://localhost:3000/api/admin/exists');
        if (!r.ok) throw new Error('could not check admins');
        const b = await r.json();
        if (!b.hasAdmins) {
          fetchUsuarios();
          fetchDashboardPublic();
        } else {
          navigate('/login-admin');
        }
      } catch (error) {
        fetchUsuarios();
      }
    })();
  }, [navigate]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios");
      if (!response.ok) throw new Error("Erro API");
      const data = await response.json();
      setUsuarios(data); 
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar usuários.");
      setLoading(false);
    }
  };

  const fetchAdmins = async (token) => {
    try {
      if (!token) return;
      const res = await fetch('http://localhost:3000/api/admin', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const body = await res.json();
      const lista = Array.isArray(body) ? body : (body.value || []);
      setAdmins(lista);
    } catch (err) {
      console.error('fetchAdmins error', err);
    }
  };

  const fetchDashboard = async (token) => {
    setLoadingDashboard(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Erro metrics');
      const data = await res.json();
      setDashboard(data);
    } catch (err) {
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchDashboardPublic = async () => {
    setLoadingDashboard(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/dashboard-public');
      if (!res.ok) throw new Error('Erro metrics public');
      const data = await res.json();
      setDashboard(data);
    } catch (err) {
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleVerProdutos = async (userId) => {
    setLoadingUserProducts(true);
    setShowUserProducts(true);
    setUserProducts([]);

    try {
      const response = await fetch(`http://localhost:3000/api/produtos/user/${userId}`);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const data = await response.json();
      setUserProducts(data || []);
    } catch (error) {
      console.error("Erro produtos:", error);
      alert("Não foi possível carregar os produtos deste usuário.");
    } finally {
      setLoadingUserProducts(false);
    }
  };

  const handleVerIngredientes = (produto) => {
    setSelectedProduct(produto);
    setShowProductIngredients(true);
  };

  const excluirUsuario = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário permanentemente?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setUsuarios(usuarios.filter(u => u._id !== id)); 
          setShowDetalhes(false);
          alert("Usuário excluído com sucesso!");
        } else {
          alert("Erro ao excluir usuário.");
        }
      } catch (error) {
        alert("Erro de conexão.");
      }
    }
  };

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
        body: JSON.stringify(novoAdmin)
      });
      const body = await res.json();
      if (!res.ok) {
        setCreatingAdminError(body?.message || 'Erro ao criar admin');
        setCreatingAdminLoading(false);
        return;
      }
      setShowNovoAdmin(false);
      setNovoAdmin({ nome: '', matricula: '', senha: '' });
      await fetchAdmins(token); 
      alert('Administrador criado com sucesso');
    } catch (err) {
      setCreatingAdminError('Erro de conexão');
    } finally {
      setCreatingAdminLoading(false);
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

  return (
    <div className="min-vh-100 bg-light">
      
      <div className="bg-white py-3 px-4 d-flex justify-content-between align-items-center shadow-sm" style={{ height: "80px" }}>
        <div className="d-flex align-items-center gap-2">
           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s" alt="Logo" width="50" />
           <h4 className="mb-0 fw-bold text-primary" style={{ color: "#044CF4" }}>NAF</h4>
        </div>
        <h4 className="mb-0 fw-normal text-secondary d-none d-md-block">Painel Administrativo</h4>
        
        <div className="d-flex align-items-center gap-3 position-relative" ref={profileRef}>
          <div className="text-end lh-1">
            <div className="fw-bold">Admin</div>
            <small className="text-muted">Logado</small>
          </div>
          <div 
            className="rounded-circle d-flex justify-content-center align-items-center fw-bold border shadow-sm" 
            style={{ width: "45px", height: "45px", cursor: "pointer", backgroundColor: "#044CF4", color: "#FFFFFF", fontSize: "1.1rem", letterSpacing: "-1px" }} 
            onClick={() => setShowMenu(!showMenu)}
          >
            {adminInitials}
          </div>
          {showMenu && (
            <div className="card position-absolute shadow-lg border-0 rounded-4 overflow-hidden" style={{ top: "100%", marginTop: "10px", right: 0, width: "240px", zIndex: 1000 }}>
               <div className="px-4 py-3 bg-light border-bottom">
                 <p className="mb-0 small text-muted">Logado como</p>
                 <p className="mb-0 fw-bold text-dark">Administrador</p>
               </div>
               <div className="list-group list-group-flush py-2">
                 <button className="list-group-item list-group-item-action border-0 px-4 py-2 d-flex align-items-center gap-3 text-danger bg-transparent w-100 text-start" onClick={handleLogout}>
                   <FaSignOutAlt size={14} /> <span className="fw-bold">Sair</span>
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-100 d-flex align-items-center px-4" style={{ backgroundColor: "#044CF4", height: "60px" }}>
        <div 
          className={`text-white fw-bold pb-1 me-4 ${activeTab === 'geral' ? 'border-bottom border-3 border-white' : 'opacity-75'}`} 
          style={{ cursor: "pointer" }}
          onClick={() => setActiveTab('geral')}
        >
          Visão Geral
        </div>
        <div 
          className={`text-white fw-bold pb-1 ${activeTab === 'admins' ? 'border-bottom border-3 border-white' : 'opacity-75'}`} 
          style={{ cursor: "pointer" }} 
          onClick={() => setActiveTab('admins')}
        >
          Administradores
        </div>
      </div>

      <div className="container-fluid py-4" style={{ maxWidth: "1200px" }}>
        
        {activeTab === 'geral' && (
          <>
            <h3 className="mb-4 fw-bold">Visão Geral do Sistema</h3>
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
                      <p className="mt-2 text-muted">Carregando dados...</p>
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
                          <tr><td colSpan="4" className="text-center text-muted">Nenhum usuário encontrado.</td></tr>
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
                      <h2 className="fw-bold mb-0">{loadingDashboard ? <Spinner size="sm"/> : (dashboard?.totalUsuarios ?? usuarios.length)}</h2>
                      <small className="text-muted">Usuários Ativos</small>
                    </div>
                    <div className="bg-light p-3 rounded-circle text-primary">
                      <FaUsers size={24} color="#044CF4"/>
                    </div>
                  </div>
                  <div className="small text-muted">
                    <div>Total Produtos: {loadingDashboard ? '...' : (dashboard?.totalProdutos ?? '-')}</div>
                    <div>Total Matérias: {loadingDashboard ? '...' : (dashboard?.totalMaterias ?? '-')}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                  <h6 className="text-primary fw-bold mb-1">Servidor Backend</h6>
                  <h4 className="fw-bold text-success">{error ? "Offline" : "Online"}</h4>
                  <small className="text-muted">Porta: 3000</small>
                  <hr />
                  <div className="small text-muted">
                    <div>Despesas Totais: R$ {loadingDashboard ? '...' : (dashboard?.totalDespesas ?? '0.00')}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}

        {activeTab === 'admins' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Gestão de Administradores</h3>
              <Button 
                className="rounded-pill fw-bold px-4 d-flex align-items-center gap-2" 
                style={{ backgroundColor: "#044CF4", border: "none" }}
                onClick={() => setShowNovoAdmin(true)}
              >
                <FaPlus /> Novo Admin
              </Button>
            </div>

            <Row>
              <Col lg={12}>
                <div className="bg-white p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-light p-3 rounded-circle text-primary">
                      <FaUserShield size={24} color="#044CF4"/>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Equipe Administrativa</h5>
                      <small className="text-muted">Lista de colaboradores com acesso ao painel</small>
                    </div>
                  </div>

                  <Table hover responsive className="align-middle">
                    <thead className="text-secondary small text-uppercase">
                      <tr>
                        <th>Nome</th>
                        <th>Matrícula (Login)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length === 0 ? (
                        <tr><td colSpan="3" className="text-center py-4 text-muted">Nenhum administrador encontrado (além de você).</td></tr>
                      ) : (
                        admins.map((admin, idx) => (
                          <tr key={admin._id || idx}>
                            <td className="fw-bold text-dark">{admin.nome}</td>
                            <td className="text-muted">{admin.matricula}</td>
                            <td><Badge bg="success" className="rounded-pill">Ativo</Badge></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </>
        )}

      </div>

      <Modal show={showDetalhes} onHide={() => setShowDetalhes(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0"><Modal.Title className="fw-bold">Detalhes</Modal.Title></Modal.Header>
        <Modal.Body>
          {usuarioSelecionado && (
            <div className="p-2">
              <h5 className="fw-bold mb-3">{usuarioSelecionado.nome}</h5>
              <div className="bg-light p-3 rounded-3 mb-3">
                <p className="mb-1"><strong>Email:</strong> {usuarioSelecionado.email}</p>
                <p className="mb-1"><strong>CPF:</strong> {usuarioSelecionado.cpf || "-"}</p>
                <p className="mb-0"><strong>Bairro:</strong> {usuarioSelecionado.bairro || "-"}</p>
              </div>
              
              <Button 
                variant="outline-primary" 
                className="w-100 d-flex align-items-center justify-content-center gap-2 mb-2"
                onClick={() => handleVerProdutos(usuarioSelecionado._id)}
              >
                 Ver Produtos Cadastrados
              </Button>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowDetalhes(false)}>Fechar</Button>
          {usuarioSelecionado && <Button variant="danger" onClick={() => excluirUsuario(usuarioSelecionado._id)}>Excluir</Button>}
        </Modal.Footer>
      </Modal>

      <Modal show={showUserProducts} onHide={() => setShowUserProducts(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title className="fw-bold">Produtos do Usuário</Modal.Title></Modal.Header>
        <Modal.Body>
          {loadingUserProducts ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Buscando produtos...</p>
            </div>
          ) : userProducts.length === 0 ? (
            <div className="text-center py-4 text-muted">Este usuário ainda não cadastrou nenhum produto.</div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="bg-light small">
                <tr>
                  <th>Produto</th>
                  <th>Ingredientes</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {userProducts.map((prod, idx) => (
                  <tr key={prod._id || idx}>
                    <td className="fw-bold">{prod.nome || prod.nomeProduto}</td>
                    <td><Badge bg="info">{prod.ingredientes?.length || 0} itens</Badge></td>
                    <td className="text-end">
                      <Button 
                        variant="link" 
                        className="p-0" 
                        title="Ver Ingredientes"
                        onClick={() => handleVerIngredientes(prod)}
                      >
                        <FaEye size={18} color="#044CF4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserProducts(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showProductIngredients} onHide={() => setShowProductIngredients(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Receita: {selectedProduct?.nome || selectedProduct?.nomeProduto}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedProduct?.ingredientes || selectedProduct.ingredientes.length === 0 ? (
            <p className="text-muted text-center">Nenhum ingrediente cadastrado.</p>
          ) : (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Matéria Prima</th>
                  <th>Qtd.</th>
                  <th>Unid.</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.ingredientes.map((ing, i) => {
                  let nomeIngrediente = "---";
                  if (ing.materiaPrima && typeof ing.materiaPrima === 'object' && ing.materiaPrima.nome) {
                    nomeIngrediente = ing.materiaPrima.nome;
                  } else if (ing.nome) {
                    nomeIngrediente = ing.nome;
                  } else if (ing.materiaPrima && typeof ing.materiaPrima === 'string') {
                     nomeIngrediente = "Item (Nome não encontrado)";
                  } else if (!ing.materiaPrima && !ing.nome) {
                     nomeIngrediente = "(Item excluído do estoque)";
                  }

                  return (
                    <tr key={i}>
                      <td className="fw-bold">{nomeIngrediente}</td>
                      <td>{ing.quantidade}</td>
                      <td>{ing.unidade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowProductIngredients(false)}>Voltar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNovoAdmin} onHide={() => setShowNovoAdmin(false)} centered>
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold">Novo Administrador</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="text-muted small">Adicione um colaborador da universidade.</p>
          {creatingAdminError && <Alert variant="danger">{creatingAdminError}</Alert>}
          <Form>
            <Form.Group className="mb-3"><Form.Label>Nome</Form.Label><Form.Control type="text" onChange={e => setNovoAdmin({...novoAdmin, nome: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Matrícula</Form.Label><Form.Control type="text" onChange={e => setNovoAdmin({...novoAdmin, matricula: e.target.value})}/></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Senha</Form.Label><Form.Control type="password" onChange={e => setNovoAdmin({...novoAdmin, senha: e.target.value})}/></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowNovoAdmin(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: "#044CF4", border: "none" }} onClick={salvarAdminReal} disabled={creatingAdminLoading}>
            {creatingAdminLoading ? <Spinner size="sm" className="me-2"/> : null} Salvar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default AdminDashboard;