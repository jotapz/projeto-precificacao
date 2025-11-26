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

          const custoIngrediente = mp.valorUnitario * quantidadeForCost;

          return {
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

      // 2. Custo Variável (Soma dos Ingredientes)
      const custoIngredientes = produto.ingredientes.reduce(
        (total, ing) => total + ing.custoIngrediente, 
        0
      );

      // 3. Custos Fixos Mensais (CFM)
      const despesas = await Despesa.find({ usuario: usuario._id });
      const custosOp = await CustoOperacional.find({ usuario: usuario._id });
      
      const totalDespesas = despesas.reduce((total, item) => total + item.valorMensal, 0);
      const totalCustosOp = custosOp.reduce((total, item) => total + item.valorMensal, 0);
      const CFM = totalDespesas + totalCustosOp; // Custo Fixo Mensal Total

      // 4. Custo da Hora de Produção (CHP)
      // usa o valor definido no usuário ou padrão de 176 horas/mês
      let horasTrabalhadasMes = usuario.horasTrabalhadasMes;
      if (!horasTrabalhadasMes || horasTrabalhadasMes === 0) {
        horasTrabalhadasMes = 176; // padrão
      }
      const CHP = CFM / horasTrabalhadasMes;

      // 5. Custo Fixo do Produto (CFP) — baseado no tempo de produção da unidade
        // 5. Custo Fixo do Produto (CFP)
        // - componente dado pelo tempo de produção da unidade: CHP * tempoProducaoHoras
        // - componente derivado da alocação dos custos fixos mensais por unidade vendida
        //   (se vendasMensais esperadas forem passadas pela query ?salesVolume=...)
        // Allow an explicit query param override (?salesVolume=...), otherwise use stored product value
        const querySales = Number(req.query.salesVolume || req.query.vendasMensais || 0);
        let vendasMensais = 0;
        if (querySales && querySales > 0) {
          vendasMensais = querySales;
        } else if (produto.vendasMensaisEsperadas && Number(produto.vendasMensaisEsperadas) > 0) {
          vendasMensais = Number(produto.vendasMensaisEsperadas);
        } else {
          vendasMensais = 0;
        }
        const overheadPorUnidade = vendasMensais > 0 ? (CFM / vendasMensais) : 0;

        const CFP_tempo = CHP * (produto.tempoProducaoHoras || 0);
        const CFP = CFP_tempo + overheadPorUnidade;

      // 6. Custo Total do Produto (CTP)
      const CTP = custoIngredientes + CFP;

      // 7. Preço de Venda Final (PVF)
      const margem = produto.margemLucroPercentual / 100;
      if (margem >= 1) {
        return res.status(400).json({ message: "Margem de lucro deve ser menor que 100%." });
      }
      
      const PVF = CTP / (1 - margem);


      res.status(200).json({
        produtoNome: produto.nome,
        custoIngredientes: parseFloat(custoIngredientes.toFixed(2)),
        custoFixoProduto: parseFloat(CFP.toFixed(2)),
        custoTotalProduto: parseFloat(CTP.toFixed(2)),
        margemLucroPercentual: produto.margemLucroPercentual,
        precoVendaSugerido: parseFloat(PVF.toFixed(2)),
        detalhesCalculo: {
            custoFixoMensalTotal: CFM,
            horasTrabalhadasMes,
            custoPorHora: parseFloat(CHP.toFixed(2)),
            tempoProducaoHoras: produto.tempoProducaoHoras || 0,
            vendasMensaisEsperadas: vendasMensais,
            overheadPorUnidade: parseFloat(overheadPorUnidade.toFixed(2)),
            custoFixoPorTempo: parseFloat(CFP_tempo.toFixed(2))
        }
      });
    } catch (erro) {
      console.error("Erro ao calcular preço:", erro);
      res.status(500).json({ message: `Erro ao calcular preço final: ${erro.message}` });
    }
  };

}

export default ProdutoController;