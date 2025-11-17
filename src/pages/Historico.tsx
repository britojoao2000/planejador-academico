import React, { useState, useMemo } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuario } from '../types/types';
import DisciplinaCard from '../components/DisciplinaCard';
import FilterBar, { type TipoFiltro } from '../components/FilterBar';
import DisciplinaModal from '../components/DisciplinaModal';

// Função para agrupar disciplinas por Ano e Quadrimestre
const agruparDisciplinas = (disciplinas: DisciplinaUsuario[]) => {
  const agrupado: Record<string, Record<string, DisciplinaUsuario[]>> = {};

  // Ordena por ano e quadrimestre
  const disciplinasOrdenadas = [...disciplinas].sort((a, b) => {
    if (a.ano !== b.ano) return a.ano - b.ano;
    return a.quadrimestre - b.quadrimestre;
  });

  for (const disciplina of disciplinasOrdenadas) {
    if (!agrupado[disciplina.ano]) {
      agrupado[disciplina.ano] = {};
    }
    if (!agrupado[disciplina.ano][disciplina.quadrimestre]) {
      agrupado[disciplina.ano][disciplina.quadrimestre] = [];
    }
    agrupado[disciplina.ano][disciplina.quadrimestre].push(disciplina);
  }
  return agrupado;
};


const Historico: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todas');
  
  // Estado para o modal de edição
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState<DisciplinaUsuario | null>(null);

  // Filtra e agrupa as disciplinas
  const disciplinasAgrupadas = useMemo(() => {
    const historico = disciplinas.filter(d => d.status === 'concluida');
    
    const filtradas = (filtroTipo === 'todas')
      ? historico
      : historico.filter(d => d.tipo === filtroTipo);
      
    return agruparDisciplinas(filtradas);
  }, [disciplinas, filtroTipo]);

  const anos = Object.keys(disciplinasAgrupadas).sort((a, b) => Number(a) - Number(b));

  const handleEdit = (disciplina: DisciplinaUsuario) => {
    setDisciplinaParaEditar(disciplina);
  };

  const handleCloseModal = () => {
    setDisciplinaParaEditar(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Histórico Acadêmico
      </Typography>

      <FilterBar filtroTipo={filtroTipo} onFiltroTipoChange={setFiltroTipo} />

      {loading && <CircularProgress />}
      
      {!loading && anos.length === 0 && (
        <Typography>Nenhuma disciplina concluída encontrada.</Typography>
      )}

      {anos.map((ano) => (
        <Accordion key={ano} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{ano}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.50' }}>
            {Object.keys(disciplinasAgrupadas[ano]).map((quad) => (
              <Box key={`${ano}-${quad}`} sx={{ mb: 3 }}>
                <Typography variant="overline" display="block" gutterBottom>
                  Quadrimestre {quad}
                </Typography>
                <Grid container spacing={2}>
                  {disciplinasAgrupadas[ano][quad].map((disciplina) => (
                    <Grid item xs={12} sm={6} md={4} key={disciplina.id}>
                      <DisciplinaCard 
                        disciplina={disciplina} 
                        onEdit={() => handleEdit(disciplina)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modal de Edição */}
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