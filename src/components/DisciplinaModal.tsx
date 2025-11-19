// Em src/components/DisciplinaModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Typography,
  TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, Paper, List,
  ListItem, ListItemText, ListItemIcon, Chip, Stack, Alert,
  ToggleButtonGroup, ToggleButton, IconButton, DialogContentText,
  useMediaQuery, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlineIcon from '@mui/icons-material/LightbulbOutline';
import { deleteField } from "firebase/firestore";
import type { CatalogoDisciplina, DisciplinaUsuario } from '../types/types';
import { CATALOGO_MESTRE } from '../data/catalogoMestre';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuarioData } from '../services/firestoreService';
import { useCourse } from '../hooks/useCourse';
import { getTipoPadrao } from '../data/cursos';

interface DisciplinaModalProps {
  open: boolean;
  onClose: () => void;
  // Disciplina a ser editada (se for edição)
  disciplinaToEdit?: DisciplinaUsuario | null;
}

type FormState = {
  catalogo: CatalogoDisciplina | null;
  ano: number;
  quadrimestre: 1 | 2 | 3;
  tipo: DisciplinaUsuario['tipo'];
  status: DisciplinaUsuario['status'];
  nota: string;
};

// Cria um objeto de catálogo a partir de uma disciplina do usuário (útil para edição)
const createCatalogoFromDisciplina = (disciplina: DisciplinaUsuario): CatalogoDisciplina => ({
  codigo: disciplina.codigo,
  nome: disciplina.nome,
  creditos: disciplina.creditos,
  prerequisitos: [],
});

// Define o estado inicial do formulário
const getInitialState = (disciplina?: DisciplinaUsuario | null): FormState => {
  if (disciplina) {
    // Estado para edição
    return {
      catalogo: createCatalogoFromDisciplina(disciplina),
      ano: disciplina.ano,
      quadrimestre: disciplina.quadrimestre,
      tipo: disciplina.tipo,
      status: disciplina.status,
      nota: disciplina.nota || '',
    };
  }
  // Estado para nova disciplina
  return {
    catalogo: null,
    ano: new Date().getFullYear(),
    quadrimestre: 1,
    tipo: 'obrigatoria',
    status: 'planejada',
    nota: '',
  };
};

const DisciplinaModal: React.FC<DisciplinaModalProps> = ({ open, onClose, disciplinaToEdit }) => {
  const { addDisciplina, updateDisciplina } = useDisciplinas();
  const { selectedCourse } = useCourse();
  const [formData, setFormData] = useState(getInitialState(disciplinaToEdit));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Responsividade ---
  const theme = useTheme();
  // True se for tela pequena (celular/tablet)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // ---------------------

  // Zera o estado e erros ao abrir o modal ou mudar a disciplina
  useEffect(() => {
    setFormData(getInitialState(disciplinaToEdit));
    setError(null);
  }, [disciplinaToEdit, open]);

  // Opções para o Autocomplete (inclui a disciplina atual se estiver editando)
  const autocompleteOptions = useMemo(() => {
    if (disciplinaToEdit) {
      const disciplinaCatalogo = createCatalogoFromDisciplina(disciplinaToEdit);
      const jaExiste = CATALOGO_MESTRE.some(d => d.codigo === disciplinaCatalogo.codigo);
      // Garante que a disciplina sendo editada esteja nas opções
      if (jaExiste) return CATALOGO_MESTRE;
      return [disciplinaCatalogo, ...CATALOGO_MESTRE];
    }
    return CATALOGO_MESTRE;
  }, [disciplinaToEdit]);

  // Lida com a seleção no Autocomplete
  const handleAutocompleteChange = (event: any, newValue: CatalogoDisciplina | null) => {
    // Sugere o tipo padrão para o curso atual
    const tipoSugerido = newValue
      ? getTipoPadrao(newValue.codigo, selectedCourse.id)
      : 'obrigatoria';

    setFormData(prev => ({
      ...prev,
      catalogo: newValue,
      tipo: tipoSugerido,
    }));
    if (newValue) setError(null);
  };

  // Lida com a mudança de inputs simples (Ano, Nota)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ano' ? Number(value) : value,
    }));
  };

  // Lida com a mudança de Quadrimestre
  const handleQuadChange = (e: any) => setFormData(prev => ({ ...prev, quadrimestre: e.target.value as 1 | 2 | 3 }));
  // Lida com a mudança de Tipo
  const handleTipoChange = (e: any) => setFormData(prev => ({ ...prev, tipo: e.target.value as DisciplinaUsuario['tipo'] }));
  // Lida com a mudança de Status (Planejada/Concluída)
  const handleStatusChange = (e: any, newStatus: string | null) => {
    if (newStatus) setFormData(prev => ({ ...prev, status: newStatus as DisciplinaUsuario['status'] }));
  };

  // Validação básica do formulário
  const validate = (): boolean => {
    if (!formData.catalogo) { setError("Selecione uma disciplina válida."); return false; }
    if (!formData.ano || formData.ano < 2000 || formData.ano > new Date().getFullYear() + 10) { setError("Ano inválido."); return false; }
    setError(null); return true;
  };

  // Envia os dados para adicionar ou atualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (disciplinaToEdit) {
        // Lógica de EDIÇÃO
        const payload: any = {
          ano: formData.ano,
          quadrimestre: formData.quadrimestre,
          tipo: formData.tipo,
          status: formData.status,
        };
        // Inclui nota apenas se for 'concluida'
        if (formData.status === 'concluida') {
          payload.nota = formData.nota || "";
        } else {
          // Remove a nota se o status mudar para 'planejada'
          payload.nota = deleteField();
        }
        await updateDisciplina(disciplinaToEdit.id, payload);
      } else {
        // Lógica de ADICIONAR
        const { catalogo, ...dadosUsuario } = formData;
        const dadosPayload: any = {
          codigo: catalogo!.codigo,
          nome: catalogo!.nome,
          creditos: catalogo!.creditos,
          ano: dadosUsuario.ano,
          quadrimestre: dadosUsuario.quadrimestre,
          tipo: dadosUsuario.tipo,
          status: dadosUsuario.status,
        };
        // Inclui nota se for 'concluida'
        if (dadosUsuario.status === 'concluida' && dadosUsuario.nota) {
          dadosPayload.nota = dadosUsuario.nota;
        }
        await addDisciplina(dadosPayload as DisciplinaUsuarioData);
      }
      onClose();
    } catch (err) {
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
      fullScreen={isMobile} // Usa tela cheia no mobile
      maxWidth="md"
      fullWidth
      PaperProps={{
        // Remove bordas arredondadas no modo tela cheia
        sx: { borderRadius: isMobile ? 0 : 4 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 6, bgcolor: isMobile ? 'primary.main' : 'inherit', color: isMobile ? 'white' : 'inherit' }}>
        <Typography variant="h6" component="div" fontWeight="medium">
          {disciplinaToEdit ? "Editar Disciplina" : "Adicionar Disciplina"}
        </Typography>
        {!isMobile && (
          <DialogContentText sx={{ fontSize: '0.875rem' }}>
            Preencha os dados para planejar a disciplina.
          </DialogContentText>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute', right: 12, top: 12,
            // Cor do ícone diferente se estiver no cabeçalho primário
            color: isMobile ? 'white' : (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" id="disciplina-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DialogContent dividers sx={{ p: 3, bgcolor: 'grey.50', flexGrow: 1 }}>
          <Grid container spacing={3}>
            {/* Coluna Principal do Formulário */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5}>
                {/* Seleção da Disciplina */}
                <Autocomplete
                  options={autocompleteOptions}
                  getOptionLabel={(option) => `[${option.codigo}] ${option.nome}`}
                  value={formData.catalogo}
                  onChange={handleAutocompleteChange}
                  // Não permite mudar a disciplina ao editar
                  disabled={!!disciplinaToEdit}
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  renderInput={(params) =>
                    <TextField {...params} label="Selecionar Disciplina" required error={!!error && !formData.catalogo} />
                  }
                  renderOption={(props, option) => {
                    const tipoPadraoCurso = getTipoPadrao(option.codigo, selectedCourse.id);
                    return (
                      <Box component="li" {...props} key={option.codigo} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{overflow: 'hidden', textOverflow: 'ellipsis', mr: 1}}>
                           <Typography variant="body2" noWrap>{option.nome}</Typography>
                           <Typography variant="caption" color="text.secondary">{option.codigo}</Typography>
                        </Box>
                        {/* Mostra o tipo sugerido ao lado */}
                        <Chip size="small" label={tipoPadraoCurso} />
                      </Box>
                    );
                  }}
                />

                {/* Ano e Quadrimestre */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField label="Ano" name="ano" type="number" value={formData.ano} onChange={handleChange} required fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Quadrimestre</InputLabel>
                      <Select label="Quadrimestre" name="quadrimestre" value={formData.quadrimestre} onChange={handleQuadChange}>
                        <MenuItem value={1}>1º Quad.</MenuItem>
                        <MenuItem value={2}>2º Quad.</MenuItem>
                        <MenuItem value={3}>3º Quad.</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Tipo e Status */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Tipo</InputLabel>
                      <Select label="Tipo" name="tipo" value={formData.tipo} onChange={handleTipoChange}>
                        <MenuItem value="obrigatoria">Obrigatória</MenuItem>
                        <MenuItem value="limitada">Limitada</MenuItem>
                        <MenuItem value="livre">Livre</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {/* Botões para selecionar Status */}
                    <ToggleButtonGroup value={formData.status} exclusive onChange={handleStatusChange} fullWidth color="primary">
                      <ToggleButton value="planejada">Planejada</ToggleButton>
                      <ToggleButton value="concluida">Concluída</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>

                {/* Input de Nota (visível apenas se for 'concluida') */}
                {formData.status === 'concluida' && (
                  <TextField label="Nota/Conceito" name="nota" value={formData.nota} onChange={handleChange} fullWidth />
                )}

                {error && <Alert severity="error">{error}</Alert>}
              </Stack>
            </Grid>

            {/* Coluna Lateral de Informações (Escondida no mobile) */}
            {!isMobile && (
              <Grid item md={5}>
                <Stack spacing={2}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Pré-visualização</Typography>
                    {formData.catalogo ? (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="h6" fontWeight="medium">{formData.catalogo.nome}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {formData.catalogo.codigo} • {formData.catalogo.creditos} créditos
                        </Typography>
                        <Chip label={`Tipo Sugerido: ${getTipoPadrao(formData.catalogo.codigo, selectedCourse.id)}`} size="small" variant="outlined" />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Selecione uma disciplina para ver os detalhes.</Typography>
                    )}
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlineIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="O tipo é sugerido pelo seu curso." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}><LightbulbOutlineIcon fontSize="small" color="info" /></ListItemIcon>
                        <ListItemText primary="Disciplinas 'Concluídas' vão para a seção Histórico." />
                      </ListItem>
                    </List>
                  </Paper>
                </Stack>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" form="disciplina-form" variant="contained" disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DisciplinaModal;