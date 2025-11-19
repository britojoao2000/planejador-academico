// Em src/hooks/useCourse.ts
import { useContext } from 'react';
import { CourseContext } from '../context/CourseContext';

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse deve ser usado dentro de um CourseProvider');
  }
  return context;
};