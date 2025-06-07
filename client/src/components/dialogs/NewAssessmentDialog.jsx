import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Divider, InputAdornment, CircularProgress, Slide, Stepper, Step, StepLabel } from '@mui/material';
import { Close, Person, NavigateNext, NavigateBefore, Assessment, MonitorWeight, Height, Percent, Straighten, FitnessCenter } from '@mui/icons-material';
import api from '../../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewAssessmentDialog = ({ open, onClose, onSuccess, clients }) => {
  const [newAssessment, setNewAssessment] = useState({ client: '', measurements: { weight: '', height: '', bodyFat: '', muscleMass: '', chest: '', waist: '', hip: '', arm: '', thigh: '', neck: '' }, notes: '', status: 'completed' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const assessmentSteps = ['Selecionar Cliente', 'Métricas Corporais', 'Medidas e Notas'];

  const handleCreate = async () => {
    setFormSubmitting(true);
    try {
      await api.post('/assessments', newAssessment);
      setNewAssessment({ client: '', measurements: { weight: '', height: '', bodyFat: '', muscleMass: '', chest: '', waist: '', hip: '', arm: '', thigh: '', neck: '' }, notes: '', status: 'completed' });
      setActiveStep(0);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleNextStep = () => setActiveStep((prev) => prev + 1);
  const handleBackStep = () => setActiveStep((prev) => prev - 1);
  const handleCloseDialog = () => {
    setActiveStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} TransitionComponent={Transition} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Nova Avaliação Física
          <IconButton onClick={handleCloseDialog}><Close /></IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {assessmentSteps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
        <Box sx={{ minHeight: 300, p: 2 }}>
          {activeStep === 0 && (
            <FormControl fullWidth>
              <InputLabel id="assessment-client-label">Cliente</InputLabel>
              <Select labelId="assessment-client-label" label="Cliente" value={newAssessment.client} onChange={(e) => setNewAssessment({...newAssessment, client: e.target.value})} startAdornment={<InputAdornment position="start"><Person /></InputAdornment>}>
                {clients.map((client) => (<MenuItem key={client._id} value={client._id}>{client.name}</MenuItem>))}
              </Select>
            </FormControl>
          )}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Peso (kg)" type="number" value={newAssessment.measurements.weight} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, weight: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><MonitorWeight /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Altura (cm)" type="number" value={newAssessment.measurements.height} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, height: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Height /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="% Gordura Corporal" type="number" value={newAssessment.measurements.bodyFat} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, bodyFat: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Percent /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Massa Muscular (kg)" type="number" value={newAssessment.measurements.muscleMass} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, muscleMass: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><FitnessCenter /></InputAdornment> }} /></Grid>
            </Grid>
          )}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Peito (cm)" type="number" value={newAssessment.measurements.chest} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, chest: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Straighten /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Cintura (cm)" type="number" value={newAssessment.measurements.waist} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, waist: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Straighten /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Anca (cm)" type="number" value={newAssessment.measurements.hip} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, hip: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Straighten /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Braço (cm)" type="number" value={newAssessment.measurements.arm} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, arm: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Straighten /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Perna (cm)" type="number" value={newAssessment.measurements.thigh} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, thigh: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Straighten /></InputAdornment> }} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Pescoço (cm)" type="number" value={newAssessment.measurements.neck} onChange={(e) => setNewAssessment({ ...newAssessment, measurements: { ...newAssessment.measurements, neck: e.target.value }})} InputProps={{ startAdornment: <InputAdornment position="start"><Straighten /></InputAdornment> }} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Observações" multiline rows={3} value={newAssessment.notes} onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})} /></Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseDialog} disabled={formSubmitting}>Cancelar</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleBackStep} disabled={activeStep === 0 || formSubmitting} startIcon={<NavigateBefore />}>Voltar</Button>
        {activeStep === assessmentSteps.length - 1 ? (
          <Button onClick={handleCreate} variant="contained" disabled={formSubmitting} startIcon={formSubmitting ? <CircularProgress size={20} color="inherit" /> : <Assessment />}>
            {formSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
          </Button>
        ) : (
          <Button onClick={handleNextStep} variant="contained" endIcon={<NavigateNext />}>Próximo</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewAssessmentDialog;