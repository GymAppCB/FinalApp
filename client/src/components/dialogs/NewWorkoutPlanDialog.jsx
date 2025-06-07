import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Divider, InputAdornment, CircularProgress, Slide } from '@mui/material';
import { Close, Person, Timer, Add } from '@mui/icons-material';
import api from '../../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewWorkoutPlanDialog = ({ open, onClose, onSuccess, clients }) => {
  const [newWorkoutPlan, setNewWorkoutPlan] = useState({ client: '', name: '', description: '', difficulty: 'Iniciante', estimatedDuration: 60, exercises: [] });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleCreate = async () => {
    setFormSubmitting(true);
    try {
      await api.post('/workout-plans', newWorkoutPlan);
      setNewWorkoutPlan({ client: '', name: '', description: '', difficulty: 'Iniciante', estimatedDuration: 60, exercises: [] });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar plano de treino:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Novo Plano de Treino
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="client-select-label">Cliente</InputLabel>
              <Select labelId="client-select-label" label="Cliente" value={newWorkoutPlan.client} onChange={(e) => setNewWorkoutPlan({...newWorkoutPlan, client: e.target.value})} startAdornment={<InputAdornment position="start"><Person /></InputAdornment>}>
                {clients.map((client) => (<MenuItem key={client._id} value={client._id}>{client.name}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nome do Plano" value={newWorkoutPlan.name} onChange={(e) => setNewWorkoutPlan({...newWorkoutPlan, name: e.target.value})} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="difficulty-label">Dificuldade</InputLabel>
              <Select labelId="difficulty-label" label="Dificuldade" value={newWorkoutPlan.difficulty} onChange={(e) => setNewWorkoutPlan({...newWorkoutPlan, difficulty: e.target.value})}>
                <MenuItem value="Iniciante">Iniciante</MenuItem>
                <MenuItem value="Intermédio">Intermédio</MenuItem>
                <MenuItem value="Avançado">Avançado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}><TextField fullWidth label="Descrição" multiline rows={4} value={newWorkoutPlan.description} onChange={(e) => setNewWorkoutPlan({...newWorkoutPlan, description: e.target.value})} /></Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Duração Estimada (minutos)" type="number" value={newWorkoutPlan.estimatedDuration} onChange={(e) => setNewWorkoutPlan({...newWorkoutPlan, estimatedDuration: parseInt(e.target.value)})} InputProps={{ startAdornment: <InputAdornment position="start"><Timer /></InputAdornment> }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={formSubmitting}>Cancelar</Button>
        <Button onClick={handleCreate} variant="contained" disabled={formSubmitting} startIcon={formSubmitting ? <CircularProgress size={20} color="inherit" /> : <Add />}>
          {formSubmitting ? 'Criando...' : 'Criar Plano'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewWorkoutPlanDialog;