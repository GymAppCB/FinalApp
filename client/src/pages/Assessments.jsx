// client/src/pages/Assessments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  CircularProgress, 
  Paper, 
  Grid , // Use Grid2 to avoid deprecation warnings
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip
} from '@mui/material';
import { 
  Add, 
  ExpandMore, 
  Person, 
  CalendarToday,
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';

import api from '../services/api';
import NewAssessmentDialog from '../components/dialogs/NewAssessmentDialog';

// Simple SVG Chart Component (no external dependencies)
const SimpleLineChart = ({ data, width = 500, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Dados insuficientes para gráfico</Typography>
      </Box>
    );
  }

  const margin = { top: 20, right: 60, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Get data ranges
  const weights = data.map(d => d.peso).filter(Boolean);
  const bodyFats = data.map(d => d.gorduraCorporal).filter(Boolean);
  const muscles = data.map(d => d.massaMuscular).filter(Boolean);

  const minWeight = Math.min(...weights, ...muscles);
  const maxWeight = Math.max(...weights, ...muscles);
  const minFat = Math.min(...bodyFats);
  const maxFat = Math.max(...bodyFats);

  // Create points for lines
  const createPoints = (values, min, max) => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((values[i] - min) / (max - min)) * chartHeight;
      return { x, y, value: values[i] };
    });
  };

  const weightPoints = createPoints(weights, minWeight, maxWeight);
  const musclePoints = createPoints(muscles, minWeight, maxWeight);
  const fatPoints = createPoints(bodyFats, minFat, maxFat);

  const createPath = (points) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Evolução das Métricas</Typography>
      <svg width={width} height={height} style={{ border: '1px solid #e0e0e0', borderRadius: 4 }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={0}
              y1={(i / 4) * chartHeight}
              x2={chartWidth}
              y2={(i / 4) * chartHeight}
              stroke="#f0f0f0"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Weight line */}
          <path
            d={createPath(weightPoints)}
            fill="none"
            stroke="#8884d8"
            strokeWidth="3"
          />
          
          {/* Muscle line */}
          <path
            d={createPath(musclePoints)}
            fill="none"
            stroke="#82ca9d"
            strokeWidth="3"
          />
          
          {/* Body fat line (scaled to right axis) */}
          <path
            d={createPath(fatPoints.map(p => ({
              ...p,
              y: chartHeight - ((p.value - minFat) / (maxFat - minFat)) * chartHeight
            })))}
            fill="none"
            stroke="#ffc658"
            strokeWidth="3"
          />
          
          {/* Data points */}
          {weightPoints.map((p, i) => (
            <circle key={`weight-${i}`} cx={p.x} cy={p.y} r="4" fill="#8884d8" />
          ))}
          {musclePoints.map((p, i) => (
            <circle key={`muscle-${i}`} cx={p.x} cy={p.y} r="4" fill="#82ca9d" />
          ))}
          {fatPoints.map((p, i) => {
            const y = chartHeight - ((p.value - minFat) / (maxFat - minFat)) * chartHeight;
            return <circle key={`fat-${i}`} cx={p.x} cy={y} r="4" fill="#ffc658" />;
          })}
          
          {/* Axes */}
          <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#666" strokeWidth="2" />
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#666" strokeWidth="2" />
          <line x1={chartWidth} y1={0} x2={chartWidth} y2={chartHeight} stroke="#666" strokeWidth="2" />
          
          {/* Y-axis labels (left - kg) */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = minWeight + (i / 4) * (maxWeight - minWeight);
            const y = chartHeight - (i / 4) * chartHeight;
            return (
              <text key={`left-${i}`} x={-10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">
                {value.toFixed(1)}
              </text>
            );
          })}
          
          {/* Y-axis labels (right - %) */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = minFat + (i / 4) * (maxFat - minFat);
            const y = chartHeight - (i / 4) * chartHeight;
            return (
              <text key={`right-${i}`} x={chartWidth + 10} y={y + 4} textAnchor="start" fontSize="12" fill="#666">
                {value.toFixed(1)}%
              </text>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * chartWidth;
            return (
              <text key={i} x={x} y={chartHeight + 25} textAnchor="middle" fontSize="12" fill="#666">
                {d.date}
              </text>
            );
          })}
          
          {/* Axis labels */}
          <text x={-40} y={chartHeight/2} textAnchor="middle" transform={`rotate(-90, -40, ${chartHeight/2})`} fontSize="14" fill="#666">
            kg
          </text>
          <text x={chartWidth + 40} y={chartHeight/2} textAnchor="middle" transform={`rotate(90, ${chartWidth + 40}, ${chartHeight/2})`} fontSize="14" fill="#666">
            %
          </text>
          <text x={chartWidth/2} y={chartHeight + 35} textAnchor="middle" fontSize="14" fill="#666">
            Avaliações
          </text>
        </g>
      </svg>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 3, bgcolor: '#8884d8', mr: 1 }} />
          <Typography variant="caption">Peso</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 3, bgcolor: '#82ca9d', mr: 1 }} />
          <Typography variant="caption">Massa Muscular</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 3, bgcolor: '#ffc658', mr: 1 }} />
          <Typography variant="caption">Gordura Corporal</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Assessments = () => {
  const [assessmentsByClient, setAssessmentsByClient] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assessmentsRes, clientsRes] = await Promise.all([
        api.get('/assessments'),
        api.get('/clients')
      ]);

      const grouped = assessmentsRes.data.reduce((acc, assessment) => {
        const clientId = assessment.client?._id;
        if (!clientId) return acc;
        if (!acc[clientId]) {
          acc[clientId] = {
            clientName: assessment.client.name,
            assessments: []
          };
        }
        acc[clientId].assessments.push(assessment);
        acc[clientId].assessments.sort((a, b) => new Date(a.date) - new Date(b.date));
        return acc;
      }, {});

      setAssessmentsByClient(grouped);
      setClients(clientsRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados de avaliações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format data for chart
  const formatChartData = (assessments) => {
    return assessments.map(assessment => ({
      date: new Date(assessment.date).toLocaleDateString('pt-PT', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      fullDate: new Date(assessment.date).toLocaleDateString('pt-PT'),
      peso: assessment.measurements.weight || 0,
      massaMuscular: assessment.measurements.muscleMass || 0,
      gorduraCorporal: assessment.measurements.bodyFat || 0,
    }));
  };

  // Calculate trends
  const calculateTrend = (assessments, metric) => {
    if (assessments.length < 2) return 'stable';
    const latest = assessments[assessments.length - 1].measurements[metric];
    const previous = assessments[assessments.length - 2].measurements[metric];
    
    if (!latest || !previous) return 'stable';
    
    const diff = latest - previous;
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down': return <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />;
      default: return <TrendingFlat sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = (trend, metric) => {
    if (trend === 'stable') return 'default';
    
    if (metric === 'bodyFat') {
      return trend === 'down' ? 'success' : 'error';
    }
    
    return trend === 'up' ? 'success' : 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Avaliações Físicas
          </Typography>
          <Typography color="text.secondary">
            Acompanhe o progresso e o histórico de avaliações dos seus clientes.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setOpenDialog(true)}
          size="large"
        >
          Nova Avaliação
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box>
          {Object.keys(assessmentsByClient).length === 0 ? (
            <Paper sx={{ textAlign: 'center', p: 6 }}>
              <Typography variant="h6" gutterBottom>
                Nenhuma avaliação encontrada
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Clique em "Nova Avaliação" para começar a acompanhar o progresso dos seus clientes.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Add />} 
                onClick={() => setOpenDialog(true)}
              >
                Criar Primeira Avaliação
              </Button>
            </Paper>
          ) : (
            Object.keys(assessmentsByClient).map(clientId => {
              const clientData = assessmentsByClient[clientId];
              const chartData = formatChartData(clientData.assessments);
              const latestAssessment = clientData.assessments[clientData.assessments.length - 1];
              
              const weightTrend = calculateTrend(clientData.assessments, 'weight');
              const fatTrend = calculateTrend(clientData.assessments, 'bodyFat');
              const muscleTrend = calculateTrend(clientData.assessments, 'muscleMass');

              return (
                <Accordion key={clientId} sx={{ mb: 2, '&:before': { display: 'none' } }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      minHeight: 72
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: '100%', 
                      justifyContent: 'space-between', 
                      flexWrap: 'wrap',
                      gap: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="bold">
                          {clientData.clientName}
                        </Typography>
                        <Chip 
                          label={`${clientData.assessments.length} avaliações`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Última: {new Date(latestAssessment.date).toLocaleDateString('pt-PT')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            icon={getTrendIcon(weightTrend)}
                            label="Peso"
                            size="small"
                            color={getTrendColor(weightTrend, 'weight')}
                            variant="outlined"
                          />
                          <Chip 
                            icon={getTrendIcon(fatTrend)}
                            label="Gordura"
                            size="small"
                            color={getTrendColor(fatTrend, 'bodyFat')}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 3, height: 400 }}>
                          <SimpleLineChart data={chartData} width={600} height={350} />
                        </Paper>
                      </Grid>
                      
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                          {/* Current Metrics */}
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Métricas Atuais
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Peso:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {latestAssessment.measurements.weight || 'N/A'}kg
                                  </Typography>
                                  {getTrendIcon(weightTrend)}
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Massa Muscular:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {latestAssessment.measurements.muscleMass || 'N/A'}kg
                                  </Typography>
                                  {getTrendIcon(muscleTrend)}
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Gordura Corporal:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {latestAssessment.measurements.bodyFat || 'N/A'}%
                                  </Typography>
                                  {getTrendIcon(fatTrend)}
                                </Box>
                              </Box>
                            </Box>
                          </Paper>

                          {/* History */}
                          <Paper sx={{ p: 2, flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Histórico de Avaliações
                            </Typography>
                            <Box sx={{ maxHeight: 280, overflow: 'auto' }}>
                              <List dense>
                                {clientData.assessments.slice().reverse().map((assessment, index) => (
                                  <React.Fragment key={assessment._id}>
                                    <ListItem sx={{ px: 0 }}>
                                      <ListItemText 
                                        primary={
                                          <Typography variant="body2" fontWeight="medium">
                                            {new Date(assessment.date).toLocaleDateString('pt-PT')}
                                          </Typography>
                                        }
                                        secondary={
                                          <Typography variant="caption" color="text.secondary">
                                            Peso: {assessment.measurements.weight || 'N/A'}kg • 
                                            Gordura: {assessment.measurements.bodyFat || 'N/A'}% •
                                            Músculo: {assessment.measurements.muscleMass || 'N/A'}kg
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                    {index < clientData.assessments.length - 1 && <Divider />}
                                  </React.Fragment>
                                ))}
                              </List>
                            </Box>
                          </Paper>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}
        </Box>
      )}

      <NewAssessmentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchData}
        clients={clients}
      />
    </Container>
  );
};

export default Assessments;
