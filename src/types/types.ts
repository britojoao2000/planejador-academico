// Interface para o catálogo estático de disciplinas
export interface CatalogoDisciplina {
  codigo: string; 
  nome: string;
  creditos: number;
  tipoPadrao: 'obrigatoria' | 'limitada' | 'livre';
  prerequisitos: string[]; // Array de códigos de disciplinas
}

// Interface para os dados do usuário salvos no Firestore
export interface DisciplinaUsuario {
  id: string; // ID do documento no Firestore
  codigo: string; // Chave para conectar ao catálogo
  nome: string; // Salvo para referência rápida
  creditos: number; // Salvo para referência rápida
  
  // Dados específicos do usuário
  ano: number;
  quadrimestre: 1 | 2 | 3;
  tipo: 'obrigatoria' | 'limitada' | 'livre';
  status: 'concluida' | 'planejada';
  nota?: string; // Opcional
}