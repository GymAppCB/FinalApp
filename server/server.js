// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI environment variable is not set.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---

// THIS IS THE CRITICAL LINE THAT WAS MISSING
app.use('/api/auth', require('./routes/auth'));

// The rest of your routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/treinos', require('./routes/treinos'));
app.use('/api/workout-plans',require('./routes/workoutPlans'));

// --- Serve Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Simple Welcome Route for the API root ---
app.get('/', (req, res) => {
  res.send('GymPro API is running.');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});