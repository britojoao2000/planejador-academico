// Em src/context/CourseContext.tsx
import React, { createContext, useState, useMemo } from 'react';
import type { DefinicaoCurso } from '../types/types';
import { getDefinicaoCurso, getListaDeCursos } from '../data/cursos';

// Pega o primeiro curso da lista como padrão
const listaCursos = getListaDeCursos();
const defaultCursoId = listaCursos[0]?.id || 'eng-informacao';
const defaultCurso = getDefinicaoCurso(defaultCursoId)!;

interface CourseContextType {
  cursosDisponiveis: { id: string, nome: string }[];
  selectedCourse: DefinicaoCurso;
  selectCourse: (id: string) => void;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursoId, setCursoId] = useState(defaultCursoId);

  const selectedCourse = useMemo(() => {
    return getDefinicaoCurso(cursoId) || defaultCurso;
  }, [cursoId]);

  const selectCourse = (id: string) => {
    setCursoId(id);
  };

  return (
    <CourseContext.Provider 
      value={{ 
        cursosDisponiveis: listaCursos, 
        selectedCourse, 
        selectCourse 
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};