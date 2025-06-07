// server/routes/activities.js
const express = require('express');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const router = express.Router();

// Listar atividades recentes
router.get('/recent', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ trainer: req.userId })
      .populate('client', 'name email')
      .sort({ date: -1 })
      .limit(10);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar atividades', error: error.message });
  }
});

// Obter estatísticas do dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      totalClients,
      activeWorkouts,
      completedToday,
      pendingAssessments
    ] = await Promise.all([
      require('../models/Client').countDocuments({ trainer: req.userId }),
      require('../models/WorkoutPlan').countDocuments({ trainer: req.userId, isActive: true }),
      Activity.countDocuments({ 
        trainer: req.userId, 
        type: 'workout',
        date: { $gte: today }
      }),
      require('../models/Assessment').countDocuments({ 
        trainer: req.userId, 
        status: 'pending' 
      })
    ]);
    
    res.json({
      totalClients,
      activeWorkouts,
      completedToday,
      pendingAssessments
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
});

module.exports = router;
