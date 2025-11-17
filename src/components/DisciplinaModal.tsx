import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import type { DisciplinaUsuario } from '../types/types';
import DisciplinaForm from './DisciplinaForm';

interface DisciplinaModalProps {
  open: boolean;
  onClose: () => void;
  disciplinaToEdit?: DisciplinaUsuario | null;
}

const DisciplinaModal: React.FC<DisciplinaModalProps> = ({ open, onClose, disciplinaToEdit }) => {
  const formId = "disciplina-form";
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {disciplinaToEdit ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}
      </DialogTitle>
      
      <DialogContent>
        {/* O formulário é renderizado aqui */}
        <DisciplinaForm
          formId={formId}
          disciplinaToEdit={disciplinaToEdit}
          onSuccess={onClose} // Fecha o modal em caso de sucesso
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="submit" 
          form={formId} // Associa este botão ao submit do form
          variant="contained"
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisciplinaModal;