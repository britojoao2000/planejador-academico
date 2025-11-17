// Em src/components/DisciplinaModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Typography,
  TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, Paper, List,
  ListItem, ListItemText, ListItemIcon, Chip, Stack, Alert, InputAdornment,
  ToggleButtonGroup, ToggleButton, IconButton, DialogContentText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutline';
import { deleteField } from "firebase/firestore"; 
import type { CatalogoDisciplina, DisciplinaUsuario } from '../types/types';
import { TODAS_AS_DISCIPLINAS } from '../data/catalogoDisciplina';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuarioData } from '../services/firestoreService';

interface DisciplinaModalProps {
  open: boolean;
  onClose: () => void;
  disciplinaToEdit?: DisciplinaUsuario | null;
}

// Tipo para o estado do formulário
type FormState = {
  catalogo: CatalogoDisciplina | null;
  ano: number;
  quadrimestre: 1 | 2 | 3;
  tipo: DisciplinaUsuario['tipo'];
  status: DisciplinaUsuario['status'];
  nota: string;
};

// Função que cria o "fake catalogo object"
const createCatalogoFromDisciplina = (disciplina: DisciplinaUsuario): CatalogoDisciplina => ({
  codigo: disciplina.codigo,
  nome: disciplina.nome,
  creditos: disciplina.creditos,
  tipoPadrao: disciplina.tipo, // Usa o tipo atual
  prerequisitos: [], // Não é relevante para a edição
});

// Pega o estado inicial (para criação ou edição)
const getInitialState = (disciplina?: DisciplinaUsuario | null): FormState => {
  if (disciplina) {
    return {
      catalogo: createCatalogoFromDisciplina(disciplina), // Isso vai preencher o Autocomplete
      ano: disciplina.ano,
      quadrimestre: disciplina.quadrimestre,
      tipo: disciplina.tipo,
      status: disciplina.status,
      nota: disciplina.nota || '',
    };
  }
  
  // Modo de criação (sem alteração)
  return {
    catalogo: null,
    ano: new Date().getFullYear(),
    quadrimestre: 1,
    tipo: 'obrigatoria',
    status: 'planejada',
    nota: '',
  };
};

// O novo componente de Modal
const DisciplinaModal: React.FC<DisciplinaModalProps> = ({ open, onClose, disciplinaToEdit }) => {
  const { addDisciplina, updateDisciplina } = useDisciplinas();
  const [formData, setFormData] = useState(getInitialState(disciplinaToEdit));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Popula o formulário se estivermos editando
  useEffect(() => {
    setFormData(getInitialState(disciplinaToEdit));
    setError(null); // Limpa erros ao abrir/mudar
  }, [disciplinaToEdit, open]);


  // Memoiza a lista de opções para o Autocomplete
  const autocompleteOptions = useMemo(() => {
    if (disciplinaToEdit) {
      const disciplinaCatalogo = createCatalogoFromDisciplina(disciplinaToEdit);
      const jaExiste = TODAS_AS_DISCIPLINAS.some(d => d.codigo === disciplinaCatalogo.codigo);
      if (jaExiste) {
        return TODAS_AS_DISCIPLINAS;
      }
      return [disciplinaCatalogo, ...TODAS_AS_DISCIPLINAS];
    }
    return TODAS_AS_DISCIPLINAS;
  }, [disciplinaToEdit]);


  // Handler para o Autocomplete
  const handleAutocompleteChange = (event: any, newValue: CatalogoDisciplina | null) => {
    setFormData(prev => ({
      ...prev,
      catalogo: newValue,
      tipo: newValue?.tipoPadrao || prev.tipo, 
    }));
    if (newValue) setError(null);
  };

  // Handler genérico para campos de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ano' ? Number(value) : value,
    }));
  };

  // Handlers para os Selects e Toggles
  const handleQuadChange = (e: any) => {
    setFormData(prev => ({ ...prev, quadrimestre: e.target.value as 1 | 2 | 3 }));
  };
  
  const handleTipoChange = (e: any) => {
    setFormData(prev => ({ ...prev, tipo: e.target.value as DisciplinaUsuario['tipo'] }));
  };

  const handleStatusChange = (e: any, newStatus: string | null) => {
    if (newStatus) {
      setFormData(prev => ({ ...prev, status: newStatus as DisciplinaUsuario['status'] }));
    }
  };

  // Validação
  const validate = (): boolean => {
    if (!formData.catalogo) { 
      setError("Selecione uma disciplina válida.");
      return false;
    }
    if (!formData.ano || formData.ano < 2000 || formData.ano > new Date().getFullYear() + 10) {
      setError("Ano inválido.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (disciplinaToEdit) {
        // --- MODO DE EDIÇÃO ---
        
        // --- CORREÇÃO 2: Usar 'deleteField()' ---
        // Criamos um payload parcial apenas com o que mudou.
        // O tipo 'any' é usado aqui para permitir o 'deleteField()'.
        const payload: any = { 
          ano: formData.ano,
          quadrimestre: formData.quadrimestre,
          tipo: formData.tipo,
          status: formData.status,
        };

        if (formData.status === 'concluida') {
          // Se estiver concluída, salva a nota (ou uma string vazia)
          payload.nota = formData.nota || ""; 
        } else {
          // Se for 'planejada', DEVEMOS deletar o campo 'nota'
          payload.nota = deleteField();
        }
        // -----------------------------------------

        await updateDisciplina(disciplinaToEdit.id, payload);

      } else {
        // --- MODO DE CRIAÇÃO ---
        const { catalogo, ...dadosUsuario } = formData; 
        
        // O tipo 'any' é usado para montar o objeto dinamicamente
        const dadosPayload: any = {
          codigo: catalogo!.codigo,
          nome: catalogo!.nome,
          creditos: catalogo!.creditos,
          ano: dadosUsuario.ano,
          quadrimestre: dadosUsuario.quadrimestre,
          tipo: dadosUsuario.tipo,
          status: dadosUsuario.status,
        };

        // Só adiciona o campo 'nota' se ele tiver um valor
        if (dadosUsuario.status === 'concluida' && dadosUsuario.nota) {
          dadosPayload.nota = dadosUsuario.nota;
        }
        
        await addDisciplina(dadosPayload as DisciplinaUsuarioData);
      }

      onClose(); // Sucesso!
    } catch (err) {
      console.error("Erro ao salvar:", err);
      // O 'err' que você viu é um objeto, então mostramos a mensagem
      const firebaseError = err as { code?: string; message?: string };
      setError(`Erro ao salvar: ${firebaseError.message || 'Verifique o console.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4 } 
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ m: 0, p: 2, pr: 8 }}>
        <Typography variant="h6" component="div" fontWeight="medium" sx={{ px: 1, pt: 1 }}>
          {disciplinaToEdit ? "Editar Disciplina" : "Adicionar Nova Disciplina"}
        </Typography>
        <DialogContentText sx={{ px: 1 }}>
          Preencha os dados para adicionar ao seu planejamento ou histórico.
        </DialogContentText>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" id="disciplina-form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Grid container spacing={3}>

            {/* ====== Coluna da Esquerda: Formulário ====== */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5}>
                
                {/* Autocomplete */}
                <Autocomplete
                  options={autocompleteOptions} 
                  getOptionLabel={(option) => `[${option.codigo}] ${option.nome}`}
                  value={formData.catalogo}
                  onChange={handleAutocompleteChange}
                  disabled={!!disciplinaToEdit} // Desativa se estiver editando
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      label="Selecionar Disciplina" 
                      placeholder="Procure por nome ou código..."
                      required
                      error={!!error && !formData.catalogo}
                    />
                  }
                  // Render customizado da lista
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.codigo} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">{option.nome}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.codigo} • {option.creditos} créditos
                        </Typography>
                      </Box>
                      <Chip 
                        label={option.tipoPadrao} 
                        size="small" 
                        variant="outlined" 
                        color={option.tipoPadrao === 'obrigatoria' ? 'primary' : 'default'}
                      />
                    </Box>
                  )}
                />
                
                {/* Ano e Quadrimestre */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Ano"
                      name="ano"
                      type="number"
                      value={formData.ano}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="quad-label">Quadrimestre</InputLabel>
                      <Select
                        labelId="quad-label"
                        label="Quadrimestre"
                        name="quadrimestre"
                        value={formData.quadrimestre}
                        onChange={handleQuadChange}
                      >
                        <MenuItem value={1}>1º Quad.</MenuItem>
                        <MenuItem value={2}>2º Quad.</MenuItem>
                        <MenuItem value={3}>3º Quad.</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Tipo e Status */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="tipo-label">Tipo</InputLabel>
                      <Select
                        labelId="tipo-label"
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleTipoChange}
                      >
                        <MenuItem value="obrigatoria">Obrigatória</MenuItem>
                        <MenuItem value="limitada">Limitada</MenuItem>
                        <MenuItem value="livre">Livre</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    {/* Toggle Buttons */}
                    <ToggleButtonGroup
                      value={formData.status}
                      exclusive
                      onChange={handleStatusChange}
                      aria-label="status"
                      fullWidth
                    >
                      <ToggleButton value="planejada" sx={{ flexGrow: 1 }}>Planejada</ToggleButton>
                      <ToggleButton value="concluida" sx={{ flexGrow: 1 }}>Concluída</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>

                {/* Campo de Nota */}
                {formData.status === 'concluida' && (
                  <TextField
                    label="Nota/Conceito (Opcional)"
                    name="nota"
                    value={formData.nota}
                    onChange={handleChange}
                    fullWidth
                  />
                )}

                {/* Mensagem de Erro / Seleção */}
                {error ? (
                  <Alert severity="error">{error}</Alert>
                ) : formData.catalogo && !disciplinaToEdit ? (
                  <Alert severity="success">
                    Disciplina selecionada: <strong>{formData.catalogo.nome}</strong>
                  </Alert>
                ) : null}

              </Stack>
            </Grid>
            
            {/* ====== Coluna da Direita: Preview ====== */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                {/* Preview Card */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Pré-visualização</Typography>
                  {formData.catalogo ? (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="h6" fontWeight="medium">{formData.catalogo.nome}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {formData.catalogo.codigo} • {formData.catalogo.creditos} créditos
                      </Typography>
                      <Chip label={`Tipo Padrão: ${formData.catalogo.tipoPadrao}`} size="small" variant="outlined" />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Nenhuma disciplina selecionada. Use a busca ao lado para localizar.
                    </Typography>
                  )}
                </Paper>
                
                {/* Atalhos */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlineIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText primary="O tipo é sugerido automaticamente." />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}><LightbulbOutlinedIcon fontSize="small" color="info" /></ListItemIcon>
                      <ListItemText primary="Se 'Concluída', irá para seu Histórico." />
                    </ListItem>
                  </List>
                </Paper>
              </Stack>
            </Grid>

          </Grid>
        </DialogContent>
        
        {/* Actions */}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button 
            type="submit" 
            form="disciplina-form"
            variant="contained" 
            disabled={loading}
          >
            Salvar Disciplina
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DisciplinaModal;