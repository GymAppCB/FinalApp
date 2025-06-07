import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions, Chip, TextField, InputAdornment, CircularProgress, Skeleton } from '@mui/material';
import { Add, FitnessCenter, Person, Timer, Search } from '@mui/icons-material';
import api from '../services/api';
import NewWorkoutPlanDialog from '../components/dialogs/NewWorkoutPlanDialog';

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansRes, clientsRes] = await Promise.all([
        api.get('/workout-plans'),
        api.get('/clients')
      ]);
      setPlans(plansRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDifficultyColor = (difficulty) => {
    const colors = { 'Iniciante': 'success', 'Intermédio': 'warning', 'Avançado': 'error' };
    return colors[difficulty] || 'default';
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">Planos de Treino</Typography>
          <Typography color="text.secondary">Gerencie os planos de treino dos seus clientes.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
          Criar Novo Plano
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Pesquisar por plano ou cliente..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
        }}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {filteredPlans.map(plan => (
            <Grid item xs={12} md={6} lg={4} key={plan._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>{plan.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
                    <Person sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">{plan.client?.name || 'Cliente não encontrado'}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>{plan.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={plan.difficulty} color={getDifficultyColor(plan.difficulty)} size="small" />
                    <Chip icon={<Timer />} label={`${plan.estimatedDuration} min`} size="small" variant="outlined" />
                    <Chip icon={<FitnessCenter />} label={`${plan.exercises.length} exercícios`} size="small" variant="outlined" />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">Ver Detalhes</Button>
                  <Button size="small">Editar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <NewWorkoutPlanDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchData}
        clients={clients}
      />
    </Container>
  );
};

export default WorkoutPlans;