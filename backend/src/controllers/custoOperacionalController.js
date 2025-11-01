import CustoOperacional from "../db/models/custoOperacional.js";

class CustoOperacionalController {

  static cadastrarCusto = async (req, res) => {
    try {
      const { usuario, nome, valorMensal } = req.body;
      if (!usuario) {
        return res.status(400).json({ message: "O ID do usuário é obrigatório." });
      }

      const novoCusto = new CustoOperacional({ usuario, nome, valorMensal });
      const custoSalvo = await novoCusto.save();
      res.status(201).json({ message: "Custo cadastrado com sucesso!", item: custoSalvo });

    } catch (erro) {
      res.status(500).json({ message: `Falha ao cadastrar: ${erro.message}` });
    }
  };

  static listarCustosPorUsuario = async (req, res) => {
    try {
      const userId = req.params.userId;
      const lista = await CustoOperacional.find({ usuario: userId });
      res.status(200).json(lista);
    } catch (erro) {
      res.status(500).json({ message: "Erro ao buscar custos." });
    }
  };


  static atualizarCusto = async (req, res) => {
    try {
      const id = req.params.id;
      const { nome, valorMensal } = req.body;

      const itemAtualizado = await CustoOperacional.findByIdAndUpdate(
        id,
        { $set: { nome, valorMensal } },
        { new: true, runValidators: true }
      );

      if (itemAtualizado) {
        res.status(200).json({ message: "Item atualizado com sucesso!", item: itemAtualizado });
      } else {
        res.status(404).json({ message: "Custo não encontrado." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao atualizar: ${erro.message}` });
    }
  };

  static deletarCusto = async (req, res) => {
    try {
      const id = req.params.id;
      const resultado = await CustoOperacional.findByIdAndDelete(id);

      if (resultado) {
        res.status(200).json({ message: "Custo deletado com sucesso." });
      } else {
        res.status(404).json({ message: "Custo não encontrado." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao deletar: ${erro.message}` });
    }
  };
}

export default CustoOperacionalController;