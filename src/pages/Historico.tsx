// Em src/pages/Historico.tsx
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Grid, 
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuario } from '../types/types';
import DisciplinaCard from '../components/DisciplinaCard';
import FilterBar, { type TipoFiltro } from '../components/FilterBar';
import DisciplinaModal from '../components/DisciplinaModal';

// --- FUNÇÕES DE CÁLCULO PARA OS KPIs ---

// Função para agrupar disciplinas (a mesma de antes)
const agruparDisciplinas = (disciplinas: DisciplinaUsuario[]) => {
  const agrupado: Record<string, Record<string, DisciplinaUsuario[]>> = {};
  const disciplinasOrdenadas = [...disciplinas].sort((a, b) => {
    if (a.ano !== b.ano) return a.ano - b.ano;
    return a.quadrimestre - b.quadrimestre;
  });

  for (const disciplina of disciplinasOrdenadas) {
    if (!agrupado[disciplina.ano]) agrupado[disciplina.ano] = {};
    if (!agrupado[disciplina.ano][disciplina.quadrimestre]) agrupado[disciplina.ano][disciplina.quadrimestre] = [];
    agrupado[disciplina.ano][disciplina.quadrimestre].push(disciplina);
  }
  return agrupado;
};

// Nova função para calcular a média (baseada no seu mockup)
const calcularMedia = (disciplinas: DisciplinaUsuario[]): string => {
  const gradeMap: { [key: string]: number } = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0, '0': 0 };
  const numberMap: { [key: number]: string } = { 4: 'A', 3: 'B', 2: 'C', 1: 'D', 0: 'F' };
  
  let totalPontos = 0;
  let totalCreditos = 0;

  disciplinas.forEach(d => {
    const nota = d.nota?.toUpperCase();
    if (nota && nota in gradeMap) {
      totalPontos += gradeMap[nota] * d.creditos;
      totalCreditos += d.creditos;
    }
  });

  if (totalCreditos === 0) return 'N/A';
  
  const mediaNum = totalPontos / totalCreditos;
  const mediaArredondada = Math.round(mediaNum);
  
  return numberMap[mediaArredondada] || 'N/A';
};

// Novo Card de KPI
const KpiCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color = "text.primary" }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold" sx={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

const Historico: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todas');
  const [searchTerm, setSearchTerm] = useState(''); // Novo estado para busca
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState<DisciplinaUsuario | null>(null);

  // Filtra apenas as concluídas para os cálculos
  const historicoDisciplinas = useMemo(() => 
    disciplinas.filter(d => d.status === 'concluida'), 
  [disciplinas]);

  // KPIs
  const creditosConcluidos = useMemo(() => 
    historicoDisciplinas.reduce((acc, d) => acc + d.creditos, 0),
  [historicoDisciplinas]);

  const mediaGeral = useMemo(() => 
    calcularMedia(historicoDisciplinas),
  [historicoDisciplinas]);
  
  // Filtra e agrupa as disciplinas para exibição
  const disciplinasAgrupadas = useMemo(() => {
    const filtradas = historicoDisciplinas
      // 1. Filtra por Tipo (Obrigatória, Limitada, etc.)
      .filter(d => (filtroTipo === 'todas' ? true : d.tipo === filtroTipo))
      // 2. Filtra pelo Termo de Busca (novo)
      .filter(d => 
        d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    return agruparDisciplinas(filtradas);
  }, [historicoDisciplinas, filtroTipo, searchTerm]);

  const anos = Object.keys(disciplinasAgrupadas).sort((a, b) => Number(b) - Number(a)); // Mais recente primeiro

  const handleEdit = (disciplina: DisciplinaUsuario) => {
    setDisciplinaParaEditar(disciplina);
  };

  const handleCloseModal = () => {
    setDisciplinaParaEditar(null);
  };

  return (
    <Box>
      {/* Header (do seu mockup) */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Histórico Acadêmico
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumo das disciplinas concluídas ao longo dos anos.
        </Typography>
      </Box>
      
      {/* Barra de KPIs (do seu mockup) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <KpiCard 
            title="Créditos Concluídos" 
            value={creditosConcluidos} 
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard 
            title="Média (Conceito)" 
            value={mediaGeral}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard 
            title="Disciplinas Concluídas" 
            value={historicoDisciplinas.length} 
          />
        </Grid>
      </Grid>

      {/* Barra de Filtros e Busca (do seu mockup) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FilterBar filtroTipo={filtroTipo} onFiltroTipoChange={setFiltroTipo} />
        <TextField
          label="Buscar disciplina..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: '300px' }}
        />
      </Box>

      {loading && <CircularProgress />}
      
      {!loading && anos.length === 0 && (
        <Typography>Nenhuma disciplina concluída encontrada com esses filtros.</Typography>
      )}

      {/* Lista de Anos (Accordions) */}
      {anos.map((ano) => (
        <Accordion key={ano} defaultExpanded sx={{ mb: 1, '&.Mui-expanded': { mb: 1 } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="bold">{ano}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.50', p: { xs: 1, sm: 2 } }}>
            {Object.keys(disciplinasAgrupadas[ano]).map((quad) => (
              // Card do Quadrimestre (do seu mockup)
              <Paper 
                key={`${ano}-${quad}`} 
                elevation={0} 
                variant="outlined" 
                sx={{ mb: 2, p: 2 }}
              >
                <Typography variant="overline" display="block" fontWeight="medium" sx={{ mb: 2 }}>
                  Quadrimestre {quad}
                </Typography>
                
                {/* Lista de Disciplinas (agora usa Stack) */}
                <Stack spacing={2}>
                  {disciplinasAgrupadas[ano][quad].map((disciplina) => (
                    <DisciplinaCard 
                      key={disciplina.id}
                      disciplina={disciplina} 
                      onEdit={() => handleEdit(disciplina)}
                    />
                  ))}
                </Stack>
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modal de Edição (o mesmo de antes) */}
      {disciplinaParaEditar && (
        <DisciplinaModal
          open={!!disciplinaParaEditar}
          onClose={handleCloseModal}
          disciplinaToEdit={disciplinaParaEditar}
        />
      )}
    </Box>
  );
};

export default Historico;