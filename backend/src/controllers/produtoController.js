import Produto from "../db/models/produto.js";
import MateriaPrima from "../db/models/materiaprima.js";
import User from "../db/models/user.js"; // Import o User (necessário para o cálculo)
import Despesa from "../db/models/despesa.js";
import CustoOperacional from "../db/models/custoOperacional.js";

class ProdutoController {

  static cadastrarProduto = async (req, res) => {
    try {
      const { 
        usuario, 
        nome, 
        unidade, 
        ingredientes, 
        tempoProducaoHoras, 
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
          const custoIngrediente = mp.valorUnitario * ing.quantidade;

          return {
            materiaPrima: ing.materiaPrima,
            quantidade: ing.quantidade,
            custoIngrediente: custoIngrediente
          };
        })
      );

      const novoProduto = new Produto({
        usuario,
        nome,
        unidade,
        ingredientes: ingredientesProcessados,
        tempoProducaoHoras: tempoProducaoHoras || 0,
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


      if (dadosAtualizacao.ingredientes) {

        let ingredientesProcessados = await Promise.all(
          dadosAtualizacao.ingredientes.map(async (ing) => {
            const mp = await MateriaPrima.findById(ing.materiaPrima);
            if (!mp) {
              throw new Error(`Matéria-prima com ID ${ing.materiaPrima} não encontrada.`);
            }
            const custoIngrediente = mp.valorUnitario * ing.quantidade;
            return {
              materiaPrima: ing.materiaPrima,
              quantidade: ing.quantidade,
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
            // Usa o valor definido no usuário, ou o padrão de 176 horas/mês se não estiver presente
            let horasTrabalhadasMes = usuario.horasTrabalhadasMes;
            if (!horasTrabalhadasMes || horasTrabalhadasMes === 0) {
                horasTrabalhadasMes = 176; // padrão
            }
            const CHP = CFM / horasTrabalhadasMes;

      // 5. Custo Fixo do Produto (CFP)
      const CFP = CHP * produto.tempoProducaoHoras;

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
          horasTrabalhadasMes: horasTrabalhadasMes,
          custoPorHora: parseFloat(CHP.toFixed(2)),
          tempoProducaoHoras: produto.tempoProducaoHoras
        }
      });

    } catch (erro) {
      console.error("Erro ao calcular preço:", erro);
      res.status(500).json({ message: `Erro ao calcular preço final: ${erro.message}` });
    }
  };

}

export default ProdutoController;