// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log('Tentativa de login:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password são obrigatórios' });
    }
    
    // Buscar utilizador na base de dados
    const user = await User.findOne({ email });
    console.log('Utilizador encontrado:', user ? 'Sim' : 'Não');
    
    if (!user) {
      return res.status(401).json({ message: 'Email não encontrado' });
    }

    // Verificar password (aceitar "123456" para teste)
    let isValidPassword = false;
    if (password === '123456') {
      isValidPassword = true;
    } else if (user.password) {
      isValidPassword = await bcrypt.compare(password, user.password);
    }
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Password incorreta' });
    }

    // IMPORTANTE: Gerar JWT real
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'trainer'
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_temporario',
      { expiresIn: '7d' }
    );
    
    console.log('JWT gerado:', token);
    console.log('Payload:', payload);
    
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'trainer'
    };
    
    res.json({ 
      token, 
      user: userData,
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

module.exports = router;
