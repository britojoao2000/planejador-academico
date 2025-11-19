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
import { useCourse } from '../hooks/useCourse';

// --- FUNÇÕES AUXILIARES (do Histórico) ---

// Função para agrupar disciplinas
const agruparDisciplinas = (disciplinas: DisciplinaUsuario[]) => {
  const agrupado: Record<string, Record<string, DisciplinaUsuario[]>> = {};
  // Ordena por ano e quadri (ASCENDENTE, pois é futuro)
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

// Card de KPI
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

const Planejador: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  const { selectedCourse } = useCourse();
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todas');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para busca
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState<DisciplinaUsuario | null>(null);

  // Filtra apenas as planejadas E as concluídas (para os KPIs)
  const planejadasDisciplinas = useMemo(() => 
    disciplinas.filter(d => d.status === 'planejada'), 
  [disciplinas]);
  
  const concluidasDisciplinas = useMemo(() => 
    disciplinas.filter(d => d.status === 'concluida'), 
  [disciplinas]);

  // --- KPIs ---
  const creditosPlanejados = useMemo(() => 
    planejadasDisciplinas.reduce((acc, d) => acc + d.creditos, 0),
  [planejadasDisciplinas]);

  const creditosObrigatoriosRestantes = useMemo(() => {
    const concluidos = concluidasDisciplinas
      .filter(d => d.tipo === 'obrigatoria')
      .reduce((acc, d) => acc + d.creditos, 0);
    return Math.max(0, selectedCourse.totalObrigatorias - concluidos); 
  }, [concluidasDisciplinas, selectedCourse]);
  
  const creditosLimitadosRestantes = useMemo(() => {
    const concluidos = concluidasDisciplinas
      .filter(d => d.tipo === 'limitada')
      .reduce((acc, d) => acc + d.creditos, 0);
    return Math.max(0, selectedCourse.totalLimitadas - concluidos); 
  }, [concluidasDisciplinas, selectedCourse]);

  
  // Filtra e agrupa as disciplinas para exibição
  const disciplinasAgrupadas = useMemo(() => {
    const filtradas = planejadasDisciplinas
      // 1. Filtra por Tipo
      .filter(d => (filtroTipo === 'todas' ? true : d.tipo === filtroTipo))
      // 2. Filtra pelo Termo de Busca
      .filter(d => 
        d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    return agruparDisciplinas(filtradas);
  }, [planejadasDisciplinas, filtroTipo, searchTerm]);

  const anos = Object.keys(disciplinasAgrupadas).sort((a, b) => Number(a) - Number(b)); // Mais antigo primeiro

  const handleEdit = (disciplina: DisciplinaUsuario) => {
    setDisciplinaParaEditar(disciplina);
  };

  const handleCloseModal = () => {
    setDisciplinaParaEditar(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Planejador Acadêmico
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Planeje seus próximos quadrimestres e acompanhe as disciplinas futuras.
        </Typography>
      </Box>
      
      {/* Barra de KPIs */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <KpiCard 
            title="Total de Créditos Planejados" 
            value={creditosPlanejados} 
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard 
            title="Créditos Obrigatórios Restantes" 
            value={creditosObrigatoriosRestantes}
            color={creditosObrigatoriosRestantes > 0 ? "warning.main" : "success.main"}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard 
            title="Créditos Limitados Restantes" 
            value={creditosLimitadosRestantes}
            color={creditosLimitadosRestantes > 0 ? "text.primary" : "success.main"}
          />
        </Grid>
      </Grid>

      {/* Barra de Filtros e Busca */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FilterBar filtroTipo={filtroTipo} onFiltroTipoChange={setFiltroTipo} />
        <TextField
          label="Buscar disciplina planejada..."
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
        <Typography>Nenhuma disciplina planejada encontrada com esses filtros.</Typography>
      )}

      {/* Lista de Anos (Accordions) */}
      {anos.map((ano) => (
        <Accordion key={ano} defaultExpanded sx={{ mb: 1, '&.Mui-expanded': { mb: 1 } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="bold">{ano}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.50', p: { xs: 1, sm: 2 } }}>
            {Object.keys(disciplinasAgrupadas[ano]).map((quad) => (
              // Card do Quadrimestre
              <Paper 
                key={`${ano}-${quad}`} 
                elevation={0} 
                variant="outlined" 
                sx={{ mb: 2, p: 2 }}
              >
                <Typography variant="overline" display="block" fontWeight="medium" sx={{ mb: 2 }}>
                  Quadrimestre {quad} (Planejado)
                </Typography>
                
                {/* Lista de Disciplinas (agora usa Stack) */}
                <Stack spacing={2}>
                  {disciplinasAgrupadas[ano][quad].map((disciplina) => (
                    // O DisciplinaCard já foi atualizado e mostrará
                    // o aviso de pré-requisito automaticamente!
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

export default Planejador;