import { useContext } from 'react';
import { DisciplinasContext } from '../context/DisciplinasContext';

export const useDisciplinas = () => {
  const context = useContext(DisciplinasContext);
  if (!context) {
    throw new Error('useDisciplinas deve ser usado dentro de um DisciplinasProvider');
  }
  return context;
};