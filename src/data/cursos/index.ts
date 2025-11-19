// Em src/data/cursos/index.ts
// Em src/data/cursos/index.ts
import type { DefinicaoCurso } from "../../types/types";
import { EngInformacao } from "./eng-informação";
import { EngIar } from "./eng-iar";
import { BCC } from "./bcc";

// Mapa de todos os cursos
export const TODOS_OS_CURSOS = new Map<string, DefinicaoCurso>([
  [EngInformacao.id, EngInformacao],
  [EngIar.id, EngIar],
  [BCC.id, BCC]
]);

export const getListaDeCursos = () => {
  return Array.from(TODOS_OS_CURSOS.values()).map(curso => ({
    id: curso.id,
    nome: curso.nome,
  }));
};

export const getDefinicaoCurso = (id: string): DefinicaoCurso | undefined => {
  return TODOS_OS_CURSOS.get(id);
};

// --- ESTA FUNÇÃO É CRUCIAL PARA O DASHBOARD ---
export const getTipoPadrao = (codigo: string, cursoId: string): 'obrigatoria' | 'limitada' | 'livre' => {
  const curso = getDefinicaoCurso(cursoId);
  
  // Se o curso não existir, assume livre
  if (!curso) return 'livre';

  if (curso.obrigatorias.includes(codigo)) {
    return 'obrigatoria';
  }
  if (curso.limitadas.includes(codigo)) {
    return 'limitada';
  }
  return 'livre';
};