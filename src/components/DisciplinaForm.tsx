import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Autocomplete, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  FormLabel 
} from '@mui/material';
import type { CatalogoDisciplina, DisciplinaUsuario } from '../types/types';
import { TODAS_AS_DISCIPLINAS } from '../data/catalogoDisciplina';
import { useDisciplinas } from '../hooks/useDisciplinas';
import type { DisciplinaUsuarioData } from '../services/firestoreService';

interface DisciplinaFormProps {
  formId: string;
  disciplinaToEdit?: DisciplinaUsuario | null;
  onSuccess: () => void;
}

// Estado inicial do formulário
const getInitialState = (disciplina?: DisciplinaUsuario | null) => {
  if (disciplina) {
    // Modo de Edição
    return {
      catalogo: TODAS_AS_DISCIPLINAS.find(d => d.codigo === disciplina.codigo) || null,
      ano: disciplina.ano,
      quadrimestre: disciplina.quadrimestre,
      tipo: disciplina.tipo,
      status: disciplina.status,
      nota: disciplina.nota || '',
    };
  }
  
  // Modo de Adição
  return {
    catalogo: null as CatalogoDisciplina | null,
    ano: new Date().getFullYear(),
    quadrimestre: 1 as 1 | 2 | 3,
    tipo: 'obrigatoria' as DisciplinaUsuario['tipo'],
    status: 'planejada' as DisciplinaUsuario['status'],
    nota: '',
  };
};

const DisciplinaForm: React.FC<DisciplinaFormProps> = ({ formId, disciplinaToEdit, onSuccess }) => {
  const { addDisciplina, updateDisciplina } = useDisciplinas();
  const [formData, setFormData] = useState(getInitialState(disciplinaToEdit));
  const [loading, setLoading] = useState(false);

  // Popula o formulário se estivermos editando
  useEffect(() => {
    setFormData(getInitialState(disciplinaToEdit));
  }, [disciplinaToEdit]);

  // Handler para o Autocomplete
  const handleCatalogoChange = (event: any, newValue: CatalogoDisciplina | null) => {
    setFormData(prev => ({
      ...prev,
      catalogo: newValue,
      // Ao selecionar, atualiza o 'tipo' para o tipo padrão da disciplina
      tipo: newValue?.tipoPadrao || prev.tipo, 
    }));
  };

  // Handler genérico para outros campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.catalogo) {
      alert("Por favor, selecione uma disciplina.");
      return;
    }

    setLoading(true);

    const dadosPayload: DisciplinaUsuarioData = {
      codigo: formData.catalogo.codigo,
      nome: formData.catalogo.nome,
      creditos: formData.catalogo.creditos,
      ano: Number(formData.ano),
      quadrimestre: formData.quadrimestre,
      tipo: formData.tipo,
      status: formData.status,
      nota: formData.nota || undefined, // Salva undefined se estiver vazio
    };

    try {
      if (disciplinaToEdit) {
        // Modo Edição
        await updateDisciplina(disciplinaToEdit.id, dadosPayload);
      } else {
        // Modo Adição
        await addDisciplina(dadosPayload);
      }
      onSuccess(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar disciplina.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box component="form" id={formId} onSubmit={handleSubmit} sx={{ pt: 1 }}>
      <Grid container spacing={2}>
        
        {/* Recurso 5: Autocomplete */}
        <Grid item xs={12}>
          <Autocomplete
            options={TODAS_AS_DISCIPLINAS}
            getOptionLabel={(option) => `[${option.codigo}] ${option.nome}`}
            value={formData.catalogo}
            onChange={handleCatalogoChange}
            disabled={loading || !!disciplinaToEdit} // Desativa se estiver editando
            renderInput={(params) => 
              <TextField {...params} label="Selecionar Disciplina" required />
            }
          />
        </Grid>
        
        <Grid item xs={6} sm={4}>
          <TextField
            label="Ano"
            name="ano"
            type="number"
            value={formData.ano}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <FormControl fullWidth required disabled={loading}>
            <InputLabel id="quad-label">Quadrimestre</InputLabel>
            <Select
              labelId="quad-label"
              label="Quadrimestre"
              name="quadrimestre"
              value={formData.quadrimestre}
              onChange={handleChange as any}
            >
              <MenuItem value={1}>1º Quad.</MenuItem>
              <MenuItem value={2}>2º Quad.</MenuItem>
              <MenuItem value={3}>3º Quad.</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required disabled={loading}>
            <InputLabel id="tipo-label">Tipo</InputLabel>
            <Select
              labelId="tipo-label"
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange as any}
            >
              <MenuItem value="obrigatoria">Obrigatória</MenuItem>
              <MenuItem value="limitada">Limitada</MenuItem>
              <MenuItem value="livre">Livre</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" disabled={loading}>
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              row
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <FormControlLabel value="planejada" control={<Radio />} label="Planejada" />
              <FormControlLabel value="concluida" control={<Radio />} label="Concluída" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Campo de Nota, só aparece se status for 'concluida' */}
        {formData.status === 'concluida' && (
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nota/Conceito (Opcional)"
              name="nota"
              value={formData.nota}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
        )}

      </Grid>
    </Box>
  );
};

export default DisciplinaForm;