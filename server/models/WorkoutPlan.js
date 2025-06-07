// server/models/WorkoutPlan.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: String, // "12-15" ou "12"
  weight: Number,
  restTime: Number, // segundos
  notes: String,
  videoUrl: String,
  imageUrl: String,
  personalBest: {
    weight: Number,
    reps: Number,
    date: { type: Date, default: Date.now }
  }
});

const workoutPlanSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  name: { type: String, required: true },
  description: String,
  exercises: [exerciseSchema],
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  difficulty: { type: String, enum: ['Iniciante', 'Intermédio', 'Avançado'], default: 'Iniciante' },
  estimatedDuration: Number, // minutos
  createdAt: { type: Date, default: Date.now },
  lastExecuted: Date
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
