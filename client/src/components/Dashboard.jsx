// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Paper, LinearProgress, IconButton, Fab, CircularProgress } from '@mui/material';
import { FitnessCenter, People, Schedule, Add, PersonAdd, Assignment, Assessment, EmojiEvents, PlayArrow, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Import the new dialog components
import NewClientDialog from './dialogs/NewClientDialog';
import NewWorkoutPlanDialog from './dialogs/NewWorkoutPlanDialog';
import NewAssessmentDialog from './dialogs/NewAssessmentDialog';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalClients: 0, activeWorkouts: 0, completedToday: 0, pendingAssessments: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // States to control the visibility of each dialog
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openWorkoutPlanModal, setOpenWorkoutPlanModal] = useState(false);
  const [openAssessmentModal, setOpenAssessmentModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes, clientsRes] = await Promise.all([
        api.get('/activities/stats'),
        api.get('/activities/recent'),
        api.get('/clients')
      ]);
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    const icons = { workout: <FitnessCenter />, record: <EmojiEvents />, assessment: <Assessment />, registration: <PersonAdd /> };
    return icons[type] || <Schedule />;
  };

  const getActivityColor = (type) => {
    const colors = { workout: 'success', record: 'warning', assessment: 'info', registration: 'primary' };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" color="primary" sx={{ ml: 2 }}>Carregando dados...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pt: 2, pb: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, border: '1px solid', borderColor: 'primary.main' }}>
              <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>🔥 Bem-vindo, {user?.name}!</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>Pronto para transformar vidas hoje? Você tem {stats.activeWorkouts} planos de treino ativos.</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={(stats.completedToday / 15) * 100} size={120} thickness={4} sx={{ color: 'primary.main', backgroundColor: 'action.hover', borderRadius: '50%' }} />
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">{`${Math.round((stats.completedToday / 15) * 100)}%`}</Typography>
                    <Typography variant="caption" color="text.secondary">Meta Diária</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip icon={<People />} label={`${stats.totalClients} Clientes`} color="primary" variant="outlined" />
                <Chip icon={<FitnessCenter />} label={`${stats.completedToday} Treinos Hoje`} color="success" variant="outlined" />
                <Chip icon={<Assessment />} label={`${stats.pendingAssessments} Avaliações Pendentes`} color="warning" variant="outlined" />
              </Box>
            </Paper>
          </Box>

          {/* Stats Cards Principais */}
          <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f00 100%)', color: 'white', height: '100%', textAlign: 'center' }}><CardContent sx={{ py: 3 }}><People sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} /><Typography variant="h3" fontWeight="bold" gutterBottom>{stats.totalClients}</Typography><Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>Total de Clientes</Typography><Button variant="contained" color="secondary" size="small" onClick={() => navigate('/clients')} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>Ver Todos</Button></CardContent></Card></Grid>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white', height: '100%', textAlign: 'center' }}><CardContent sx={{ py: 3 }}><Assignment sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} /><Typography variant="h3" fontWeight="bold" gutterBottom>{stats.activeWorkouts}</Typography><Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>Planos Ativos</Typography><Button variant="contained" color="secondary" size="small" onClick={() => setOpenWorkoutPlanModal(true)} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>Criar Novo</Button></CardContent></Card></Grid>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white', height: '100%', textAlign: 'center' }}><CardContent sx={{ py: 3 }}><EmojiEvents sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} /><Typography variant="h3" fontWeight="bold" gutterBottom>{stats.completedToday}</Typography><Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>Concluídos Hoje</Typography><Button variant="contained" color="secondary" size="small" onClick={() => navigate('/workout-plans')} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>Ver Detalhes</Button></CardContent></Card></Grid>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white', height: '100%', textAlign: 'center' }}><CardContent sx={{ py: 3 }}><Assessment sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} /><Typography variant="h3" fontWeight="bold" gutterBottom>{stats.pendingAssessments}</Typography><Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>Avaliações Pendentes</Typography><Button variant="contained" color="secondary" size="small" onClick={() => setOpenAssessmentModal(true)} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>Agendar</Button></CardContent></Card></Grid>
          </Grid>

          {/* Seção Principal */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}><Paper sx={{ p: 3, height: '100%' }}><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}><Typography variant="h5" fontWeight="bold" color="primary">🔥 Atividade em Tempo Real</Typography><IconButton color="primary"><MoreVert /></IconButton></Box><List>{recentActivities.map((activity) => (<ListItem key={activity._id} sx={{ px: 0 }}><ListItemAvatar><Avatar sx={{ bgcolor: 'primary.main' }}>{activity.client?.name?.charAt(0).toUpperCase() || 'U'}</Avatar></ListItemAvatar><ListItemText primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="subtitle1" fontWeight="bold">{activity.client?.name || 'Cliente'}</Typography><Chip icon={getActivityIcon(activity.type)} label={activity.type} size="small" color={getActivityColor(activity.type)} variant="outlined" /></Box>} secondary={<Box><Typography variant="body2">{activity.action}</Typography><Typography variant="caption" color="text.secondary">{new Date(activity.date).toLocaleString('pt-PT')}</Typography></Box>} /><IconButton color="primary"><PlayArrow /></IconButton></ListItem>))}{recentActivities.length === 0 && (<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Nenhuma atividade recente</Typography>)}</List></Paper></Grid>
            <Grid item xs={12} lg={4}><Paper sx={{ p: 3, height: '100%' }}><Typography variant="h5" fontWeight="bold" gutterBottom color="primary">⚡ Ações Rápidas</Typography><Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}><Button variant="contained" size="large" startIcon={<PersonAdd />} onClick={() => setOpenClientModal(true)} sx={{ py: 2, background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f00 100%)' }}>Adicionar Cliente</Button><Button variant="contained" size="large" startIcon={<Assignment />} onClick={() => setOpenWorkoutPlanModal(true)} sx={{ py: 2, background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' }}>Criar Plano de Treino</Button><Button variant="contained" size="large" startIcon={<Assessment />} onClick={() => setOpenAssessmentModal(true)} sx={{ py: 2, background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }}>Nova Avaliação Física</Button><Button variant="outlined" size="large" startIcon={<Schedule />} onClick={() => navigate('/classes')} sx={{ py: 2, borderColor: 'primary.main', color: 'primary.main' }}>Agendar Aula</Button></Box><Box sx={{ mt: 4 }}><Typography variant="h6" gutterBottom color="primary">Progresso de Hoje</Typography><Box sx={{ mb: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2" color="text.secondary">Treinos Concluídos</Typography><Typography variant="body2" color="primary">{stats.completedToday}/15</Typography></Box><LinearProgress variant="determinate" value={(stats.completedToday / 15) * 100} sx={{ height: 8, borderRadius: 4, backgroundColor: 'action.hover', '& .MuiLinearProgress-bar': { backgroundColor: 'primary.main' } }} /></Box><Box sx={{ mb: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2" color="text.secondary">Clientes Atendidos</Typography><Typography variant="body2" color="success.main">{Math.min(stats.totalClients, 20)}/20</Typography></Box><LinearProgress variant="determinate" value={(Math.min(stats.totalClients, 20) / 20) * 100} color="success" sx={{ height: 8, borderRadius: 4 }} /></Box></Box></Paper></Grid>
          </Grid>

          <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => setOpenClientModal(true)}>
            <Add />
          </Fab>
        </Container>
      </Box>

      {/* Render the dialog components */}
      <NewClientDialog
        open={openClientModal}
        onClose={() => setOpenClientModal(false)}
        onSuccess={fetchDashboardData}
      />

      <NewWorkoutPlanDialog
        open={openWorkoutPlanModal}
        onClose={() => setOpenWorkoutPlanModal(false)}
        onSuccess={fetchDashboardData}
        clients={clients}
      />

      <NewAssessmentDialog
        open={openAssessmentModal}
        onClose={() => setOpenAssessmentModal(false)}
        onSuccess={fetchDashboardData}
        clients={clients}
      />
    </>
  );
};

export default Dashboard;