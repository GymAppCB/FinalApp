// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Obter o header Authorization
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Extrair o token corretamente do formato "Bearer token"
    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Remove "Bearer " (7 caracteres)
    } else {
      token = authHeader; // Caso seja enviado só o token
    }
    
    console.log('Token extraído:', token);
    
    // Verificar se o token não está vazio
    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({ message: 'Token inválido ou vazio' });
    }

    // Verificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_temporario');
    console.log('Token decodificado:', decoded);
    
    // Buscar o usuário no banco (opcional para rotas simples)
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   return res.status(401).json({ message: 'Usuário não encontrado' });
    // }

    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    // Diferentes tipos de erro JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token malformado' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    } else {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }
};

module.exports = auth;
