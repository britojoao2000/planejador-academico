// Em src/types/types.ts

// 1. ATUALIZE ESTA INTERFACE (remova tipoPadrao)
export interface CatalogoDisciplina {
  codigo: string; 
  nome: string;
  creditos: number;
  prerequisitos: string[]; // Array de códigos de disciplinas
}

// 2. ADICIONE ESTA NOVA INTERFACE
export interface DefinicaoCurso {
  id: string; // ex: "eng-informacao"
  nome: string; // ex: "Engenharia de Informação"
  totalObrigatorias: number;
  totalLimitadas: number;
  totalLivres: number;
  obrigatorias: string[]; // Array de códigos, ex: ["BCS0001-15", ...]
  limitadas: string[]; // Array de códigos, ex: ["ESZ1027-17", ...]
}

// Interface DisciplinaUsuario (permanece a mesma)
export interface DisciplinaUsuario {
  id: string; 
  codigo: string; 
  nome: string; 
  creditos: number; 
  ano: number;
  quadrimestre: 1 | 2 | 3;
  tipo: 'obrigatoria' | 'limitada' | 'livre'; // Este campo é definido pelo *usuário*
  status: 'concluida' | 'planejada';
  nota?: string; 
}