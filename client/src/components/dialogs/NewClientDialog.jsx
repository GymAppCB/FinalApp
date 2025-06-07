import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Divider, InputAdornment, CircularProgress, Slide } from '@mui/material';
import { Close, Person, Email, Phone, Cake, Wc, Speed, PersonAdd } from '@mui/icons-material';
import api from '../../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewClientDialog = ({ open, onClose, onSuccess }) => {
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', healthQuestionnaire: { fitnessLevel: 'Iniciante' } });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleCreateClient = async () => {
    setFormSubmitting(true);
    try {
      await api.post('/clients', newClient);
      setNewClient({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', healthQuestionnaire: { fitnessLevel: 'Iniciante' } });
      onSuccess(); // This will trigger a data refresh in the parent component
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      // Optionally, show an error message to the user
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Novo Cliente
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nome Completo" value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Telefone" value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Data de Nascimento" type="date" InputLabelProps={{ shrink: true }} value={newClient.dateOfBirth} onChange={(e) => setNewClient({...newClient, dateOfBirth: e.target.value})} InputProps={{ startAdornment: <InputAdornment position="start"><Cake /></InputAdornment> }} /></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel id="gender-label">Género</InputLabel><Select labelId="gender-label" label="Género" value={newClient.gender} onChange={(e) => setNewClient({...newClient, gender: e.target.value})} startAdornment={<InputAdornment position="start"><Wc /></InputAdornment>}><MenuItem value="Masculino">Masculino</MenuItem><MenuItem value="Feminino">Feminino</MenuItem><MenuItem value="Outro">Outro</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel id="fitness-level-label">Nível de Fitness</InputLabel><Select labelId="fitness-level-label" label="Nível de Fitness" value={newClient.healthQuestionnaire.fitnessLevel} onChange={(e) => setNewClient({ ...newClient, healthQuestionnaire: { ...newClient.healthQuestionnaire, fitnessLevel: e.target.value }})} startAdornment={<InputAdornment position="start"><Speed /></InputAdornment>}><MenuItem value="Iniciante">Iniciante</MenuItem><MenuItem value="Intermédio">Intermédio</MenuItem><MenuItem value="Avançado">Avançado</MenuItem></Select></FormControl></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={formSubmitting}>Cancelar</Button>
        <Button onClick={handleCreateClient} variant="contained" disabled={formSubmitting} startIcon={formSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}>
          {formSubmitting ? 'Criando...' : 'Criar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewClientDialog;