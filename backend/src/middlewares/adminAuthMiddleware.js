import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token ausente ou formato inválido' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado: requer privilégios de administrador' });
    }

    // attach admin info if needed
    req.admin = { id: payload.id, matricula: payload.matricula, nome: payload.nome };
    next();
  } catch (err) {
    console.error('adminAuth error:', err.message);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
