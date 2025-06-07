// server/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['workout', 'assessment', 'record', 'registration', 'goal_achieved'],
    required: true 
  },
  action: { type: String, required: true },
  details: {
    workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    exerciseName: String,
    previousRecord: Number,
    newRecord: Number,
    additionalInfo: String
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
