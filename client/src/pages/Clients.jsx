// client/src/pages/Clients.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  TablePagination
} from '@mui/material';
import { Add, Edit, Delete, Close, People } from '@mui/icons-material';
import api from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    healthQuestionnaire: {
      fitnessLevel: 'Iniciante',
    }
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (err) {
      setError('Erro ao carregar clientes. Tente novamente mais tarde.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', healthQuestionnaire: { fitnessLevel: 'Iniciante' } });
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        dateOfBirth: client.dateOfBirth ? client.dateOfBirth.split('T')[0] : '',
        gender: client.gender || '',
        healthQuestionnaire: client.healthQuestionnaire || { fitnessLevel: 'Iniciante' }
      });
    } else {
      setEditingClient(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient._id}`, formData);
      } else {
        await api.post('/clients', formData);
      }
      handleCloseModal();
      fetchClients();
    } catch (err) {
      setError('Erro ao salvar cliente.');
      console.error('Erro:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
      } catch (err) {
        setError('Erro ao remover cliente.');
        console.error('Erro:', err);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando clientes...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">Gestão de Clientes</Typography>
          <Typography color="text.secondary">Gerencie todos os seus clientes em um só lugar.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()}>Novo Cliente</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          {clients.length === 0 ? (
             <Box sx={{ textAlign: 'center', p: 8 }}><People sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} /><Typography variant="h5" gutterBottom>Nenhum cliente encontrado</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Comece adicionando seu primeiro cliente.</Typography><Button variant="contained" onClick={() => handleOpenModal()}>Adicionar Cliente</Button></Box>
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: 'background.default' }}><TableRow><TableCell>Nome</TableCell><TableCell>Email</TableCell><TableCell>Telefone</TableCell><TableCell>Nível</TableCell><TableCell>Status</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
              <TableBody>
                {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                  <TableRow key={client._id} hover>
                    <TableCell><Box sx={{ display: 'flex', alignItems: 'center' }}><Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{client.name.charAt(0).toUpperCase()}</Avatar><Box><Typography variant="body1" fontWeight="bold">{client.name}</Typography><Typography variant="caption" color="text.secondary">Desde {new Date(client.createdAt).toLocaleDateString('pt-PT')}</Typography></Box></Box></TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || '-'}</TableCell>
                    <TableCell><Chip label={client.healthQuestionnaire?.fitnessLevel || 'N/D'} color="info" size="small" /></TableCell>
                    <TableCell><Chip label={client.isActive ? 'Ativo' : 'Inativo'} color={client.isActive ? 'success' : 'default'} size="small" /></TableCell>
                    <TableCell align="right"><IconButton color="primary" onClick={() => handleOpenModal(client)}><Edit /></IconButton><IconButton color="error" onClick={() => handleDelete(client._id)}><Delete /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={clients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Clientes por página:"
        />
      </Paper>

      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}<IconButton onClick={handleCloseModal}><Close /></IconButton></Box></DialogTitle>
        <DialogContent><Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}><Grid container spacing={2}><Grid item xs={12} sm={6}><TextField fullWidth label="Nome Completo" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Telefone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Data de Nascimento" type="date" InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} /></Grid><Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Género</InputLabel><Select value={formData.gender} label="Género" onChange={(e) => setFormData({...formData, gender: e.target.value})}><MenuItem value="Masculino">Masculino</MenuItem><MenuItem value="Feminino">Feminino</MenuItem><MenuItem value="Outro">Outro</MenuItem></Select></FormControl></Grid><Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Nível de Fitness</InputLabel><Select value={formData.healthQuestionnaire.fitnessLevel} label="Nível de Fitness" onChange={(e) => setFormData({...formData, healthQuestionnaire: { ...formData.healthQuestionnaire, fitnessLevel: e.target.value }})}><MenuItem value="Iniciante">Iniciante</MenuItem><MenuItem value="Intermédio">Intermédio</MenuItem><MenuItem value="Avançado">Avançado</MenuItem></Select></FormControl></Grid></Grid></Box></DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={handleCloseModal}>Cancelar</Button><Button onClick={handleSubmit} variant="contained">{editingClient ? 'Atualizar Cliente' : 'Criar Cliente'}</Button></DialogActions>
      </Dialog>
    </Container>
  );
};

export default Clients;