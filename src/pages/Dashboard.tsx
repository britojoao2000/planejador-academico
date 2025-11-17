// Em src/pages/Dashboard.tsx
import React, { useMemo } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  Stack, 
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuario } from '../types/types';

// --- (Função auxiliar do dashboard anterior) ---
const calcularEstatisticas = (disciplinas: DisciplinaUsuario[]) => {
  const concluidas = disciplinas.filter(d => d.status === 'concluida');
  const planejadas = disciplinas.filter(d => d.status === 'planejada');

  const creditosConcluidos = concluidas.reduce((acc, d) => acc + d.creditos, 0);
  const creditosPlanejados = planejadas.reduce((acc, d) => acc + d.creditos, 0);

  const porTipo = (lista: DisciplinaUsuario[]) => ({
    obrigatoria: lista.filter(d => d.tipo === 'obrigatoria').reduce((acc, d) => acc + d.creditos, 0),
    limitada: lista.filter(d => d.tipo === 'limitada').reduce((acc, d) => acc + d.creditos, 0),
    livre: lista.filter(d => d.tipo === 'livre').reduce((acc, d) => acc + d.creditos, 0),
  });

  return {
    concluidas,
    planejadas,
    creditosConcluidos,
    creditosPlanejados,
    concluidosPorTipo: porTipo(concluidas),
    planejadosPorTipo: porTipo(planejadas),
  };
};

// --- (Componente do dashboard anterior) ---
const ProgressoBar: React.FC<{ valor: number; total: number; titulo: string; }> = ({ valor, total, titulo }) => {
  const percentual = total > 0 ? (valor / total) * 100 : 0;
  // Garante que o progresso visual não ultrapasse 100%
  const displayPercentual = Math.min(percentual, 100); 

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" fontWeight="medium">{titulo}</Typography>
        <Typography variant="body2" color="text.secondary">{`${valor} / ${total}`}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={displayPercentual} />
      {percentual > 100 && (
         <Typography variant="caption" color="primary">
           +{(valor - total)} créditos bônus!
         </Typography>
      )}
    </Box>
  );
};

// --- Novos Componentes de UI (baseados no seu mockup) ---

/**
 * Cartão de KPI (Key Performance Indicator)
 */
const KpiCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" fontWeight="bold" color="primary">
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

/**
 * Gráfico de Rosca (Donut Chart)
 */
const DonutChart: React.FC<{ value: number; size: number }> = ({ value, size }) => {
  const displayValue = Math.round(value);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress
        variant="determinate"
        sx={{ color: 'grey.200' }}
        size={size}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        value={displayValue}
        sx={{ 
          position: 'absolute', 
          left: 0, 
          color: 'primary.main',
          strokeLinecap: 'round'
        }}
        size={size}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" component="div" fontWeight="bold" color="text.primary">
          {`${displayValue}%`}
        </Typography>
      </Box>
    </Box>
  );
};

// --- Componente Principal do Dashboard ---

const Dashboard: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  
  // --- Constantes do Curso (Eng. Informação) ---
  const TOTAL_OBRIGATORIAS = 245;
  const TOTAL_LIMITADAS = 28;
  const TOTAL_LIVRES = 27;
  const TOTAL_CURSO = TOTAL_OBRIGATORIAS + TOTAL_LIMITADAS + TOTAL_LIVRES;
  // ----------------------------------------

  // Calcula todas as estatísticas
  const stats = useMemo(() => calcularEstatisticas(disciplinas), [disciplinas]);
  
  const totalPercent = useMemo(() => 
    (stats.creditosConcluidos / TOTAL_CURSO) * 100
  , [stats.creditosConcluidos, TOTAL_CURSO]);

  // Lógica dinâmica para as recomendações
  const recommendations = useMemo(() => {
    const recs = [];
    if (stats.concluidosPorTipo.limitada < TOTAL_LIMITADAS) {
      recs.push({
        text: `Planejar ${TOTAL_LIMITADAS - stats.concluidosPorTipo.limitada} créditos limitados`,
        icon: <TrackChangesIcon color="primary" />,
        note: "Verifique as disciplinas de ênfase."
      });
    }
    if (stats.concluidosPorTipo.livre > TOTAL_LIVRES) {
      recs.push({
        text: `Excesso de ${stats.concluidosPorTipo.livre - TOTAL_LIVRES} créditos livres`,
        icon: <WarningAmberIcon color="warning" />,
        note: "Você já completou todos os créditos livres!"
      });
    } else if (stats.concluidosPorTipo.livre < TOTAL_LIVRES) {
       recs.push({
        text: `Adicionar ${TOTAL_LIVRES - stats.concluidosPorTipo.livre} créditos livres`,
        icon: <TrackChangesIcon color="primary" />,
        note: "Considere explorar outras áreas do conhecimento."
      });
    }

    if (recs.length === 0) {
      recs.push({
        text: "Créditos obrigatórios em dia!",
        icon: <CheckCircleOutlineIcon color="success" />,
        note: "Continue focando nas disciplinas do próximo quadrimestre."
      });
    }
    return recs;
  }, [stats.concluidosPorTipo]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Removemos o Header, pois ele já está no AppLayout.tsx */}
      
      {/* Grid Principal (lg:cols-3) */}
      <Grid container spacing={3}>
        
        {/* Coluna da Esquerda (lg:col-span-2) */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* KPIs (md:cols-3) */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <KpiCard 
                  title="Créditos Concluídos" 
                  value={stats.creditosConcluidos} 
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <KpiCard 
                  title="Créditos Planejados" 
                  value={stats.creditosPlanejados} 
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <KpiCard 
                  title="Progresso Total" 
                  value={`${totalPercent.toFixed(1)}%`} 
                  subtitle={`Meta: ${TOTAL_CURSO} créditos`}
                />
              </Grid>
            </Grid>

            {/* Card de Recomendações (md:col-span-3) */}
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* Lista de Recomendações */}
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h6" gutterBottom>
                      Recomendações
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Ações rápidas para avançar em direção à formatura.
                    </Typography>
                    <List disablePadding>
                      {recommendations.map((rec, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {rec.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={rec.text}
                            secondary={rec.note}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Gráfico de Rosca */}
                  <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                    <Box textAlign="center">
                      <DonutChart value={totalPercent} size={140} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Progresso até a formatura
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Coluna da Direita (lg:col-span-1) */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Card de Progresso por Tipo */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progresso por Tipo
                </Typography>
                <ProgressoBar 
                  valor={stats.concluidosPorTipo.obrigatoria} 
                  total={TOTAL_OBRIGATORIAS} 
                  titulo="Obrigatórias" 
                />
                <ProgressoBar 
                  valor={stats.concluidosPorTipo.limitada} 
                  total={TOTAL_LIMITADAS} 
                  titulo="Limitadas" 
                />
                <ProgressoBar 
                  valor={stats.concluidosPorTipo.livre} 
                  total={TOTAL_LIVRES} 
                  titulo="Livres" 
                />
              </CardContent>
            </Card>

            {/* Card de Créditos Planejados */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Créditos Planejados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Obrigatórias: {stats.planejadosPorTipo.obrigatoria}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Limitadas: {stats.planejadosPorTipo.limitada}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Livres: {stats.planejadosPorTipo.livre}
                </Typography>
              </CardContent>
            </Card>

            {/* Card de Timeline (estimativa) */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estimativa
                </Typography>
                <Typography variant="body1">
                  Término: <strong>Jul 2027</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  (Considerando ~20 créditos/quadri)
                </Typography>
              </CardContent>
            </Card>

          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;