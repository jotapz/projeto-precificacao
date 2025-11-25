import Admin from "../db/models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/user.js";
import Produto from "../db/models/produto.js";
import MateriaPrima from "../db/models/materiaprima.js";
import Despesa from "../db/models/despesa.js";
import CustoOperacional from "../db/models/custoOperacional.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

class AdminController {
  static login = async (req, res) => {
    try {
      const { matricula, senha } = req.body;
      if (!matricula || !senha) {
        return res.status(400).json({ message: "Matrícula e senha são obrigatórios" });
      }

      const admin = await Admin.findOne({ matricula });
      if (!admin) return res.status(401).json({ message: "Matrícula ou senha incorretos" });

      const ok = await bcrypt.compare(senha, admin.senha);
      if (!ok) return res.status(401).json({ message: "Matrícula ou senha incorretos" });

      const token = jwt.sign({ id: admin._id, matricula: admin.matricula, nome: admin.nome, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
      const adminSafe = admin.toObject(); delete adminSafe.senha;

      res.status(200).json({ message: "Login admin bem-sucedido", admin: adminSafe, token });
    } catch (err) {
      console.error('admin login error', err);
      res.status(500).json({ message: 'Erro no login admin' });
    }
  };

  static createAdmin = async (req, res) => {
    try {
      const { nome, matricula, senha } = req.body;
      if (!nome || !matricula || !senha) return res.status(400).json({ message: 'nome, matricula e senha são obrigatórios' });

      const exists = await Admin.findOne({ matricula });
      if (exists) return res.status(400).json({ message: 'Essa matrícula já está cadastrada' });

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      const novo = new Admin({ nome, matricula, senha: senhaHash });
      const saved = await novo.save();
      const safe = saved.toObject(); delete safe.senha;
      res.status(201).json({ message: 'Administrador criado', admin: safe });
    } catch (err) {
      console.error('createAdmin error', err);
      res.status(500).json({ message: 'Erro ao criar administrador' });
    }
  };

  static listAdmins = async (req, res) => {
    try {
      const admins = await Admin.find().select('-senha');
      res.status(200).json({ value: admins, Count: admins.length });
    } catch (err) {
      console.error('listAdmins error', err);
      res.status(500).json({ message: 'Erro ao listar administradores' });
    }
  };

  static exists = async (req, res) => {
    try {
      const count = await Admin.countDocuments();
      res.status(200).json({ hasAdmins: count > 0, count });
    } catch (err) {
      console.error('exists error', err);
      res.status(500).json({ message: 'Erro ao verificar administradores' });
    }
  };

  static deleteAdmin = async (req, res) => {
    try {
      const id = req.params.id;
      const removed = await Admin.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ message: 'Administrador não encontrado' });
      res.status(200).json({ message: 'Administrador removido' });
    } catch (err) {
      console.error('deleteAdmin error', err);
      res.status(500).json({ message: 'Erro ao deletar administrador' });
    }
  };

  static dashboard = async (req, res) => {
    try {
      const totalUsuarios = await User.countDocuments();
      const totalProdutos = await Produto.countDocuments();
      const totalMaterias = await MateriaPrima.countDocuments();

      const despesas = await Despesa.find();
      const custosOp = await CustoOperacional.find();

      const totalDespesas = despesas.reduce((s, d) => s + (d.valorMensal || 0), 0);
      const totalCustosOp = custosOp.reduce((s, d) => s + (d.valorMensal || 0), 0);

      res.status(200).json({
        totalUsuarios,
        totalProdutos,
        totalMaterias,
        totalDespesas: parseFloat(totalDespesas.toFixed(2)),
        totalCustosOperacionais: parseFloat(totalCustosOp.toFixed(2))
      });
    } catch (err) {
      console.error('dashboard error', err);
      res.status(500).json({ message: 'Erro ao gerar métricas do dashboard' });
    }
  };

  static dashboardPublic = async (req, res) => {
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount > 0) {
        return res.status(403).json({ message: 'Dashboard público disponível apenas quando não existem administradores cadastrados.' });
      }

      const totalUsuarios = await User.countDocuments();
      const totalProdutos = await Produto.countDocuments();
      const totalMaterias = await MateriaPrima.countDocuments();

      const despesas = await Despesa.find();
      const custosOp = await CustoOperacional.find();

      const totalDespesas = despesas.reduce((s, d) => s + (d.valorMensal || 0), 0);
      const totalCustosOp = custosOp.reduce((s, d) => s + (d.valorMensal || 0), 0);

      res.status(200).json({
        totalUsuarios,
        totalProdutos,
        totalMaterias,
        totalDespesas: parseFloat(totalDespesas.toFixed(2)),
        totalCustosOperacionais: parseFloat(totalCustosOp.toFixed(2))
      });
    } catch (err) {
      console.error('dashboardPublic error', err);
      res.status(500).json({ message: 'Erro ao gerar métricas públicas do dashboard' });
    }
  };
}

export default AdminController;
