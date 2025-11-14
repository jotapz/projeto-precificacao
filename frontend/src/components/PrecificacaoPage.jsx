import { useState, useEffect } from "react";

function PrecificacaoPage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [salesVolume, setSalesVolume] = useState("100");
  const API_URL = "http://localhost:3000/api";
  const userId = localStorage.getItem("userId");
  const [produtos, setProdutos] = useState([]);
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
    };

    fetchProdutos();
  }, [userId]);

  useEffect(() => {
    const fetchCalculo = async () => {
      if (!selectedProduct) {
        setCalculo(null);
        setCalculoError(null);
        return;
      }

      try {
        setLoadingCalculo(true);
        setCalculoError(null);
        const res = await fetch(`${API_URL}/produtos/${selectedProduct}/preco-final`);
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
            <h5 className="fw-semibold mb-4">Parâmetros de Cálculo</h5>

            {/* Select Produto */}
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

            {/* Vendas mensais */}
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
            </div>

            <hr />

            {/* Custos Operacionais Mensais */}
            <div>
              <h6 className="fw-semibold mb-1">
                Custos Operacionais Mensais
              </h6>
              <p
                className="fw-bold"
                style={{ fontSize: "1.25rem", color: "#007bff", margin: 0 }}
              >
                R$ 90.00
              </p>
              <small style={{ color: "#999" }}>custos cadastrados</small>
            </div>
          </div>
        </div>

        {/* ----------------------- COLUNA DIREITA ------------------------ */}
        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{
              borderRadius: "12px",
              border: "none",
              minHeight: "380px",
            }}
          >
            <h5 className="fw-semibold mb-4">Resultado do Cálculo</h5>
            {!selectedProduct ? (
              <p style={{ color: "#999", fontSize: "0.95rem" }}>
                Selecione um produto para ver o cálculo
              </p>
            ) : loadingCalculo ? (
              <p style={{ color: "#999", fontSize: "0.95rem" }}>Carregando resultado...</p>
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
                      <li>Horas trabalhadas/mês: {calculo.detalhesCalculo.horasTrabalhadasMes}</li>
                      <li>Custo por hora: R$ {Number(calculo.detalhesCalculo.custoPorHora).toFixed(2)}</li>
                      <li>Tempo produção (h): {calculo.detalhesCalculo.tempoProducaoHoras}</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#ccc" }}>Nenhum produto selecionado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------- CARDS DE RESUMO ------------------------ */}
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
              R$ 90.00
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
              1
            </h3>
            <small style={{ color: "#999" }}>registros criados</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrecificacaoPage;
