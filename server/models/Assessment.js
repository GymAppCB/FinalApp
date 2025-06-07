// server/models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  measurements: {
    weight: Number,
    height: Number,
    bodyFat: Number,
    muscleMass: Number,
    chest: Number,
    waist: Number,
    hip: Number,
    arm: Number,
    thigh: Number,
    neck: Number
  },
  photos: [{
    url: String,
    type: { type: String, enum: ['front', 'side', 'back'] },
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: String,
  goals: [String],
  status: { type: String, enum: ['pending', 'completed', 'scheduled'], default: 'completed' },
  nextAssessment: Date
});

module.exports = mongoose.model('Assessment', assessmentSchema);
