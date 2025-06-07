// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration (The Final, Simplified Approach) ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://sensational-kulfi-8b5359.netlify.app'
];

// This is the most standard and reliable way to configure CORS.
// It automatically handles the preflight OPTIONS request.
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// --- Standard Middleware ---
// This MUST come AFTER the cors middleware.
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
// These also MUST come AFTER the cors middleware.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/treinos', require('./routes/treinos'));
app.use('/api/workout-plans', require('./routes/workoutPlans'));

// --- Serve Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Simple Welcome Route for the API root ---
app.get('/', (req, res) => {
  res.send('GymPro API is running.');
});
app.get('/', (req, res) => {
  res.status(200).send('GymPro API is running and healthy.');
});
app.get('/', (req, res) => {
  res.status(200).send('GymPro API is running and healthy.');
});
const HOST = '0.0.0.0'; // This is the critical change
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is now listening on http://${HOST}:${PORT}`);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});