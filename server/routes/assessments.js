// server/routes/assessments.js
const express = require('express');
const Assessment = require('../models/Assessment');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/assessments/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Listar avaliações pendentes
router.get('/pending', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ 
      trainer: req.userId, 
      status: 'pending' 
    })
    .populate('client', 'name email')
    .sort({ date: 1 });
    
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
  }
});

// Listar todas as avaliações
router.get('/', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ trainer: req.userId })
    .populate('client', 'name email')
    .sort({ date: -1 });
    
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
  }
});

// Criar nova avaliação
router.post('/', auth, async (req, res) => {
  try {
    const assessmentData = { ...req.body, trainer: req.userId };
    const assessment = new Assessment(assessmentData);
    await assessment.save();
    
    // Registrar atividade
    const activity = new Activity({
      client: assessment.client,
      trainer: req.userId,
      type: 'assessment',
      action: `Nova avaliação física realizada`,
      details: { assessment: assessment._id }
    });
    await activity.save();
    
    const populatedAssessment = await Assessment.findById(assessment._id)
      .populate('client', 'name email');
    
    res.status(201).json(populatedAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar avaliação', error: error.message });
  }
});

// Upload de fotos para avaliação
router.post('/upload-photos', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const photos = req.files.map(file => ({
      url: `/uploads/assessments/${file.filename}`,
      type: req.body.type || 'front'
    }));
    
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ message: 'Erro no upload', error: error.message });
  }
});

module.exports = router;
