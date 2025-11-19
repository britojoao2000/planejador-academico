// Em src/pages/Dashboard.tsx
import React, { useMemo } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, CircularProgress, Stack, LinearProgress,
  List, ListItem, ListItemIcon, ListItemText, Tooltip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuario, DefinicaoCurso } from '../types/types'; // Import DefinicaoCurso
import { useCourse } from '../hooks/useCourse';
import { getTipoPadrao } from '../data/cursos'; 

// --- FUNÇÃO DE CÁLCULO DINÂMICA (COM TETO/CAP) ---
const calcularEstatisticas = (disciplinas: DisciplinaUsuario[], curso: DefinicaoCurso) => {
  const concluidas = disciplinas.filter(d => d.status === 'concluida');
  const planejadas = disciplinas.filter(d => d.status === 'planejada');

  // Soma bruta (sem limite) - Total de créditos que o aluno cursou
  const creditosBrutosConcluidos = concluidas.reduce((acc, d) => acc + d.creditos, 0);
  const creditosPlanejados = planejadas.reduce((acc, d) => acc + d.creditos, 0);

  // Função auxiliar para somar por tipo DINAMICAMENTE
  const somarPorTipoDinamico = (lista: DisciplinaUsuario[]) => {
    const contagem = { obrigatoria: 0, limitada: 0, livre: 0 };

    lista.forEach((d) => {
      const tipoReal = getTipoPadrao(d.codigo, curso.id);
      if (contagem[tipoReal] !== undefined) {
        contagem[tipoReal] += d.creditos;
      } else {
        contagem.livre += d.creditos;
      }
    });
    return contagem;
  };

  const concluidosPorTipo = somarPorTipoDinamico(concluidas);
  const planejadosPorTipo = somarPorTipoDinamico(planejadas);

  // --- LÓGICA DE "CREDITOS EFETIVOS" (A MUDANÇA PRINCIPAL) ---
  // Soma apenas até o limite exigido pelo curso. Excesso é descartado para o cálculo de progresso.
  const efetivoObrigatoria = Math.min(concluidosPorTipo.obrigatoria, curso.totalObrigatorias || 0);
  const efetivoLimitada = Math.min(concluidosPorTipo.limitada, curso.totalLimitadas || 0);
  const efetivoLivre = Math.min(concluidosPorTipo.livre, curso.totalLivres || 0);

  const creditosEfetivos = efetivoObrigatoria + efetivoLimitada + efetivoLivre;

  return {
    concluidas,
    planejadas,
    creditosBrutosConcluidos, // Total geral cursado
    creditosEfetivos,         // Total que conta para formatura (com teto)
    creditosPlanejados,
    concluidosPorTipo,
    planejadosPorTipo,
  };
};

// --- Componentes Visuais ---

const ProgressoBar: React.FC<{ valor: number; total: number; titulo: string; }> = ({ valor, total, titulo }) => {
  const safeTotal = total || 1; 
  const percentual = (valor / safeTotal) * 100;
  const displayPercentual = Math.min(percentual, 100); 
  const excedente = Math.max(0, valor - total);

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" fontWeight="medium">{titulo}</Typography>
        <Box display="flex" gap={1}>
          <Typography variant="body2" color="text.secondary">
            {`${valor} / ${total}`}
          </Typography>
        </Box>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={displayPercentual} 
        // Muda a cor se tiver concluído tudo
        color={percentual >= 100 ? "success" : "primary"}
      />
      {excedente > 0 && (
         <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
           <InfoOutlinedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
           {excedente} créditos excedentes (não contam para o progresso total)
         </Typography>
      )}
    </Box>
  );
};

const KpiCard: React.FC<{ title: string; value: string | number; subtitle?: React.ReactNode }> = ({ title, value, subtitle }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
      <Typography variant="h4" component="div" fontWeight="bold" color="primary">{value}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
    </CardContent>
  </Card>
);

const DonutChart: React.FC<{ value: number; size: number }> = ({ value, size }) => {
  const safeValue = isNaN(value) ? 0 : value;
  const displayValue = Math.round(safeValue);
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress variant="determinate" sx={{ color: 'grey.200' }} size={size} thickness={4} value={100} />
      <CircularProgress 
        variant="determinate" 
        value={displayValue > 100 ? 100 : displayValue} 
        sx={{ position: 'absolute', left: 0, color: 'primary.main', strokeLinecap: 'round' }} 
        size={size} 
        thickness={4} 
      />
      <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" component="div" fontWeight="bold" color="text.primary">{`${displayValue}%`}</Typography>
      </Box>
    </Box>
  );
};

// --- Componente Principal ---

const Dashboard: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  const { selectedCourse } = useCourse();
  
  const TOTAL_OBRIGATORIAS = selectedCourse.totalObrigatorias || 0;
  const TOTAL_LIMITADAS = selectedCourse.totalLimitadas || 0;
  const TOTAL_LIVRES = selectedCourse.totalLivres || 0;
  const TOTAL_CURSO = TOTAL_OBRIGATORIAS + TOTAL_LIMITADAS + TOTAL_LIVRES;

  // Agora passamos o objeto 'selectedCourse' inteiro
  const stats = useMemo(() => {
    return calcularEstatisticas(disciplinas, selectedCourse);
  }, [disciplinas, selectedCourse]);
  
  // O Percentual agora usa os Créditos EFETIVOS (com Cap)
  const totalPercent = useMemo(() => {
    if (TOTAL_CURSO === 0) return 0;
    const pc = (stats.creditosEfetivos / TOTAL_CURSO) * 100;
    return isNaN(pc) ? 0 : pc;
  }, [stats.creditosEfetivos, TOTAL_CURSO]);

  const recommendations = useMemo(() => {
    const recs = [];
    if (stats.concluidosPorTipo.limitada < TOTAL_LIMITADAS) {
      recs.push({ text: `Faltam ${TOTAL_LIMITADAS - stats.concluidosPorTipo.limitada} créds. limitados`, icon: <TrackChangesIcon color="primary" />, note: "Verifique as ênfases." });
    }
    if (stats.concluidosPorTipo.livre > TOTAL_LIVRES) {
      recs.push({ 
        text: `Você tem ${stats.concluidosPorTipo.livre - TOTAL_LIVRES} créds. livres extras`, 
        icon: <WarningAmberIcon color="warning" />, 
        note: "Eles não contam para a porcentagem final." 
      });
    } else if (stats.concluidosPorTipo.livre < TOTAL_LIVRES) {
       recs.push({ text: `Faltam ${TOTAL_LIVRES - stats.concluidosPorTipo.livre} créds. livres`, icon: <TrackChangesIcon color="primary" />, note: "Explore outras áreas." });
    }
    if (recs.length === 0) {
      recs.push({ text: "Continue assim!", icon: <CheckCircleOutlineIcon color="success" />, note: "Foque nas obrigatórias restantes." });
    }
    return recs;
  }, [stats.concluidosPorTipo, TOTAL_LIMITADAS, TOTAL_LIVRES]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Grid container spacing={3} key={selectedCourse.id}>
        
        {/* Coluna Esquerda */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <KpiCard 
                  title="Créditos Concluídos (Total)" 
                  value={stats.creditosBrutosConcluidos}
                  subtitle={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircleOutlineIcon fontSize="inherit" color="success" />
                      <strong>{stats.creditosEfetivos}</strong> úteis para formatura
                    </span>
                  }
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
                  title="Progresso Real" 
                  value={`${totalPercent.toFixed(1)}%`} 
                  subtitle={`Baseado nos ${TOTAL_CURSO} créditos exigidos`}
                />
              </Grid>
            </Grid>

            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h6" gutterBottom>Recomendações</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Para: <strong>{selectedCourse.nome}</strong></Typography>
                    <List disablePadding>
                      {recommendations.map((rec, i) => (
                        <ListItem key={i} disableGutters>
                          <ListItemIcon sx={{ minWidth: 40 }}>{rec.icon}</ListItemIcon>
                          <ListItemText primary={rec.text} secondary={rec.note} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <DonutChart value={totalPercent} size={140} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Coluna Direita */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Progresso por Tipo</Typography>
                <ProgressoBar valor={stats.concluidosPorTipo.obrigatoria} total={TOTAL_OBRIGATORIAS} titulo="Obrigatórias" />
                <ProgressoBar valor={stats.concluidosPorTipo.limitada} total={TOTAL_LIMITADAS} titulo="Limitadas" />
                <ProgressoBar valor={stats.concluidosPorTipo.livre} total={TOTAL_LIVRES} titulo="Livres" />
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Estimativa</Typography>
                <Typography variant="body1">
                  Término: <strong>Jul 2027</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  (Baseado no curso {selectedCourse.nome})
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