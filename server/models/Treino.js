// server/models/Treino.js
const mongoose = require('mongoose');

const treinoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Cardio', 'Funcional', 'Core'],
    required: true 
  },
  muscleGroups: [String], // ['Peitoral', 'Tríceps', 'Deltoides']
  difficulty: { 
    type: String, 
    enum: ['Iniciante', 'Intermédio', 'Avançado'], 
    default: 'Iniciante' 
  },
  equipment: [String], // ['Halteres', 'Barra', 'Máquina']
  instructions: [String], // Array de passos
  tips: [String], // Dicas importantes
  imageUrl: String,
  videoUrl: String,
  duration: Number, // minutos estimados
  calories: Number, // calorias estimadas
  defaultSets: Number,
  defaultReps: String, // "12-15" ou "12"
  defaultWeight: Number,
  defaultRestTime: Number, // segundos
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: false }, // Se outros treinadores podem usar
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Treino', treinoSchema);
