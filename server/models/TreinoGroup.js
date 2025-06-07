// server/models/TreinoGroup.js
const mongoose = require('mongoose');

const treinoGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Cardio'],
    required: true 
  },
  treinos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Treino' }],
  difficulty: { 
    type: String, 
    enum: ['Iniciante', 'Intermédio', 'Avançado'], 
    default: 'Iniciante' 
  },
  estimatedDuration: Number, // minutos totais
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isTemplate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TreinoGroup', treinoGroupSchema);
