import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, LinearProgress } from '@mui/material';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuario } from '../types/types';

// Função auxiliar para calcular estatísticas
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

// Componente simples para barra de progresso
const ProgressoBar: React.FC<{ valor: number; total: number; titulo: string }> = ({ valor, total, titulo }) => {
  const percentual = total > 0 ? (valor / total) * 100 : 0;
  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" color="text.secondary">{titulo}</Typography>
        <Typography variant="body2" color="text.secondary">{`${valor} / ${total}`}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={percentual} />
    </Box>
  );
};


const Dashboard: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  const stats = calcularEstatisticas(disciplinas);

  // --- Defina aqui os totais do seu curso ---
  const TOTAL_OBRIGATORIAS = 245;
  const TOTAL_LIMITADAS = 28;
  const TOTAL_LIVRES = 27;
  const TOTAL_CURSO = TOTAL_OBRIGATORIAS + TOTAL_LIMITADAS + TOTAL_LIVRES;
  // ----------------------------------------

  if (loading) {
    return <Typography>Carregando estatísticas...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Cards de Totais */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Créditos Concluídos
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {stats.creditosConcluidos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Créditos Planejados
              </Typography>
              <Typography variant="h4" component="div">
                {stats.creditosPlanejados}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Progresso Total
              </Typography>
              <Typography variant="h4" component="div">
                {((stats.creditosConcluidos / TOTAL_CURSO) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Progresso Detalhado */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progresso por Tipo (Concluídos)
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
          </Paper>
        </Grid>

        {/* Card de Planejamento */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Créditos Planejados por Tipo
            </Typography>
            <Typography variant="body1">
              Obrigatórias: {stats.planejadosPorTipo.obrigatoria}
            </Typography>
            <Typography variant="body1">
              Limitadas: {stats.planejadosPorTipo.limitada}
            </Typography>
            <Typography variant="body1">
              Livres: {stats.planejadosPorTipo.livre}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;