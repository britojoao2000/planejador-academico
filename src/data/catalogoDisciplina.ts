import { CatalogoDisciplina } from "../types/types";

// Pré-popular com alguns exemplos
export const TODAS_AS_DISCIPLINAS: CatalogoDisciplina[] = [
  { 
    codigo: "BC0101", 
    nome: "Base Experimental das Ciências", 
    creditos: 4, 
    tipoPadrao: 'obrigatoria', 
    prerequisitos: [] 
  },
  { 
    codigo: "BC0102", 
    nome: "Introdução à Computação", 
    creditos: 4, 
    tipoPadrao: 'obrigatoria', 
    prerequisitos: [] 
  },
  { 
    codigo: "BC0201", 
    nome: "Estrutura da Matéria", 
    creditos: 3, 
    tipoPadrao: 'obrigatoria', 
    prerequisitos: ["BC0101"] 
  },
  { 
    codigo: "BC0305", 
    nome: "Cálculo I", 
    creditos: 5, 
    tipoPadrao: 'obrigatoria', 
    prerequisitos: [] 
  },
  { 
    codigo: "BC0306", 
    nome: "Geometria Analítica", 
    creditos: 4, 
    tipoPadrao: 'obrigatoria', 
    prerequisitos: [] 
  },
  { 
    codigo: "BC1307", 
    nome: "Cálculo II", 
    creditos: 5, 
    tipoPadrao: 'obrigatoria', 
    prerequisitos: ["BC0305", "BC0306"] 
  },
  { 
    codigo: "MCTA01", 
    nome: "Inteligência Artificial", 
    creditos: 4, 
    tipoPadrao: 'limitada', 
    prerequisitos: ["BC0102", "BC0305"] 
  },
  { 
    codigo: "MCTA02", 
    nome: "Banco de Dados", 
    creditos: 4, 
    tipoPadrao: 'limitada', 
    prerequisitos: ["BC0102"] 
  },
  { 
    codigo: "LE0101", 
    nome: "Libras", 
    creditos: 2, 
    tipoPadrao: 'livre', 
    prerequisitos: [] 
  },
];