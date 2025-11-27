import Produto from "../db/models/produto.js";
import MateriaPrima from "../db/models/materiaprima.js";
import User from "../db/models/user.js"; // Import o User (necessário para o cálculo)
import Despesa from "../db/models/despesa.js";
import CustoOperacional from "../db/models/custoOperacional.js";

class ProdutoController {

    // Helper: normalize unit strings to allowed enum values
    static _normalizeUnit(unit) {
        if (!unit && unit !== '') return undefined;
        const u = String(unit).trim().toLowerCase();
        if (u === 'kg') return 'kg';
        if (u === 'g') return 'g';
        if (u === 'l' || u === 'lt' || u === 'ltr') return 'L';
        if (u === 'ml') return 'ml';
        if (u === 'un' || u === 'unidade' || u === 'unit') return 'unidade';
        return unit; // fallback as-is
    }

    // Helper: convert quantity from `fromUnit` to `toUnit` (supports g<->kg and ml<->L)
    static _convertQuantity(quantity, fromUnit, toUnit) {
        if (quantity == null || isNaN(quantity)) return 0;
        if (!fromUnit || !toUnit) return Number(quantity);
        const f = String(fromUnit).toLowerCase();
        const t = String(toUnit).toLowerCase();
        // grams <-> kilograms
        if (f === 'g' && t === 'kg') return Number(quantity) / 1000;
        if (f === 'kg' && t === 'g') return Number(quantity) * 1000;
        // milliliters <-> liters
        if (f === 'ml' && t === 'l') return Number(quantity) / 1000;
        if (f === 'l' && t === 'ml') return Number(quantity) * 1000;
        // same unit or unknown conversions
        return Number(quantity);
    }


  static cadastrarProduto = async (req, res) => {
    try {
      const {
        usuario,
        nome,
        unidade,
        ingredientes,
        tempoProducaoHoras,
        vendasMensaisEsperadas,
        margemLucroPercentual
      } = req.body;

      if (!usuario || !nome || !unidade || !ingredientes) {
        return res.status(400).json({ message: "Campos obrigatórios faltando (usuário, nome, unidade, ingredientes)." });
      }

      let ingredientesProcessados = [];
      ingredientesProcessados = await Promise.all(
        ingredientes.map(async (ing) => {
          const mp = await MateriaPrima.findById(ing.materiaPrima);
          if (!mp) {
            throw new Error(`Matéria-prima com ID ${ing.materiaPrima} não encontrada.`);
          }

          // normalize units and convert provided quantity to MP unit when calculating cost
          const providedUnit = ProdutoController._normalizeUnit(ing.unidade) || ProdutoController._normalizeUnit(mp.unidade);
          const mpUnit = ProdutoController._normalizeUnit(mp.unidade);
          const quantidadeForCost = ProdutoController._convertQuantity(Number(ing.quantidade), providedUnit, mpUnit);

          // Calcular custo por unidade da matéria-prima (valorUnitario é o preço da embalagem)
          const custoPorUnidade = mp.valorUnitario / (mp.quantidade || 1);
          const custoIngrediente = custoPorUnidade * quantidadeForCost;            const custoIngrediente = custoPorUnidade * quantidadeForCost;          return {
            materiaPrima: ing.materiaPrima,
            quantidade: Number(ing.quantidade),
            unidade: providedUnit,
            custoIngrediente: custoIngrediente
          };
        })
      );

      const novoProduto = new Produto({
        usuario,
        nome,
        unidade,
        ingredientes: ingredientesProcessados,
        tempoProducaoHoras: Number(tempoProducaoHoras) || 0,
        vendasMensaisEsperadas: Number(vendasMensaisEsperadas) || 0,
        margemLucroPercentual: margemLucroPercentual || 20
      });

      const produtoSalvo = await novoProduto.save();
      res.status(201).json({ message: "Produto cadastrado com sucesso!", item: produtoSalvo });

    } catch (erro) {
      console.error("Erro no cadastro de produto:", erro);
      res.status(500).json({ message: `Falha ao cadastrar produto: ${erro.message}` });
    }
  };


  static listarProdutosPorUsuario = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      const lista = await Produto.find({ usuario: userId })
                           .populate("ingredientes.materiaPrima", "nome unidade valorUnitario"); 

      res.status(200).json(lista);
    } catch (erro) {
      res.status(500).json({ message: "Erro ao buscar produtos." });
    }
  };

  static atualizarProduto = async (req, res) => {
    try {
      const id = req.params.id;
      const dadosAtualizacao = req.body;

      // If tempoProducaoHoras or vendasMensaisEsperadas are present in update, coerce to number
      if (dadosAtualizacao.tempoProducaoHoras !== undefined) {
        dadosAtualizacao.tempoProducaoHoras = Number(dadosAtualizacao.tempoProducaoHoras);
      }
      if (dadosAtualizacao.vendasMensaisEsperadas !== undefined) {
        dadosAtualizacao.vendasMensaisEsperadas = Number(dadosAtualizacao.vendasMensaisEsperadas);
      }


      if (dadosAtualizacao.ingredientes) {

        let ingredientesProcessados = await Promise.all(
          dadosAtualizacao.ingredientes.map(async (ing) => {
            const mp = await MateriaPrima.findById(ing.materiaPrima);
            if (!mp) {
              throw new Error(`Matéria-prima com ID ${ing.materiaPrima} não encontrada.`);
            }

            const providedUnit = ProdutoController._normalizeUnit(ing.unidade) || ProdutoController._normalizeUnit(mp.unidade);
            const mpUnit = ProdutoController._normalizeUnit(mp.unidade);
            const quantidadeForCost = ProdutoController._convertQuantity(Number(ing.quantidade), providedUnit, mpUnit);

            const custoIngrediente = mp.valorUnitario * quantidadeForCost;
            return {
              materiaPrima: ing.materiaPrima,
              quantidade: Number(ing.quantidade),
              unidade: providedUnit,
              custoIngrediente: custoIngrediente
            };
          })
        );

        dadosAtualizacao.ingredientes = ingredientesProcessados;
      }

      const produtoAtualizado = await Produto.findByIdAndUpdate(id, dadosAtualizacao, { new: true });

      if (produtoAtualizado) {
        res.status(200).json({ message: "Produto atualizado com sucesso!", item: produtoAtualizado });
      } else {
        res.status(404).json({ message: "Produto não encontrado para atualização." });
      }

    } catch (erro) {
      console.error("Erro na atualização de produto:", erro);
      res.status(500).json({ message: `Falha ao atualizar produto: ${erro.message}` });
    }
  };

  static deletarProduto = async (req, res) => {
    try {
      const id = req.params.id;
      const resultado = await Produto.findByIdAndDelete(id);

      if (resultado) {
        res.status(200).json({ message: "Produto deletado com sucesso." });
      } else {
        res.status(404).json({ message: "Produto não encontrado." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao deletar: ${erro.message}` });
    }
  };
  
  static calcularPrecoFinal = async (req, res) => {
    try {
      const produtoId = req.params.id;

      // 1. Buscar o Produto e popular o usuário
      const produto = await Produto.findById(produtoId).populate('usuario');
      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const usuario = produto.usuario;
      if (!usuario) {
        return res.status(404).json({ message: "Usuário do produto não encontrado." });
      }

      // 2. Custo Variável (soma dos ingredientes)
      const custoVariavel = produto.ingredientes.reduce(
        (total, ing) => total + ing.custoIngrediente, 
        0
      );

      // Popular matéria prima para mostrar detalhes no debug
      await produto.populate('ingredientes.materiaPrima');

      // 3. Despesas Fixas Mensais
      const despesas = await Despesa.find({ usuario: usuario._id });
      const custosOp = await CustoOperacional.find({ usuario: usuario._id });
      
      const totalDespesas = despesas.reduce((total, item) => total + item.valorMensal, 0);
      const totalCustosOp = custosOp.reduce((total, item) => total + item.valorMensal, 0);
      const despesasFixasMensais = totalDespesas + totalCustosOp;

      // 4. Estimativa de Vendas Mensais
      // Permite sobrescrever via query param ?salesVolume=..., senão usa o valor salvo no produto
      const querySales = Number(req.query.salesVolume || req.query.vendasMensais || 0);
      let estimativaVendasMensal = 0;
      if (querySales && querySales > 0) {
        estimativaVendasMensal = querySales;
      } else if (produto.vendasMensaisEsperadas && Number(produto.vendasMensaisEsperadas) > 0) {
        estimativaVendasMensal = Number(produto.vendasMensaisEsperadas);
      } else {
        estimativaVendasMensal = 0;
      }

      // 5. Custo Fixo Unitário (rateio das despesas fixas por unidade vendida)
      const custoFixoUnitario = estimativaVendasMensal > 0 ? (despesasFixasMensais / estimativaVendasMensal) : 0;

      // 6. Custo Total do Produto
      const custoTotal = custoVariavel + custoFixoUnitario;

      // 7. Taxas Totais (margem de lucro + impostos + taxas de cartão, etc.)
      // Por enquanto, usa apenas a margem de lucro; futuramente adicionar impostos e taxaCartao
      const margemLucroDesejada = produto.margemLucroPercentual || 0;
      const impostosPorcentagem = 0; // TODO: adicionar campo no produto ou usuário
      const taxaCartaoPorcentagem = 0; // TODO: adicionar campo no produto ou usuário
      
      const taxasTotais = (impostosPorcentagem + taxaCartaoPorcentagem + margemLucroDesejada) / 100;
      
      if (taxasTotais >= 1) {
        return res.status(400).json({ message: "A soma das taxas (impostos + taxas + margem) deve ser menor que 100%." });
      }

      // 8. Preço de Venda Técnico
      const precoVendaTecnico = taxasTotais > 0 ? (custoTotal / (1 - taxasTotais)) : custoTotal;

      res.status(200).json({
        produtoNome: produto.nome,
        custoVariavel: parseFloat(custoVariavel.toFixed(2)),
        custoFixoUnitario: parseFloat(custoFixoUnitario.toFixed(2)),
        custoTotal: parseFloat(custoTotal.toFixed(2)),
        margemLucroPercentual: margemLucroDesejada,
        precoVendaSugerido: parseFloat(precoVendaTecnico.toFixed(2)),
        detalhesCalculo: {
          despesasFixasMensais: parseFloat(despesasFixasMensais.toFixed(2)),
          estimativaVendasMensal: estimativaVendasMensal,
          ingredientesDetalhados: produto.ingredientes.map(ing => ({
            nome: ing.materiaPrima?.nome || 'N/A',
            quantidade: ing.quantidade,
            unidade: ing.unidade,
            custoUnitario: parseFloat(ing.custoIngrediente.toFixed(2))
          }))
        }
      });
    } catch (erro) {
      console.error("Erro ao calcular preço:", erro);
      res.status(500).json({ message: `Erro ao calcular preço final: ${erro.message}` });
    }
  };}

export default ProdutoController;