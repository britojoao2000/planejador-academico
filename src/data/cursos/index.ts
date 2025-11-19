import type { DefinicaoCurso } from "../../types/types";
import { EngInformacao } from "./eng-informação";
import { EngIar } from "./eng-iar";
import { BCC } from "./bcc";

// Guarda todos os cursos disponíveis mapeados pelo seu ID
export const TODOS_OS_CURSOS = new Map<string, DefinicaoCurso>([
  [EngInformacao.id, EngInformacao],
  [EngIar.id, EngIar],
  [BCC.id, BCC]
]);

// Pega a lista de cursos (ID e Nome) para exibição simples
export const getListaDeCursos = () => {
  return Array.from(TODOS_OS_CURSOS.values()).map(curso => ({
    id: curso.id,
    nome: curso.nome,
  }));
};

// Busca a definição completa de um curso pelo ID
export const getDefinicaoCurso = (id: string): DefinicaoCurso | undefined => {
  return TODOS_OS_CURSOS.get(id);
};

// Determina o tipo padrão da disciplina (obrigatória/limitada/livre)
export const getTipoPadrao = (codigo: string, cursoId: string): 'obrigatoria' | 'limitada' | 'livre' => {
  const curso = getDefinicaoCurso(cursoId);
  
  // Se não encontrar o curso, a disciplina é considerada livre
  if (!curso) return 'livre';

  if (curso.obrigatorias.includes(codigo)) {
    return 'obrigatoria';
  }
  if (curso.limitadas.includes(codigo)) {
    return 'limitada';
  }
  return 'livre';
};