// server/routes/treinos.js
const express = require('express');
const Treino = require('../models/Treino');
const TreinoGroup = require('../models/TreinoGroup');
const auth = require('../middleware/auth');
const router = express.Router();

// Listar todos os treinos
router.get('/', auth, async (req, res) => {
  try {
    const treinos = await Treino.find({
      $or: [
        { trainer: req.userId },
        { isPublic: true }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar treinos', error: error.message });
  }
});

// Criar novo treino
router.post('/', auth, async (req, res) => {
  try {
    const treinoData = { ...req.body, trainer: req.userId };
    const treino = new Treino(treinoData);
    await treino.save();
    
    res.status(201).json(treino);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar treino', error: error.message });
  }
});

// NOVA ROTA: Obter treino específico
router.get('/:id', auth, async (req, res) => {
  try {
    const treino = await Treino.findOne({
      _id: req.params.id,
      $or: [
        { trainer: req.userId },
        { isPublic: true }
      ]
    });
    
    if (!treino) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }
    
    res.json(treino);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar treino', error: error.message });
  }
});

// NOVA ROTA: Atualizar treino (PUT)
router.put('/:id', auth, async (req, res) => {
  try {
    const treino = await Treino.findOneAndUpdate(
      { 
        _id: req.params.id, 
        trainer: req.userId 
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!treino) {
      return res.status(404).json({ message: 'Treino não encontrado ou sem permissão' });
    }
    
    res.json(treino);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar treino', error: error.message });
  }
});

// NOVA ROTA: Deletar treino (DELETE)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Tentando deletar treino ID:', req.params.id);
    console.log('Usuário:', req.userId);
    
    const treino = await Treino.findOneAndDelete({
      _id: req.params.id,
      trainer: req.userId
    });
    
    if (!treino) {
      console.log('Treino não encontrado ou sem permissão');
      return res.status(404).json({ message: 'Treino não encontrado ou sem permissão para deletar' });
    }
    
    console.log('Treino deletado com sucesso:', treino.name);
    res.json({ 
      message: 'Treino deletado com sucesso',
      deletedTreino: {
        id: treino._id,
        name: treino.name
      }
    });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({ message: 'Erro ao deletar treino', error: error.message });
  }
});

module.exports = router;
