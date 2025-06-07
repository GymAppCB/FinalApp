// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // NEW: Required for serving static files
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// Using your database name for consistency
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado com sucesso.'))
.catch(err => console.error('Erro na conexão com MongoDB:', err));

// --- API Routes ---
// These routes are now correctly pointing to the right files and paths
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/treinos', require('./routes/treinos'));

// CORRECTED: This now points to the correct file and URL path for workout plans
app.use('/api/workout-plans', require('./routes/workoutPlans'));

// --- Serve Static Files (for production readiness) ---
// NEW: Serve the 'uploads' folder so images can be accessed by the frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// NEW: Logic to serve the React frontend from the 'build' folder in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handles any requests that don't match the ones above
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`💻 Frontend (dev): http://localhost:3000`);
    console.log(`🔧 API (test): http://localhost:${PORT}/api/test`);
  }
});

// You can keep a test route for quick checks
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando!', timestamp: new Date() });
});