import { Container, Row, Col, Card } from "react-bootstrap";
import { FaCheckCircle, FaAward } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Inicio() {
  const beneficios = [
    {
      titulo: "Orientação para emissão de CNPJ",
      descricao: "Auxílio completo no processo de abertura de empresa e emissão do CNPJ",
    },
    {
      titulo: "Preenchimento da declaração do Imposto de Renda Pessoa Física",
      descricao: "Suporte especializado para preenchimento correto da declaração de IRPF",
    },
    {
      titulo: "Verificação de regularidade de CPF",
      descricao: "Consulta e orientação sobre situação cadastral do CPF",
    },
    {
      titulo: "Esclarecimento de dúvidas contábeis e tributárias",
      descricao: "Orientação especializada em questões contábeis e fiscais",
    },
    {
      titulo: "Orientação para microempreendedores individuais (MEIs)",
      descricao: "Auxílio completo no processo de abertura de empresa e emissão do CNPJ",
    },
    {
      titulo: "Suporte em questões fiscais em geral",
      descricao: "Atendimento abrangente para diversas questões fiscais e tributárias",
    },
  ];

  return (
    <div className="fade-in">
      <Header />

   
      <div className="text-center mt-5" data-aos="fade-up">
        <h1 className="fw-bold display-2 text-shadow-md" style={{ color: "#044CF4" }}>NAF</h1>
        <h3>Núcleo de Apoio Contábil e Fiscal</h3>
        <div className="bg-light p-4 mt-4 w-75 mx-auto rounded shadow-sm">
          <Container>
            <h3 className="fw-bold" style={{ color: "#044CF4" }}>Melhor NAF do Norte/Nordeste pela Receita Federal</h3>
            <p className="mt-3 fs-5">
              O Núcleo de Apoio Contábil e Fiscal (NAF) da Unifor é responsável
              por aprimorar o conhecimento acadêmico e prestar assistência
              gratuita à população por meio da orientação sobre assuntos das
              áreas contábil e fiscal. O atendimento é realizado por alunos e
              supervisionado por professores do curso de Ciências Contábeis.
            </p>
          </Container>
        </div>
      </div>

   
      <Container className="text-center my-5" data-aos="fade-up">
        <h2 className="fw-bold mb-4 text-shadow-md" style={{ color: "#044CF4" }}>Atendimento Integrado</h2>
        <Row xs={1} md={2} lg={4} className="g-4">
          <Col>
            <Card className="h-100 bg-light border-0 shadow-sm py-3">
              <Card.Body>
                <h3 className="h5">Atendimentos Realizados</h3>
                <p className="fw-bold fs-4 text-primary">+ de 4 mil</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 bg-light border-0 shadow-sm py-3">
              <Card.Body>
                <h3 className="h5">Declaração de IRPF</h3>
                <p className="fw-bold fs-4 text-primary">+ de 1 mil</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 bg-light border-0 shadow-sm py-3">
              <Card.Body>
                <h3 className="h5">MEIs regularizados</h3>
                <p className="fw-bold fs-4 text-primary">+ de 600</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 bg-light border-0 shadow-sm py-3">
              <Card.Body>
                <h3 className="h5">Ações diferenciadas</h3>
                <p className="fw-bold fs-4 text-primary">+ de 40</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

     
      <Container className="my-5 pb-5" data-aos="fade-up">
        <h2 className="text-center fw-bold mb-4 text-shadow-md" style={{ color: "#044CF4" }}>
          Benefícios para a comunidade
        </h2>
        <p className="text-center mb-5 fs-5 mx-auto" style={{ maxWidth: '800px' }}>
          O atendimento prestado pelo Núcleo beneficia a comunidade em geral,
          incluindo contribuintes, pessoas físicas, microempreendedores
          individuais (MEIs), entre outros. No NAF, os contribuintes têm
          acesso a serviços como:
        </p>

        <Row xs={1} md={2} lg={3} className="g-4">
          {beneficios.map((item, index) => (
            <Col key={index}>
              <Card className="h-100 shadow-sm border" style={{ borderRadius: '16px', borderColor: '#e9ecef' }}>
                <Card.Body className="d-flex align-items-start p-4">
                  <FaCheckCircle className="text-success me-3 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <Card.Title className="mb-2" style={{ fontSize: '1.1rem' }}>
                      {item.titulo}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      {item.descricao}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>


      <div className=" py-5 mb-5" data-aos="fade-up">
        <Container>
          <Row className="align-items-center gx-5 gy-4">
            <Col lg={7}>
              <h2 className="fw-bold mb-4 text-shadow-sm" style={{ color: "#044CF4" }}>
                Sobre o NAF
              </h2>
              <p className="fs-5 text-muted">
                Criado em 2014, o NAF promove ainda o intercâmbio de experiências e
                conhecimentos técnicos entre o Fisco (Federal, Estadual e Municipal) e a
                Universidade, ampliando a visão dos estudantes sobre o universo da
                Contabilidade por meio da promoção de atendimento, treinamentos e
                palestras que agregam valor ao conhecimento sobre questões práticas
                do cotidiano contábil e tributário.
              </p>
            </Col>
            <Col lg={5}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaAward className="text-warning me-3" size={32} />
                    <h4 className="fw-bold mb-0">Reconhecimento</h4>
                  </div>
                  <Card.Text className="text-muted fs-6" style={{ lineHeight: '1.6' }}>
                    O NAF da Unifor foi reconhecido como o melhor NAF do
                    Nordeste pela Receita Federal, destacando-se pela
                    excelência no atendimento e qualidade dos serviços
                    prestados à comunidade.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
}

export default Inicio;