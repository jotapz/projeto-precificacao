import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaRedo } from "react-icons/fa";

function PrecificacaoPage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [salesVolume, setSalesVolume] = useState("");
  const API_URL = "http://localhost:3000/api";
  const userId = localStorage.getItem("userId");
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [custos, setCustos] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loadingCustos, setLoadingCustos] = useState(true);
  const [calculo, setCalculo] = useState(null);
  const [loadingCalculo, setLoadingCalculo] = useState(false);
  const [calculoError, setCalculoError] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        if (!userId) return;
        const res = await fetch(`${API_URL}/produtos/user/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        setProdutos(data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
      finally {
        setLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, [userId]);

  useEffect(() => {
    const fetchCustosDespesas = async () => {
      try {
        if (!userId) return;
        setLoadingCustos(true);
        const [custosRes, despesasRes] = await Promise.all([
          fetch(`${API_URL}/custos/user/${userId}`),
          fetch(`${API_URL}/despesas/user/${userId}`)
        ]);

        const custosData = custosRes.ok ? await custosRes.json() : [];
        const despesasData = despesasRes.ok ? await despesasRes.json() : [];

        setCustos(custosData || []);
        setDespesas(despesasData || []);
      } catch (err) {
        console.error('Erro ao carregar custos/despesas:', err);
      } finally {
        setLoadingCustos(false);
      }
    };

    fetchCustosDespesas();
  }, [userId]);

  const totalCustosOperacionais = (
    (custos || []).reduce((s, c) => s + (Number(c.valorMensal) || 0), 0) +
    (despesas || []).reduce((s, d) => s + (Number(d.valorMensal) || 0), 0)
  );

  useEffect(() => {
    // When a product is selected, if it has a stored vendasMensaisEsperadas use it
    if (selectedProduct && produtos && produtos.length > 0) {
      const prod = produtos.find(p => (p._id || p.id) === selectedProduct);
      if (prod && prod.vendasMensaisEsperadas && Number(prod.vendasMensaisEsperadas) > 0) {
        setSalesVolume(String(prod.vendasMensaisEsperadas));
      }
    }

    const fetchCalculo = async () => {
      if (!selectedProduct) {
        setCalculo(null);
        setCalculoError(null);
        return;
      }

      try {
        setLoadingCalculo(true);
        setCalculoError(null);
        // include salesVolume (vendas mensais esperadas) so backend can allocate fixed costs per unit
        const sv = Number(salesVolume) || 0;
        const res = await fetch(`${API_URL}/produtos/${selectedProduct}/preco-final?salesVolume=${encodeURIComponent(sv)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Erro ao calcular preço');
        }
        const data = await res.json();
        setCalculo(data);
      } catch (err) {
        console.error('Erro ao buscar cálculo:', err);
        setCalculoError(err.message || 'Erro desconhecido');
        setCalculo(null);
      } finally {
        setLoadingCalculo(false);
      }
    };

    fetchCalculo();
  }, [selectedProduct]);

  const handleLimpar = () => {
    setSelectedProduct("");
    setSalesVolume("100");
    setCalculo(null);
    setCalculoError(null);
  };

  const gerarPDF = () => {
    if (!calculo) return;

    const doc = new jsPDF();

    doc.setTextColor(4, 76, 244); 
    doc.setFontSize(18);
    doc.text("Relatório de Precificação", 14, 20);

    doc.setDrawColor(200);
    doc.line(14, 25, 196, 25);

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Produto: ${calculo.produtoNome}`, 14, 35);
    doc.text(`Data do cálculo: ${new Date().toLocaleDateString()}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [['Descrição', 'Valor']],
      body: [
        ['Custo de Ingredientes', `R$ ${Number(calculo.custoIngredientes).toFixed(2)}`],
        ['Custo Fixo (por produto)', `R$ ${Number(calculo.custoFixoProduto).toFixed(2)}`],
        ['Custo Total Unitário', `R$ ${Number(calculo.custoTotalProduto).toFixed(2)}`],
        ['Margem de Lucro', `${calculo.margemLucroPercentual}%`],
        ['PREÇO DE VENDA SUGERIDO', `R$ ${Number(calculo.precoVendaSugerido).toFixed(2)}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [4, 76, 244] },
      didParseCell: (data) => {
        if (data.row.index === 4) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [4, 76, 244];
        }
      }
    });

    if (calculo.detalhesCalculo) {
      doc.text("Detalhes Operacionais:", 14, doc.lastAutoTable.finalY + 15);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Parâmetro', 'Valor']],
        body: [
          ['Custo Fixo Mensal Total', `R$ ${Number(calculo.detalhesCalculo.custoFixoMensalTotal).toFixed(2)}`],
          ['Horas Trabalhadas/Mês', `${calculo.detalhesCalculo.horasTrabalhadasMes}h`],
          ['Custo da Hora', `R$ ${Number(calculo.detalhesCalculo.custoPorHora).toFixed(2)}`],
          ['Tempo de Produção', `${calculo.detalhesCalculo.tempoProducaoHoras}h`]
        ],
        theme: 'striped'
      });
    }

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Gerado pelo Sistema NAF", 105, 290, null, null, "center");

    doc.save(`Precificacao_${calculo.produtoNome}.pdf`);
  };

  return (
    <div
      className="container-fluid px-5"
      style={{ maxWidth: "1300px", margin: "0 auto" }}
    >
      <div className="mb-4">
        <h2 className="fw-bold" style={{ fontSize: "2.3rem", marginTop: "25px" }}>
          Calculadora de preços
        </h2>
        <p style={{ color: "#888", fontSize: "0.95rem" }}>
          Calcule o preço de venda sugerido pelos seus produtos
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{
              borderRadius: "12px",
              border: "none",
              minHeight: "380px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-semibold mb-0">Parâmetros de Cálculo</h5>
              
              {selectedProduct && (
                <button 
                  onClick={handleLimpar}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-3"
                  title="Limpar campos"
                >
                  <FaRedo size={12} /> Limpar
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Produto</label>
              <select
                className="form-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{ borderRadius: "6px", borderColor: "#ccc" }}
              >
                <option value="">Selecione um produto</option>
                {produtos && produtos.length > 0 ? (
                  produtos.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.nome}</option>
                  ))
                ) : null}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">
                Vendas Mensais Esperadas (Unidades)
              </label>
              <input
                type="number"
                value={salesVolume}
                onChange={(e) => setSalesVolume(e.target.value)}
                className="form-control"
                style={{ borderRadius: "6px", borderColor: "#ccc" }}
              />
              <small style={{ color: '#666' }}>
                Obs: o cálculo usa o valor "Vendas Mensais Esperadas" cadastrado no produto quando existe — altere este campo para testar um cenário temporário.
              </small>
            </div>

            <hr />

            <div>
              <h6 className="fw-semibold mb-1">
                Custos Operacionais Mensais
              </h6>
              <p
                className="fw-bold"
                style={{ fontSize: "1.25rem", color: "#007bff", margin: 0 }}
              >
                {loadingCustos ? (
                  'Carregando...'
                ) : (
                  `R$ ${Number(totalCustosOperacionais || 0).toFixed(2)}`
                )}
              </p>
              <small style={{ color: "#999" }}>custos cadastrados</small>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{
              borderRadius: "12px",
              border: "none",
              minHeight: "380px",
            }}
          >
           
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-semibold mb-0">Resultado do Cálculo</h5>
              {calculo && (
                <button 
                  onClick={gerarPDF}
                  className="btn btn-sm text-white d-flex align-items-center gap-2 rounded-pill px-3"
                  style={{ backgroundColor: "#28a745", border: "none" }} 
                  title="Baixar PDF"
                >
                  <FaFilePdf /> Exportar
                </button>
              )}
            </div>

            {!selectedProduct ? (
              <div style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#ccc" }}>Selecione um produto ao lado para ver o cálculo</p>
              </div>
            ) : loadingCalculo ? (
              <div style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : calculoError ? (
              <div style={{ color: "#c00" }}>Erro: {calculoError}</div>
            ) : calculo ? (
              <div>
                <div style={{ marginBottom: 12, color: "#666" }}>
                  Resultado para: <strong>{calculo.produtoNome}</strong>
                </div>

                <div style={{ padding: 12, borderRadius: 8, border: "1px solid #eee", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <small style={{ color: "#666" }}>Custo Ingredientes</small>
                    <strong>R$ {Number(calculo.custoIngredientes).toFixed(2)}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <small style={{ color: "#666" }}>Custo Fixo do Produto</small>
                    <strong>R$ {Number(calculo.custoFixoProduto).toFixed(2)}</strong>
                  </div>

                  <div style={{ height: 1, background: "#eee", margin: "10px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <small style={{ color: "#666" }}>Custo Total do Produto</small>
                    <strong>R$ {Number(calculo.custoTotalProduto).toFixed(2)}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <small style={{ color: "#666" }}>Margem</small>
                    <strong>{calculo.margemLucroPercentual}%</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                    <small style={{ color: "#666" }}>Preço de Venda Sugerido</small>
                    <h4 style={{ color: "#007bff", margin: 0 }}>R$ {Number(calculo.precoVendaSugerido).toFixed(2)}</h4>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <small style={{ color: "#999" }}>Detalhes:</small>
                    <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                      <li>Custos fixos mensais: R$ {Number(calculo.detalhesCalculo.custoFixoMensalTotal).toFixed(2)}</li>
                      <li>Vendas mensais esperadas: {calculo.detalhesCalculo.vendasMensaisEsperadas || 0} unidades</li>
                      <li>Overhead por unidade (CFM / vendas): R$ {Number(calculo.detalhesCalculo.overheadPorUnidade || 0).toFixed(2)}</li>
                      <li>Custo fixo por tempo (horas): R$ {Number(calculo.detalhesCalculo.custoFixoPorTempo || 0).toFixed(2)}</li>
                      <li>Horas trabalhadas/mês: {calculo.detalhesCalculo.horasTrabalhadasMes}</li>
                      <li>Custo por hora: R$ {Number(calculo.detalhesCalculo.custoPorHora).toFixed(2)}</li>
                      <li>Tempo produção (h): {calculo.detalhesCalculo.tempoProducaoHoras}</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

     
      <div className="row g-4 mt-4 mb-5">
        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{
              borderRadius: "12px",
              border: "none",
            }}
          >
            <h6 className="fw-semibold" style={{ color: "#007bff" }}>
              Custos Operacionais Totais
            </h6>
            <h3
              className="fw-bold"
              style={{ color: "#007bff", margin: "10px 0" }}
            >
              {loadingCustos ? 'Carregando...' : `R$ ${Number(totalCustosOperacionais || 0).toFixed(2)}`}
            </h3>
            <small style={{ color: "#999" }}>por mês</small>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{
              borderRadius: "12px",
              border: "none",
            }}
          >
            <h6 className="fw-semibold" style={{ color: "#28a745" }}>
              Produtos Cadastrados
            </h6>
            <h3
              className="fw-bold"
              style={{ color: "#28a745", margin: "10px 0" }}
            >
              {loadingProdutos ? 'Carregando...' : (produtos ? produtos.length : 0)}
            </h3>
            <small style={{ color: "#999" }}>registros criados</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrecificacaoPage;