// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // We still need the package, but will use it differently
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CRITICAL FIX: Manual CORS Middleware ---
// This custom middleware will be the very first thing to run for any request.
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://sensational-kulfi-8b5359.netlify.app'
  ];
  const origin = req.headers.origin;

  // Check if the request origin is in our allowlist
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Set other necessary CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // If this is a preflight (OPTIONS) request, end the request here with a 204 No Content status.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  // Otherwise, continue to the next middleware/route handler.
  next();
});


// --- Standard Middleware ---
// We no longer need app.use(cors()) here because we are handling it manually above.
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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});