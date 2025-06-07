// server/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['Masculino', 'Feminino', 'Outro'] },
  healthQuestionnaire: {
    medicalConditions: [String],
    medications: [String],
    injuries: [String],
    fitnessLevel: { type: String, enum: ['Iniciante', 'Intermédio', 'Avançado'] },
    goals: [String]
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastWorkout: Date
});

module.exports = mongoose.model('Client', clientSchema);
