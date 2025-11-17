import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { type DisciplinaUsuario } from '../types/types';

export type TipoFiltro = 'todas' | DisciplinaUsuario['tipo'];

interface FilterBarProps {
  filtroTipo: TipoFiltro;
  onFiltroTipoChange: (tipo: TipoFiltro) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filtroTipo, onFiltroTipoChange }) => {
  
  const handleChange = (event: SelectChangeEvent) => {
    onFiltroTipoChange(event.target.value as TipoFiltro);
  };

  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <FormControl size="small">
        <InputLabel id="filtro-tipo-label">Filtrar por Tipo</InputLabel>
        <Select
          labelId="filtro-tipo-label"
          id="filtro-tipo"
          value={filtroTipo}
          label="Filtrar por Tipo"
          onChange={handleChange}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="todas">Todos os Tipos</MenuItem>
          <MenuItem value="obrigatoria">Obrigatória</MenuItem>
          <MenuItem value="limitada">Limitada</MenuItem>
          <MenuItem value="livre">Livre</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;