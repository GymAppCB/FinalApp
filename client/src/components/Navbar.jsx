// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge
} from '@mui/material';
import {
  FitnessCenter,
  Dashboard as DashboardIcon,
  People,
  Assignment,
  Assessment,
  Notifications,
  AccountCircle,
  Settings,
  ExitToApp,
  SportsGymnastics
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <FitnessCenter sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            GymPro
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button color="primary" startIcon={<DashboardIcon />} onClick={() => navigate('/')}>Dashboard</Button>
          <Button color="primary" startIcon={<People />} onClick={() => navigate('/clientes')}>Clientes</Button>
          <Button color="primary" startIcon={<SportsGymnastics />} onClick={() => navigate('/treinos')}>Exercícios</Button>
          <Button color="primary" startIcon={<Assignment />} onClick={() => navigate('/workout-plans')}>Planos de Treino</Button>
          <Button color="primary" startIcon={<Assessment />} onClick={() => navigate('/assessments')}>Avaliações</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="primary">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="primary"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <AccountCircle sx={{ mr: 1 }} /> Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
              <Settings sx={{ mr: 1 }} /> Configurações
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;