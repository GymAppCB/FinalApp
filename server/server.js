// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // This loads variables from a .env file for local development

const app = express();
// Render provides the PORT environment variable
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// CRITICAL FIX 1: Use the MONGO_URI from Render's Environment Variables.
// The fallback to localhost is only for when you run it on your own machine.
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI environment variable is not set.");
  process.exit(1); // Exit if the database string is missing
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
// This makes the /uploads folder accessible if you plan to upload images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CRITICAL FIX 2: REMOVE the block that tries to serve the React app.
// Netlify is responsible for serving the frontend, not this server.
/*
  // THIS ENTIRE BLOCK SHOULD BE DELETED
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  }
*/

// --- Simple Welcome Route for the API root ---
app.get('/', (req, res) => {
  res.send('GymPro API is running.');
});

// --- Start Server ---
app.listen(PORT, () => {
  // Render uses port 10000 by default, but this code correctly uses the PORT variable.
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});