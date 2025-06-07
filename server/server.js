// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://sensational-kulfi-8b5359.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allows cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
};

// --- CRITICAL FIX: Handle Preflight Requests ---
// The browser sends an OPTIONS request first for complex requests like POST.
// We need to handle it and send back the correct headers.
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Now, use the CORS middleware for all other requests
app.use(cors(corsOptions));


// --- Standard Middleware ---
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