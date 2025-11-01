import User from "../db/models/user.js"; 
import bcrypt from "bcrypt"; 

class UserController {


  static cadastrarUsuario = async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      const novoUsuario = new User({
        nome,
        email,
        senha: senhaHash,
      });

      const usuarioSalvo = await novoUsuario.save();
    
      const usuarioParaRetorno = await User.findById(usuarioSalvo._id).select('-senha');
      res.status(201).send({ message: "Usuário cadastrado com sucesso!", usuario: usuarioParaRetorno }); 

    } catch (erro) {
      if (erro.code === 11000) {
        return res.status(400).json({ message: "Este email já está em uso." });
      }
      res.status(500).json({ message: `Falha ao cadastrar: ${erro.message}` });
    }
  };


  static listarUsuarios = async (req, res) => {
    try {
      const listaUsuarios = await User.find().select('-senha'); 
      res.status(200).json(listaUsuarios);
    } catch (erro) {
      res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  };


  static buscarUsuarioPorId = async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await User.findById(id).select('-senha');

      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao buscar usuário: ${erro.message}` });
    }
  };

  static atualizarUsuario = async (req, res) => {
    try {
      const id = req.params.id;
      const dadosAtualizacao = req.body;

      // Medida de segurança: não permitir atualização de senha por esta rota
      if (dadosAtualizacao.senha) {
        delete dadosAtualizacao.senha;
      }
      
      const usuarioAtualizado = await User.findByIdAndUpdate(
        id, 
        { $set: dadosAtualizacao }, 
        { new: true, runValidators: true } 
      ).select('-senha');

      if (usuarioAtualizado) {
        res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado });
      } else {
        res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (erro) {
      if (erro.code === 11000) {
        return res.status(400).json({ message: "Este email já está em uso." });
      }
      res.status(500).json({ message: `Erro ao atualizar: ${erro.message}` });
    }
  };

  static deletarUsuario = async (req, res) => {
    try {
      const id = req.params.id;
      const resultado = await User.findByIdAndDelete(id);

      if (resultado) {
        res.status(200).json({ message: "Usuário deletado com sucesso." });
      } else {
        res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao deletar: ${erro.message}` });
    }
  };
}

export default UserController;