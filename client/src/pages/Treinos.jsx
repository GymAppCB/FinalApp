// client/src/pages/Treinos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper,
  Slide,
  Zoom,
  CircularProgress
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Timer,
  LocalFireDepartment,
  FitnessCenter,
  Visibility,
  Edit,
  Delete,
  Close,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';
import api from '../services/api';

const STATIC_STYLES = {
  textFieldBase: { '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(255, 107, 53, 0.05)', '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 } }, '& .MuiInputLabel-root': { fontWeight: 600, '&.Mui-focused': { color: 'primary.main' } } },
  cardHover: { height: '100%', backgroundColor: 'background.paper', border: '1px solid rgba(255, 107, 53, 0.2)', borderRadius: 3, transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(255, 107, 53, 0.3)', borderColor: 'primary.main' } },
  gradientButton: { background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f00 100%)', '&:hover': { background: 'linear-gradient(135deg, #e55a2b 0%, #e67e00 100%)' } }
};

const CATEGORIES = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Cardio', 'Funcional', 'Core'];
const DIFFICULTIES = ['Iniciante', 'Intermédio', 'Avançado'];
const STEPS = ['Informações Básicas', 'Configurações', 'Mídia'];
const INITIAL_TREINO = { name: '', description: '', category: '', difficulty: 'Iniciante', imageUrl: '', videoUrl: '', duration: 30, calories: 200, defaultSets: 3, defaultReps: '12', defaultWeight: 0, defaultRestTime: 60 };

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FastTextField = React.memo(({ value, onChange, field, ...props }) => {
  const handleChange = useCallback((e) => {
    const newValue = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    onChange(field, newValue);
  }, [onChange, field]);
  return <TextField value={value} onChange={handleChange} sx={STATIC_STYLES.textFieldBase} {...props} />;
});

const FastSelect = React.memo(({ value, onChange, field, children, ...props }) => {
  const handleChange = useCallback((e) => { onChange(field, e.target.value); }, [onChange, field]);
  return <FormControl sx={STATIC_STYLES.textFieldBase} {...props}><InputLabel>{props.label}</InputLabel><Select value={value} onChange={handleChange} label={props.label}>{children}</Select></FormControl>;
});

const Treinos = () => {
  const [tabValue, setTabValue] = useState(0);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTreinoModal, setOpenTreinoModal] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newTreino, setNewTreino] = useState(INITIAL_TREINO);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const treinosRes = await api.get('/treinos');
      setTreinos(treinosRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFieldChange = useCallback((field, value) => { setNewTreino(prev => ({ ...prev, [field]: value })); }, []);

  const handleCreateTreino = useCallback(async () => {
    try {
      if (isEditing) { await api.put(`/treinos/${newTreino._id}`, newTreino); } else { await api.post('/treinos', newTreino); }
      setOpenTreinoModal(false);
      setNewTreino(INITIAL_TREINO);
      setActiveStep(0);
      setIsEditing(false);
      fetchData();
    } catch (error) { console.error('Erro ao salvar treino:', error); }
  }, [isEditing, newTreino, fetchData]);

  const handleEditTreino = useCallback((treino) => { setNewTreino(treino); setIsEditing(true); setOpenTreinoModal(true); }, []);
  const handleViewTreino = useCallback((treino) => { setSelectedTreino(treino); setOpenViewModal(true); }, []);

  const handleDeleteTreino = useCallback(async (treinoId) => {
    if (window.confirm('Tem certeza que deseja deletar este treino?')) {
      try {
        await api.delete(`/treinos/${treinoId}`);
        fetchData();
        alert('Treino deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar treino:', error);
        alert('Erro ao deletar treino. Tente novamente.');
      }
    }
  }, [fetchData]);

  const getDifficultyColor = useCallback((difficulty) => {
    const colors = { 'Iniciante': 'success', 'Intermédio': 'warning', 'Avançado': 'error' };
    return colors[difficulty] || 'default';
  }, []);

  const getYouTubeEmbedUrl = useCallback((url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  }, []);

  const handleNext = useCallback(() => setActiveStep(prev => prev + 1), []);
  const handleBack = useCallback(() => setActiveStep(prev => prev - 1), []);
  const handleOpenNewTreino = useCallback(() => { setIsEditing(false); setNewTreino(INITIAL_TREINO); setActiveStep(0); setOpenTreinoModal(true); }, []);
  const handleCloseModal = useCallback(() => { setOpenTreinoModal(false); setNewTreino(INITIAL_TREINO); setActiveStep(0); setIsEditing(false); }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const TreinoCard = React.memo(({ treino, onView, onEdit, onDelete, getDifficultyColor }) => (
    <Zoom in timeout={300}>
      <Card sx={STATIC_STYLES.cardHover}>
        <CardMedia component="img" height="200" image={treino.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'} alt={treino.name} sx={{ objectFit: 'cover' }} />
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">{treino.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>{treino.description}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}><Chip label={treino.category} color="primary" size="small" /><Chip label={treino.difficulty} color={getDifficultyColor(treino.difficulty)} size="small" /></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Timer sx={{ fontSize: 16, color: 'primary.main' }} /><Typography variant="caption" fontWeight="bold">{treino.duration}min</Typography></Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocalFireDepartment sx={{ fontSize: 16, color: 'warning.main' }} /><Typography variant="caption" fontWeight="bold">{treino.calories}cal</Typography></Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FitnessCenter sx={{ fontSize: 16, color: 'success.main' }} /><Typography variant="caption" fontWeight="bold">{treino.defaultSets}x{treino.defaultReps}</Typography></Box></Box>
          <Box sx={{ display: 'flex', gap: 1 }}><Button variant="contained" size="small" startIcon={<Visibility />} onClick={() => onView(treino)} sx={{ flex: 1, ...STATIC_STYLES.gradientButton }}>Ver</Button><IconButton color="primary" size="small" onClick={() => onEdit(treino)} sx={{ border: '1px solid', borderColor: 'primary.main', '&:hover': { backgroundColor: 'primary.main', color: 'white' } }}><Edit /></IconButton><IconButton color="error" size="small" onClick={() => onDelete(treino._id)} sx={{ border: '1px solid', borderColor: 'error.main', '&:hover': { backgroundColor: 'error.main', color: 'white' } }}><Delete /></IconButton></Box>
        </CardContent>
      </Card>
    </Zoom>
  ));

  const stepContent = useMemo(() => {
    switch (activeStep) {
      case 0: return <Box sx={{ py: 2 }}><Grid container spacing={4}><Grid item xs={12}><FastTextField fullWidth label="Nome do Treino" value={newTreino.name} onChange={handleFieldChange} field="name" placeholder="Ex: Supino Inclinado, Agachamento, etc." /></Grid><Grid item xs={12} sm={6}><FastSelect fullWidth label="Categoria" value={newTreino.category} onChange={handleFieldChange} field="category">{CATEGORIES.map((cat) => (<MenuItem key={cat} value={cat}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FitnessCenter sx={{ fontSize: 18, color: 'primary.main' }} />{cat}</Box></MenuItem>))}</FastSelect></Grid><Grid item xs={12} sm={6}><FastSelect fullWidth label="Dificuldade" value={newTreino.difficulty} onChange={handleFieldChange} field="difficulty">{DIFFICULTIES.map((diff) => (<MenuItem key={diff} value={diff}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Chip label={diff} size="small" color={getDifficultyColor(diff)} sx={{ minWidth: 80 }} /></Box></MenuItem>))}</FastSelect></Grid><Grid item xs={12}><FastTextField fullWidth label="Descrição do Treino" multiline rows={4} value={newTreino.description} onChange={handleFieldChange} field="description" placeholder="Descreva como executar o exercício, músculos trabalhados, dicas importantes..." /></Grid></Grid></Box>;
      case 1: return <Box sx={{ py: 2 }}><Grid container spacing={3}><Grid item xs={12} sm={4}><FastTextField fullWidth label="Duração (min)" type="number" value={newTreino.duration} onChange={handleFieldChange} field="duration" /></Grid><Grid item xs={12} sm={4}><FastTextField fullWidth label="Calorias" type="number" value={newTreino.calories} onChange={handleFieldChange} field="calories" /></Grid><Grid item xs={12} sm={4}><FastTextField fullWidth label="Tempo de Descanso (s)" type="number" value={newTreino.defaultRestTime} onChange={handleFieldChange} field="defaultRestTime" /></Grid><Grid item xs={12} sm={4}><FastTextField fullWidth label="Séries Padrão" type="number" value={newTreino.defaultSets} onChange={handleFieldChange} field="defaultSets" /></Grid><Grid item xs={12} sm={4}><FastTextField fullWidth label="Repetições Padrão" value={newTreino.defaultReps} onChange={handleFieldChange} field="defaultReps" placeholder="ex: 12 ou 10-15" /></Grid><Grid item xs={12} sm={4}><FastTextField fullWidth label="Peso Padrão (kg)" type="number" value={newTreino.defaultWeight} onChange={handleFieldChange} field="defaultWeight" /></Grid></Grid></Box>;
      case 2: return <Box sx={{ py: 2 }}><Grid container spacing={3}><Grid item xs={12} sm={6}><FastTextField fullWidth label="URL da Imagem" value={newTreino.imageUrl} onChange={handleFieldChange} field="imageUrl" placeholder="https://exemplo.com/imagem.jpg" /></Grid><Grid item xs={12} sm={6}><FastTextField fullWidth label="URL do Vídeo (YouTube)" value={newTreino.videoUrl} onChange={handleFieldChange} field="videoUrl" placeholder="https://www.youtube.com/watch?v=..." /></Grid></Grid></Box>;
      default: return null;
    }
  }, [activeStep, newTreino, handleFieldChange, getDifficultyColor]);

  if (loading) {
    return <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box sx={{ textAlign: 'center' }}><CircularProgress size={64} /><Typography variant="h6" color="primary" sx={{ mt: 2 }}>Carregando biblioteca...</Typography></Box></Box>;
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pt: 2, pb: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 4 }}><Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>🏋️ Biblioteca de Exercícios</Typography><Typography variant="h6" color="text.secondary">Gerencie exercícios individuais para montar seus planos de treino</Typography></Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}><Paper sx={{ borderRadius: 3, p: 1, backgroundColor: 'background.paper' }}><Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}><Tab label="Exercícios Individuais" /><Tab label="Grupos de Treinos" disabled /></Tabs></Paper></Box>
        <Box sx={{ minHeight: '60vh' }}>
          {tabValue === 0 && (
            <>
              {treinos.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed', borderColor: 'primary.main', backgroundColor: 'rgba(255, 107, 53, 0.05)' }}><FitnessCenter sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} /><Typography variant="h4" color="primary" gutterBottom fontWeight="bold">Nenhum exercício encontrado</Typography><Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>Comece criando seu primeiro exercício para a biblioteca. Adicione imagens e vídeos explicativos!</Typography><Button variant="contained" size="large" startIcon={<Add />} onClick={handleOpenNewTreino} sx={{ py: 2, px: 4, borderRadius: 3, ...STATIC_STYLES.gradientButton }}>Criar Primeiro Exercício</Button></Paper></Box>
              ) : (
                <Grid container spacing={3} justifyContent="center">{treinos.map((treino) => (<Grid item xs={12} sm={6} md={4} lg={3} key={treino._id}><TreinoCard treino={treino} onView={handleViewTreino} onEdit={handleEditTreino} onDelete={handleDeleteTreino} getDifficultyColor={getDifficultyColor} /></Grid>))}</Grid>
              )}
            </>
          )}
        </Box>

        <Dialog open={openTreinoModal} onClose={handleCloseModal} maxWidth="md" fullWidth TransitionComponent={Transition}>
          <DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h5" fontWeight="bold" color="primary">{isEditing ? 'Editar Exercício' : 'Criar Novo Exercício'}</Typography><IconButton onClick={handleCloseModal}><Close /></IconButton></Box></DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}><Stepper activeStep={activeStep} sx={{ mb: 4 }}>{STEPS.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}</Stepper><Box sx={{ minHeight: 400 }}>{stepContent}</Box></DialogContent>
          <Divider />
          <DialogActions sx={{ p: 3, gap: 2 }}><Button onClick={handleCloseModal}>Cancelar</Button><Box sx={{ flex: 1 }} />{activeStep > 0 && (<Button onClick={handleBack} startIcon={<NavigateBefore />}>Voltar</Button>)}{activeStep < STEPS.length - 1 ? (<Button onClick={handleNext} variant="contained" endIcon={<NavigateNext />}>Próximo</Button>) : (<Button onClick={handleCreateTreino} variant="contained" startIcon={<Add />}>{isEditing ? 'Atualizar Exercício' : 'Criar Exercício'}</Button>)}</DialogActions>
        </Dialog>

        <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="lg" fullWidth>
          {selectedTreino && (<><DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h5" fontWeight="bold" color="primary">{selectedTreino.name}</Typography><IconButton onClick={() => setOpenViewModal(false)}><Close /></IconButton></Box></DialogTitle><DialogContent sx={{ py: 3 }}>{selectedTreino.imageUrl && (<Box sx={{ mb: 3 }}><img src={selectedTreino.imageUrl} alt={selectedTreino.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} /></Box>)}<Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{selectedTreino.description}</Typography><Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}><Chip label={selectedTreino.category} color="primary" sx={{ fontWeight: 600 }} /><Chip label={selectedTreino.difficulty} color={getDifficultyColor(selectedTreino.difficulty)} sx={{ fontWeight: 600 }} /><Chip label={`${selectedTreino.duration}min`} color="info" icon={<Timer />} sx={{ fontWeight: 600 }} /><Chip label={`${selectedTreino.calories}cal`} color="warning" icon={<LocalFireDepartment />} sx={{ fontWeight: 600 }} /></Box>{selectedTreino.videoUrl && getYouTubeEmbedUrl(selectedTreino.videoUrl) && (<Box sx={{ mb: 3 }}><Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PlayArrow /> Vídeo Demonstrativo</Typography><Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}><Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, backgroundColor: '#000' }}><iframe src={getYouTubeEmbedUrl(selectedTreino.videoUrl)} title={selectedTreino.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen /></Box></Paper></Box>)}</DialogContent><DialogActions sx={{ p: 3, gap: 2 }}><Button onClick={() => setOpenViewModal(false)}>Fechar</Button><Button variant="contained" startIcon={<Add />}>Adicionar ao Plano</Button><Button variant="outlined" startIcon={<Edit />} onClick={() => { setOpenViewModal(false); handleEditTreino(selectedTreino); }}>Editar</Button></DialogActions></>)}
        </Dialog>

        <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24, ...STATIC_STYLES.gradientButton }} onClick={handleOpenNewTreino}><Add /></Fab>
      </Container>
    </Box>
  );
};

export default Treinos;