// Em src/components/DisciplinaCard.tsx
import React from 'react';
import { Paper, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import type { DisciplinaUsuario } from '../types/types';
import { TODAS_AS_DISCIPLINAS } from '../data/catalogoDisciplina';
import { useDisciplinas } from '../hooks/useDisciplinas';

interface DisciplinaCardProps {
  disciplina: DisciplinaUsuario;
  onEdit: () => void;
}

// Lógica de verificação de pré-requisitos (movida para dentro)
const useVerificarRequisitos = (codigoDisciplina: string): boolean => {
  const { disciplinas } = useDisciplinas();
  const disciplinaCatalogo = TODAS_AS_DISCIPLINAS.find(d => d.codigo === codigoDisciplina);
  if (!disciplinaCatalogo || disciplinaCatalogo.prerequisitos.length === 0) {
    return true;
  }
  const concluidas = disciplinas
    .filter(d => d.status === 'concluida')
    .map(d => d.codigo);
  return disciplinaCatalogo.prerequisitos.every(req => concluidas.includes(req));
};

// Nova função para cor da nota (baseada no seu mockup)
const getGradeColor = (nota?: string): string => {
  if (!nota) return 'text.secondary';
  const upperNota = nota.toUpperCase();
  if (upperNota === 'A') return 'success.main';
  if (upperNota === 'B') return 'info.main';
  if (upperNota === 'C') return 'text.primary';
  if (upperNota === 'D') return 'warning.main';
  if (upperNota === 'F' || upperNota === '0') return 'error.main';
  // Para notas numéricas
  try {
    const num = parseFloat(nota);
    if (num >= 9) return 'success.main';
    if (num >= 7) return 'info.main';
    if (num >= 5) return 'text.primary';
    if (num >= 3) return 'warning.main';
    return 'error.main';
  } catch {
    return 'text.secondary';
  }
};

// Nova função para o label do tipo
const getTipoLabel = (tipo: DisciplinaUsuario['tipo']) => {
  switch(tipo) {
    case 'obrigatoria': return 'Obrigatória';
    case 'limitada': return 'Limitada';
    case 'livre': return 'Livre';
  }
}

// Componente do Card redesenhado
const DisciplinaCard: React.FC<DisciplinaCardProps> = ({ disciplina, onEdit }) => {
  const { deleteDisciplina } = useDisciplinas();
  const requisitosOk = (disciplina.status === 'concluida') 
    ? true 
    : useVerificarRequisitos(disciplina.codigo);

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir "${disciplina.nome}"?`)) {
      try {
        await deleteDisciplina(disciplina.id);
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir disciplina.");
      }
    }
  };

  const tipoLabel = getTipoLabel(disciplina.tipo);
  const gradeColor = getGradeColor(disciplina.nota);

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        bgcolor: 'background.paper', 
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 3, // Elevação no hover
        },
        // Mostra os ícones no hover (como no seu mockup)
        '& .action-icons': {
          opacity: 0,
          transition: 'opacity 0.2s',
        },
        '&:hover .action-icons': {
          opacity: 1,
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        {/* Lado Esquerdo: Infos */}
        <Box>
          <Chip 
            label={tipoLabel} 
            size="small" 
            variant="outlined"
            color={disciplina.tipo === 'obrigatoria' ? 'primary' : 'default'}
            sx={{ mb: 1, fontWeight: 'medium' }}
          />
          <Typography variant="h6" component="div" fontWeight="medium" gutterBottom>
            {disciplina.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {disciplina.codigo} • {disciplina.creditos} créditos
          </Typography>
          
          {/* Nota (se concluída) */}
          {disciplina.status === 'concluida' && disciplina.nota && (
            <Typography variant="body1" fontWeight="bold" sx={{ color: gradeColor, mt: 0.5 }}>
              Nota: {disciplina.nota}
            </Typography>
          )}

          {/* Aviso de Requisito (se planejada) */}
          {disciplina.status === 'planejada' && !requisitosOk && (
            <Tooltip title="Pré-requisitos não concluídos!">
              <Box display="flex" alignItems="center" color="error.main" mt={1}>
                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="error" fontWeight="medium">
                  Requisitos pendentes
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Lado Direito: Ações */}
        <Box className="action-icons" sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={onEdit} aria-label="Editar">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDelete} aria-label="Excluir">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default DisciplinaCard;