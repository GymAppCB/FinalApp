// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Import Components and Pages
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clients from './pages/Clients';
import Treinos from './pages/Treinos';
import WorkoutPlans from './pages/WorkoutPlans';
import Assessments from './pages/Assessments';

// Define a custom theme for the application
const theme = createTheme({
  palette: {
    mode: 'dark', // Using a dark theme as seen in the screenshots
    primary: {
      main: '#ff6b35', // A vibrant orange
    },
    secondary: {
      main: '#f7b801',
    },
    background: {
      default: '#202020', // Dark background
      paper: '#2b2b2b',   // Slightly lighter for cards and surfaces
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// A wrapper component to handle navigation after login/logout
const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/treinos" element={<Treinos />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/assessments" element={<Assessments />} />
            {/* Redirect any other path to dashboard if logged in */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {/* Redirect any other path to login if not logged in */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
};

// The main App component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppWrapper />
      </Router>
    </ThemeProvider>
  );
}

export default App;