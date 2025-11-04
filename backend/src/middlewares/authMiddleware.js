// Middleware básico de autenticação - será expandido caso haja implementação JWT
export const authMiddleware = async (req, res, next) => {
  // Por enquanto, permite todas as requisições
  next();
};