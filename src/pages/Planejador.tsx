import React, { useState, useMemo } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { DisciplinaUsuario } from '../types/types';
import DisciplinaCard from '../components/DisciplinaCard';
import FilterBar, { type TipoFiltro } from '../components/FilterBar';
import DisciplinaModal from '../components/DisciplinaModal';

// (Pode mover esta função para um utils se preferir)
const agruparDisciplinas = (disciplinas: DisciplinaUsuario[]) => {
  const agrupado: Record<string, Record<string, DisciplinaUsuario[]>> = {};

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


const Planejador: React.FC = () => {
  const { disciplinas, loading } = useDisciplinas();
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todas');
  
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState<DisciplinaUsuario | null>(null);

  const disciplinasAgrupadas = useMemo(() => {
    // A ÚNICA MUDANÇA É AQUI: 'planejada'
    const planejadas = disciplinas.filter(d => d.status === 'planejada'); 
    
    const filtradas = (filtroTipo === 'todas')
      ? planejadas
      : planejadas.filter(d => d.tipo === filtroTipo);
      
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
        Planejador Futuro
      </Typography>

      <FilterBar filtroTipo={filtroTipo} onFiltroTipoChange={setFiltroTipo} />

      {loading && <CircularProgress />}
      
      {!loading && anos.length === 0 && (
        <Typography>Nenhuma disciplina planejada encontrada.</Typography>
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
                  Quadrimestre {quad} (Planejado)
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

export default Planejador;