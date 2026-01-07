import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

/**
 * Middleware para proteger rotas
 * Verifica se o usuário está autenticado
 */
export const protect = async (req, res, next) => {
  let token;

  // Verificar se o token está no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrair token
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário e adicionar ao req
      req.user = await Usuario.findById(decoded.id).select('-senha');

      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      if (!req.user.ativo) {
        return res.status(401).json({ message: 'Usuário inativo' });
      }

      next();
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Sem autorização, token não fornecido' });
  }
};

/**
 * Middleware para verificar se o usuário é admin (barbeiro)
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.tipo === 'barbeiro') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
};
