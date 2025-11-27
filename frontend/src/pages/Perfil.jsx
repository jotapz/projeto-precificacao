import React, { useState, useEffect } from "react";
import { Row, Col, Button, Badge, Spinner, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPen, FaCalendarAlt, FaCamera } from "react-icons/fa";

import { PROFILE_IMAGE } from "../components/HeaderProfile"; 

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editar, setEditar] = useState({
    nome: '',
    email: '',
    bairro: '',
    cpf: '',
    tipoNegocio: ''
  });

  useEffect(() => {

    const dadosStorage = localStorage.getItem("usuario");
    if (dadosStorage) {
      const userData = JSON.parse(dadosStorage);
      setUsuario(userData);
      setEditar({
        nome: userData.nome || '',
        email: userData.email || '',
        bairro: userData.bairro || '',
        cpf: userData.cpf || '',
        tipoNegocio: userData.tipoNegocio || ''
      });
    }
    setCarregando(false);
  }, []);

  const handleEditarClick = () => {
    // Sincronizar os dados do usuário com o formulário de edição antes de abrir
    if (usuario) {
      setEditar({
        nome: usuario.nome || '',
        email: usuario.email || '',
        bairro: usuario.bairro || '',
        cpf: usuario.cpf || '',
        tipoNegocio: usuario.tipoNegocio || ''
      });
    }
    setShowModal(true);
  };

  const handleFecharModal = () => {
    setShowModal(false);
  };

  const handleSalvarEdicao = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editar)
      });

      if (res.ok) {
        const dadosAtualizados = { ...usuario, ...editar };
        setUsuario(dadosAtualizados);
        localStorage.setItem('usuario', JSON.stringify(dadosAtualizados));
        alert('Perfil atualizado com sucesso!');
        handleFecharModal();
      } else {
        alert('Erro ao atualizar perfil');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (carregando) {
    return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary"/></div>;
  }

  return (
    <div className="min-vh-100 bg-light">
      
      <div className="bg-white py-3 px-4 d-flex justify-content-between align-items-center shadow-sm" style={{ height: "80px" }}>
        <div className="d-flex align-items-center gap-2">

           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM12yH_4BpgheFunQXK6xLspQb7USkO-kkNQ&s" alt="Logo" width="50" />
           <h4 className="mb-0 fw-bold text-primary" style={{ color: "#044CF4" }}>NAF</h4>
        </div>
        

        <div className="d-flex align-items-center gap-3">
          <div className="text-end lh-1 d-none d-md-block">
            <div className="fw-bold text-dark">{usuario?.nome?.split(' ')[0] || "Usuário"}</div>
            <small className="text-muted">Empreendedor</small>
          </div>
          <div className="rounded-circle border d-flex justify-content-center align-items-center" 
               style={{ width: "45px", height: "45px", overflow: "hidden", cursor: "pointer" }}>
            <img src={PROFILE_IMAGE} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>

      <div className="w-100 d-flex align-items-center px-4" style={{ backgroundColor: "#044CF4", height: "60px" }}>
        <div className="text-white fw-bold border-bottom border-3 border-white pb-1" style={{ cursor: "pointer" }}>
          Minha Conta
        </div>
        <div className="text-white opacity-75 ms-4 pb-1" style={{ cursor: "pointer" }} onClick={() => navigate("/SistemaPrec")}>
          Voltar ao Sistema
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: "1100px" }}>
        
        <Row className="g-4">
          
          <Col lg={4}>
            <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 position-relative overflow-hidden">
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(135deg, #044CF4 0%, #002a8a 100%)" }}></div>
              
              <div className="position-relative d-inline-block mt-4 mb-3">
                <img 
                  src={PROFILE_IMAGE} 
                  alt="Perfil" 
                  className="rounded-circle border border-4 border-white shadow"
                  style={{ width: "140px", height: "140px", objectFit: "cover" }}
                />
                <button className="btn btn-sm btn-light rounded-circle shadow-sm position-absolute bottom-0 end-0 border" title="Alterar foto">
                  <FaCamera color="#555" />
                </button>
              </div>

              <h4 className="fw-bold mb-1">{usuario?.nome || "Nome do Usuário"}</h4>
              <p className="text-muted mb-3">{usuario?.email}</p>
              
              <Badge bg="success" className="px-3 py-2 rounded-pill mb-4">Conta Ativa</Badge>

              <div className="d-grid gap-2">
                <Button variant="outline-danger" className="fw-bold rounded-pill border-0" onClick={handleLogout}>
                  Sair da Conta
                </Button>
              </div>

              <div className="mt-4 pt-3 border-top text-muted small">
                 <FaCalendarAlt className="me-1 mb-1"/>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            <div className="bg-white rounded-4 shadow-sm p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h5 className="fw-bold text-primary mb-0" style={{ color: "#044CF4" }}>Dados Pessoais</h5>
                <Button size="sm" style={{ backgroundColor: "#044CF4", border: "none" }} className="rounded-pill px-3" onClick={handleEditarClick}>
                  <FaPen size={12} className="me-2" /> Editar Perfil
                </Button>
              </div>

              <Row className="g-3">
                
                <Col md={12}>
                  <label className="small text-muted text-uppercase fw-bold mb-1">Nome Completo</label>
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border border-light">
                    <div className="bg-white p-2 rounded-circle text-primary shadow-sm">
                      <FaUser />
                    </div>
                    <span className="fw-medium">{usuario?.nome || "Não informado"}</span>
                  </div>
                </Col>

                <Col md={6}>
                  <label className="small text-muted text-uppercase fw-bold mb-1">Email de Acesso</label>
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border border-light">
                     <div className="bg-white p-2 rounded-circle text-primary shadow-sm">
                      <FaEnvelope />
                    </div>
                    <span>{usuario?.email || "Não informado"}</span>
                  </div>
                </Col>

                <Col md={6}>
                  <label className="small text-muted text-uppercase fw-bold mb-1">CPF / CNPJ</label>
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border border-light">
                     <div className="bg-white p-2 rounded-circle text-primary shadow-sm">
                      <FaIdCard />
                    </div>
                    <span>{usuario?.cpf || "Não informado"}</span>
                  </div>
                </Col>

                <Col md={12}>
                  <label className="small text-muted text-uppercase fw-bold mb-1">Endereço / Bairro</label>
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border border-light">
                     <div className="bg-white p-2 rounded-circle text-primary shadow-sm">
                      <FaMapMarkerAlt />
                    </div>
                    <span>{usuario?.bairro || "Não informado"}</span>
                  </div>
                </Col>

                <Col md={12}>
                  <label className="small text-muted text-uppercase fw-bold mb-1">Tipo de Negócio</label>
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border border-light">
                     <div className="bg-white p-2 rounded-circle text-primary shadow-sm">
                      <FaUser />
                    </div>
                    <span>{usuario?.tipoNegocio ? (usuario.tipoNegocio === 'pastelaria' ? 'Pastelaria' : usuario.tipoNegocio === 'pizzaria' ? 'Pizzaria' : usuario.tipoNegocio) : "Não informado"}</span>
                  </div>
                </Col>

              </Row>

              {/* Modal de Edição */}
              <Modal show={showModal} onHide={handleFecharModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Editar Perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={editar.nome} 
                        onChange={(e) => setEditar({...editar, nome: e.target.value})}
                        placeholder="Digite seu nome"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={editar.email} 
                        disabled
                        placeholder="Digite seu email"
                      />
                      <small className="text-muted">Não é possível alterar o email</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bairro / Endereço</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={editar.bairro} 
                        onChange={(e) => setEditar({...editar, bairro: e.target.value})}
                        placeholder="Digite seu bairro"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>CPF / CNPJ</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={editar.cpf} 
                        disabled
                        placeholder="Digite seu CPF/CNPJ"
                      />
                      <small className="text-muted">Não é possível alterar o CPF/CNPJ</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Negócio</Form.Label>
                      <Form.Select 
                        value={editar.tipoNegocio} 
                        onChange={(e) => setEditar({...editar, tipoNegocio: e.target.value})}
                      >
                        <option value="">Selecione o tipo de negócio</option>
                        <option value="pastelaria">Pastelaria</option>
                        <option value="pizzaria">Pizzaria</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleFecharModal}>
                    Cancelar
                  </Button>
                  <Button style={{ backgroundColor: "#044CF4", border: "none" }} onClick={handleSalvarEdicao}>
                    Salvar Alterações
                  </Button>
                </Modal.Footer>
              </Modal>

            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Perfil;