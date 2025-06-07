// server/models/WorkoutExecution.js
const mongoose = require('mongoose');

const workoutExecutionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true },
  exercises: [{
    exerciseId: { type: mongoose.Schema.Types.ObjectId, required: true },
    setsCompleted: [{
      weight: Number,
      reps: Number,
      restTime: Number, // tempo de descanso em segundos
      completedAt: { type: Date, default: Date.now }
    }],
    totalTime: Number, // tempo total do exercício em segundos
    notes: String
  }],
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  totalDuration: Number, // duração total do treino em minutos
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('WorkoutExecution', workoutExecutionSchema);
