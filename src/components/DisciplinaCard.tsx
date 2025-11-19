import React from 'react';
import { Paper, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import type { DisciplinaUsuario } from '../types/types';
import { CATALOGO_MESTRE } from '../data/catalogoMestre';
import { useDisciplinas } from '../hooks/useDisciplinas';

interface DisciplinaCardProps {
  disciplina: DisciplinaUsuario;
  onEdit: () => void;
}

const useVerificarRequisitos = (codigoDisciplina: string): boolean => {
  const { disciplinas } = useDisciplinas();
  const disciplinaCatalogo = CATALOGO_MESTRE.find(d => d.codigo === codigoDisciplina);
  if (!disciplinaCatalogo || disciplinaCatalogo.prerequisitos.length === 0) return true;
  const concluidas = disciplinas.filter(d => d.status === 'concluida').map(d => d.codigo);
  return disciplinaCatalogo.prerequisitos.every(req => concluidas.includes(req));
};

const getGradeColor = (nota?: string): string => {
  if (!nota) return 'text.secondary';
  const upperNota = nota.toUpperCase();
  if (upperNota === 'A') return 'success.main';
  if (upperNota === 'B') return 'info.main';
  if (upperNota === 'C') return 'text.primary';
  if (upperNota === 'D') return 'warning.main';
  if (upperNota === 'F' || upperNota === '0') return 'error.main';
  try {
    const num = parseFloat(nota);
    if (num >= 9) return 'success.main';
    if (num >= 7) return 'info.main';
    if (num >= 5) return 'text.primary';
    if (num >= 3) return 'warning.main';
    return 'error.main';
  } catch { return 'text.secondary'; }
};

const getTipoLabel = (tipo: DisciplinaUsuario['tipo']) => {
  switch(tipo) {
    case 'obrigatoria': return 'Obrigatória';
    case 'limitada': return 'Limitada';
    case 'livre': return 'Livre';
  }
}

const DisciplinaCard: React.FC<DisciplinaCardProps> = ({ disciplina, onEdit }) => {
  const { deleteDisciplina } = useDisciplinas();
  const requisitosOk = (disciplina.status === 'concluida') ? true : useVerificarRequisitos(disciplina.codigo);
  
  // --- RESPONSIVIDADE ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  // ---------------------

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir "${disciplina.nome}"?`)) {
      try { await deleteDisciplina(disciplina.id); } catch (error) { console.error("Erro ao deletar:", error); }
    }
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, bgcolor: 'background.paper', transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 },
        // No desktop (hover), opacity 0 -> 1. No mobile, sempre 1.
        '& .action-icons': {
          opacity: isMobile ? 1 : 0, 
          transition: 'opacity 0.2s',
        },
        '&:hover .action-icons': { opacity: 1 }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flexGrow: 1, mr: 1 }}>
          <Chip 
            label={getTipoLabel(disciplina.tipo)} 
            size="small" variant="outlined"
            color={disciplina.tipo === 'obrigatoria' ? 'primary' : 'default'}
            sx={{ mb: 1, fontWeight: 'medium' }}
          />
          <Typography variant="subtitle1" component="div" fontWeight="medium" lineHeight={1.2} gutterBottom>
            {disciplina.nome}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {disciplina.codigo} • {disciplina.creditos} créditos
          </Typography>
          
          {disciplina.status === 'concluida' && disciplina.nota && (
            <Typography variant="body2" fontWeight="bold" sx={{ color: getGradeColor(disciplina.nota), mt: 0.5 }}>
              Nota: {disciplina.nota}
            </Typography>
          )}

          {disciplina.status === 'planejada' && !requisitosOk && (
            <Tooltip title="Pré-requisitos não concluídos!">
              <Box display="flex" alignItems="center" color="error.main" mt={1}>
                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="error" fontWeight="medium">Requisitos pendentes</Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        <Box className="action-icons" sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 0.5 }}>
          <IconButton size="small" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={handleDelete}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default DisciplinaCard;