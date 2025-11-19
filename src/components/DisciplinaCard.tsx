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

// Verifica se os pré-requisitos de uma disciplina foram cumpridos
const useVerificarRequisitos = (codigoDisciplina: string): boolean => {
  const { disciplinas } = useDisciplinas();
  // Busca a disciplina no catálogo geral
  const disciplinaCatalogo = CATALOGO_MESTRE.find(d => d.codigo === codigoDisciplina);
  // Se não tem pré-requisitos, está OK
  if (!disciplinaCatalogo || disciplinaCatalogo.prerequisitos.length === 0) return true;
  // Pega todos os códigos de disciplinas que o usuário já concluiu
  const concluidas = disciplinas.filter(d => d.status === 'concluida').map(d => d.codigo);
  // Confere se todos os pré-requisitos estão na lista de concluídas
  return disciplinaCatalogo.prerequisitos.every(req => concluidas.includes(req));
};

// Define a cor da nota baseado no valor
const getGradeColor = (nota?: string): string => {
  if (!nota) return 'text.secondary';
  const upperNota = nota.toUpperCase();
  // Casos de notas em letra
  if (upperNota === 'A') return 'success.main';
  if (upperNota === 'B') return 'info.main';
  if (upperNota === 'C') return 'text.primary';
  if (upperNota === 'D') return 'warning.main';
  if (upperNota === 'F' || upperNota === '0') return 'error.main';
  try {
    // Casos de notas numéricas
    const num = parseFloat(nota);
    if (num >= 9) return 'success.main';
    if (num >= 7) return 'info.main';
    if (num >= 5) return 'text.primary';
    if (num >= 3) return 'warning.main';
    return 'error.main';
  } catch { return 'text.secondary'; }
};

// Converte o tipo interno para um rótulo amigável
const getTipoLabel = (tipo: DisciplinaUsuario['tipo']) => {
  switch(tipo) {
    case 'obrigatoria': return 'Obrigatória';
    case 'limitada': return 'Limitada';
    case 'livre': return 'Livre';
  }
}

// Componente que mostra uma disciplina
const DisciplinaCard: React.FC<DisciplinaCardProps> = ({ disciplina, onEdit }) => {
  const { deleteDisciplina } = useDisciplinas();
  // Requisitos sempre OK se a disciplina já foi concluída
  const requisitosOk = (disciplina.status === 'concluida') ? true : useVerificarRequisitos(disciplina.codigo);

  // --- Responsividade ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // ---------------------

  // Confirma e deleta a disciplina
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
        // Lógica para mostrar/esconder os ícones de ação
        '& .action-icons': {
          opacity: isMobile ? 1 : 0, // Visível no mobile, invisível no desktop (sem hover)
          transition: 'opacity 0.2s',
        },
        '&:hover .action-icons': { opacity: 1 } // Visível no hover (desktop)
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flexGrow: 1, mr: 1 }}>
          {/* Chip com o tipo da disciplina */}
          <Chip
            label={getTipoLabel(disciplina.tipo)}
            size="small" variant="outlined"
            color={disciplina.tipo === 'obrigatoria' ? 'primary' : 'default'}
            sx={{ mb: 1, fontWeight: 'medium' }}
          />
          {/* Nome da Disciplina */}
          <Typography variant="subtitle1" component="div" fontWeight="medium" lineHeight={1.2} gutterBottom>
            {disciplina.nome}
          </Typography>
          {/* Código e Créditos */}
          <Typography variant="caption" color="text.secondary">
            {disciplina.codigo} • {disciplina.creditos} créditos
          </Typography>

          {/* Mostra a nota se concluída */}
          {disciplina.status === 'concluida' && disciplina.nota && (
            <Typography variant="body2" fontWeight="bold" sx={{ color: getGradeColor(disciplina.nota), mt: 0.5 }}>
              Nota: {disciplina.nota}
            </Typography>
          )}

          {/* Alerta de Pré-requisitos Pendentes (apenas para planejadas) */}
          {disciplina.status === 'planejada' && !requisitosOk && (
            <Tooltip title="Pré-requisitos não concluídos!">
              <Box display="flex" alignItems="center" color="error.main" mt={1}>
                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="error" fontWeight="medium">Requisitos pendentes</Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Ícones de Edição e Exclusão */}
        <Box className="action-icons" sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 0.5 }}>
          <IconButton size="small" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={handleDelete}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default DisciplinaCard;