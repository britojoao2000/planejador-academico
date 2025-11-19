import React, { createContext, useState, useMemo } from 'react';
import type { DefinicaoCurso } from '../types/types';
import { getDefinicaoCurso, getListaDeCursos } from '../data/cursos';

// Pega a lista de cursos e define o padrão
const listaCursos = getListaDeCursos();
// 'eng-informacao' é o fallback se a lista estiver vazia
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

  // Garante que selectedCourse é atualizado apenas quando cursoId muda
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