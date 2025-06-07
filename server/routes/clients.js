// server/routes/clients.js
const express = require('express');
const Client = require('../models/Client');
const auth = require('../middleware/auth');
const router = express.Router();

// Listar todos os clientes do treinador
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find({ trainer: req.userId })
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
  }
});

// Criar novo cliente
router.post('/', auth, async (req, res) => {
  try {
    const clientData = { ...req.body, trainer: req.userId };
    const client = new Client(clientData);
    await client.save();
    
    const populatedClient = await Client.findById(client._id).populate('trainer', 'name email');
    res.status(201).json(populatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
});

// Obter cliente específico
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id, 
      trainer: req.userId 
    }).populate('trainer', 'name email');
    
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
});

// Atualizar cliente
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, trainer: req.userId },
      req.body,
      { new: true }
    ).populate('trainer', 'name email');
    
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

// Deletar cliente
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      trainer: req.userId 
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover cliente', error: error.message });
  }
});

module.exports = router;
