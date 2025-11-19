import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { type DisciplinaUsuario } from '../types/types';

// Define os tipos de filtro possíveis
export type TipoFiltro = 'todas' | DisciplinaUsuario['tipo'];

interface FilterBarProps {
  filtroTipo: TipoFiltro;
  // Função chamada quando o filtro muda
  onFiltroTipoChange: (tipo: TipoFiltro) => void;
}

// Componente da barra de filtros
const FilterBar: React.FC<FilterBarProps> = ({ filtroTipo, onFiltroTipoChange }) => {

  // Lida com a mudança na seleção do filtro
  const handleChange = (event: SelectChangeEvent) => {
    // Chama a função passada como prop com o novo valor
    onFiltroTipoChange(event.target.value as TipoFiltro);
  };

  return (
    // Container do filtro com estilos básicos
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
          {/* Opções de filtro */}
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