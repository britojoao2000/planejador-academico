import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
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

// Verifica se os pré-requisitos estão satisfeitos
const useVerificarRequisitos = (codigoDisciplina: string): boolean => {
  const { disciplinas } = useDisciplinas();
  
  const disciplinaCatalogo = TODAS_AS_DISCIPLINAS.find(d => d.codigo === codigoDisciplina);
  if (!disciplinaCatalogo || disciplinaCatalogo.prerequisitos.length === 0) {
    return true; // Não tem requisitos, então está OK
  }

  const concluidas = disciplinas
    .filter(d => d.status === 'concluida')
    .map(d => d.codigo);

  // Verifica se TODOS os requisitos estão na lista de concluídas
  return disciplinaCatalogo.prerequisitos.every(req => concluidas.includes(req));
};


const DisciplinaCard: React.FC<DisciplinaCardProps> = ({ disciplina, onEdit }) => {
  const { deleteDisciplina } = useDisciplinas();
  
  // Verifica requisitos apenas se estiver planejada (Recurso 4)
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

  const getTipoLabel = (tipo: DisciplinaUsuario['tipo']) => {
    switch(tipo) {
      case 'obrigatoria': return 'Obrigatória';
      case 'limitada': return 'Limitada';
      case 'livre': return 'Livre';
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Chip 
            label={getTipoLabel(disciplina.tipo)} 
            size="small" 
            color={disciplina.tipo === 'obrigatoria' ? 'primary' : 'default'}
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Box>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="h6" component="div" gutterBottom>
          {disciplina.nome}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {disciplina.codigo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {disciplina.creditos} créditos
          </Typography>
        </Box>

        {disciplina.status === 'concluida' && disciplina.nota && (
          <Typography variant="body1" color="primary" fontWeight="bold">
            Nota: {disciplina.nota}
          </Typography>
        )}

        {disciplina.status === 'planejada' && !requisitosOk && (
          <Tooltip title="Pré-requisitos não concluídos!">
            <Box display="flex" alignItems="center" color="error.main" mt={1}>
              <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="error">
                Requisitos pendentes
              </Typography>
            </Box>
          </Tooltip>
        )}

      </CardContent>
    </Card>
  );
};

export default DisciplinaCard;