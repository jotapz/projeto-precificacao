import MateriaPrima from "../db/models/materiaprima.js";

class MateriaPrimaController {


  static cadastrarMateriaPrima = async (req, res) => {
    try {
     
      const { usuario, nome, quantidade, valorUnitario, unidade } = req.body;
      
      if (!usuario) {
        return res.status(400).json({ message: "O ID do usuário é obrigatório." });
      }

      const novaMateriaPrima = new MateriaPrima({
        usuario,
        nome,
        quantidade,
        valorUnitario,
        unidade
      });

      const materiaPrimaSalva = await novaMateriaPrima.save();
      res.status(201).json({ message: "Matéria-prima cadastrada com sucesso!", item: materiaPrimaSalva });

    } catch (erro) {
      if (erro.name === 'ValidationError') {
        return res.status(400).json({ message: `Erro de validação: ${erro.message}` });
      }
      res.status(500).json({ message: `Falha ao cadastrar: ${erro.message}` });
    }
  };

  
  static listarMateriasPrimasPorUsuario = async (req, res) => {
    try {
      const userId = req.params.userId;
      const lista = await MateriaPrima.find({ usuario: userId });
      res.status(200).json(lista);
    } catch (erro) {
      res.status(500).json({ message: "Erro ao buscar matérias-primas." });
    }
  };

  
  static atualizarMateriaPrima = async (req, res) => {
    try {
      const id = req.params.id;
   
      const { nome, quantidade, valorUnitario, unidade } = req.body;

      const itemAtualizado = await MateriaPrima.findByIdAndUpdate(
        id,
        { $set: { nome, quantidade, valorUnitario, unidade } },
        { new: true, runValidators: true }
      );

      if (itemAtualizado) {
        res.status(200).json({ message: "Item atualizado com sucesso!", item: itemAtualizado });
      } else {
        res.status(404).json({ message: "Matéria-prima não encontrada." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao atualizar: ${erro.message}` });
    }
  };

  static deletarMateriaPrima = async (req, res) => {
    try {
      const id = req.params.id;
      const resultado = await MateriaPrima.findByIdAndDelete(id);

      if (resultado) {
        res.status(200).json({ message: "Matéria-prima deletada com sucesso." });
      } else {
        res.status(404).json({ message: "Matéria-prima não encontrada." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao deletar: ${erro.message}` });
    }
  };
}

export default MateriaPrimaController;