import type { CatalogoDisciplina } from "../types/types";

// Catálogo completo gerado a partir do PPC de Engenharia de Informação (UFABC)
export const CATALOGO_MESTRE: CatalogoDisciplina[] = [
  // ==========================================================
  // DISCIPLINAS OBRIGATÓRIAS (Tabela INFO2 + Fluxograma)
  // Total: 64 Disciplinas
  // ==========================================================

  // --- Núcleo BC&T (Amarelas no fluxograma) ---
  { codigo: "BCS0001-15", nome: "Base Experimental das Ciências Naturais", creditos: 3, prerequisitos: [] },
  { codigo: "BIJ0207-15", nome: "Bases Conceituais da Energia", creditos: 2, prerequisitos: [] },
  { codigo: "BIK0102-15", nome: "Estrutura da Matéria", creditos: 3, prerequisitos: [] },
  { codigo: "BIL0304-15", nome: "Evolução e Diversificação da Vida na Terra", creditos: 3, prerequisitos: [] },
  { codigo: "BIS0003-15", nome: "Bases Matemáticas", creditos: 4, prerequisitos: [] },
  { codigo: "BIS0005-15", nome: "Bases Computacionais da Ciência", creditos: 2, prerequisitos: [] },
  { codigo: "BCJ0204-15", nome: "Fenômenos Mecânicos", creditos: 5, prerequisitos: ["BCN0402-15", "BCN0404-15"] },
  { codigo: "BCL0306-15", nome: "Biodiversidade: Interações entre Organismos e Ambiente", creditos: 3, prerequisitos: [] },
  { codigo: "BCM0504-15", nome: "Natureza da Informação", creditos: 3, prerequisitos: ["BIS0005-15"] },
  { codigo: "BCN0402-15", nome: "Funções de Uma Variável", creditos: 4, prerequisitos: ["BIS0003-15"] },
  { codigo: "BCN0404-15", nome: "Geometria Analítica", creditos: 3, prerequisitos: [] },
  { codigo: "BCJ0205-15", nome: "Fenômenos Térmicos", creditos: 4, prerequisitos: ["BCJ0204-15"] },
  { codigo: "BCL0307-15", nome: "Transformações Químicas", creditos: 5, prerequisitos: ["BIK0102-15"] },
  { codigo: "BCM0505-15", nome: "Processamento da Informação", creditos: 5, prerequisitos: ["BCM0504-15", "BCN0402-15"] },
  { codigo: "BCN0407-15", nome: "Funções de Várias Variáveis", creditos: 4, prerequisitos: ["BCN0402-15", "BCN0404-15"] },
  { codigo: "BCJ0203-15", nome: "Fenômenos Eletromagnéticos", creditos: 5, prerequisitos: ["BCJ0204-15", "BCN0407-15"] },
  { codigo: "BCM0506-15", nome: "Comunicação e Redes", creditos: 3, prerequisitos: ["BCM0505-15"] },
  { codigo: "BCN0405-15", nome: "Introdução às Equações Diferenciais Ordinárias", creditos: 4, prerequisitos: ["BCN0407-15"] },
  { codigo: "BIN0406-15", nome: "Introdução à Probabilidade e à Estatística", creditos: 3, prerequisitos: ["BIS0003-15"] },
  { codigo: "BIR0004-15", nome: "Bases Epistemológicas da Ciência Moderna", creditos: 3, prerequisitos: [] },
  { codigo: "BCK0103-15", nome: "Física Quântica", creditos: 3, prerequisitos: ["BCS0001-15", "BCJ0203-15"] },
  { codigo: "BCL0308-15", nome: "Bioquímica: Estrutura, Propriedade e Funções de Biomoléculas", creditos: 5, prerequisitos: ["BCL0307-15"] },
  { codigo: "BIQ0602-15", nome: "Estrutura e Dinâmica Social", creditos: 3, prerequisitos: [] },
  { codigo: "BCK0104-15", nome: "Interações Atômicas e Moleculares", creditos: 3, prerequisitos: ["BCK0103-15"] },
  { codigo: "BIR0603-15", nome: "Ciência, Tecnologia e Sociedade", creditos: 3, prerequisitos: [] },
  { codigo: "BCS0002-15", nome: "Projeto Dirigido", creditos: 2, prerequisitos: [] }, // Pré-requisitos variam
  
  // --- Núcleo Comum Engenharias (Laranja no fluxograma) ---
  { codigo: "MCTB001-17", nome: "Álgebra Linear", creditos: 6, prerequisitos: ["BCN0404-15"] },
  { codigo: "MCTB009-17", nome: "Cálculo Numérico", creditos: 4, prerequisitos: ["BCN0405-15", "BCM0505-15"] },
  { codigo: "ESTO013-17", nome: "Engenharia Econômica", creditos: 4, prerequisitos: ["BCN0402-15"] },
  { codigo: "ESTO011-17", nome: "Fundamentos de Desenho Técnico", creditos: 2, prerequisitos: [] },
  { codigo: "ESTO005-17", nome: "Introdução às Engenharias", creditos: 2, prerequisitos: [] },
  { codigo: "ESTO006-17", nome: "Materiais e Suas Propriedades", creditos: 4, prerequisitos: ["BCL0307-15"] },
  { codigo: "ESTO008-17", nome: "Mecânica dos Sólidos I", creditos: 4, prerequisitos: ["BCJ0204-15"] },
  { codigo: "ESTO012-17", nome: "Princípios de Administração", creditos: 2, prerequisitos: [] },
  { codigo: "ESTO016-17", nome: "Fenômenos de Transporte", creditos: 4, prerequisitos: ["BCJ0205-15", "BCN0405-15"] },
  { codigo: "ESTO017-17", nome: "Métodos Experimentais em Engenharia", creditos: 4, prerequisitos: ["BIN0406-15"] },
  { codigo: "ESTO902-17", nome: "Engenharia Unificada 1", creditos: 2, prerequisitos: [] },
  { codigo: "ESTO903-17", nome: "Engenharia Unificada II", creditos: 2, prerequisitos: ["ESTO902-17"] },
  { codigo: "MCTA028-15", nome: "Programação Estruturada", creditos: 4, prerequisitos: ["BCM0505-15"] },
  
  // --- Específicas Eng. Informação (Cinza no fluxograma) ---
  { codigo: "ESTI016-17", nome: "Fundamentos de Fotônica", creditos: 4, prerequisitos: ["BCK0103-15"] },
  { codigo: "ESTA002-17", nome: "Circuitos Elétricos I", creditos: 5, prerequisitos: ["BCJ0203-15", "BCN0405-15"] },
  { codigo: "ESTI017-17", nome: "Fundamentos de Eletromagnetismo Aplicado", creditos: 4, prerequisitos: ["BCJ0203-15", "BCN0407-15"] }, // Nome na Tabela INFO2 é EST1017-17, mas no fluxograma é ESTI017-17. Usando o do fluxograma para consistência de fluxo.
  { codigo: "ESTA004-17", nome: "Circuitos Elétricos II", creditos: 5, prerequisitos: ["ESTA002-17", "ESTI017-17"] },
  { codigo: "ESTA001-17", nome: "Dispositivos Eletrônicos", creditos: 5, prerequisitos: ["ESTA002-17", "BCK0103-15"] },
  { codigo: "ESTA007-17", nome: "Eletrônica Analógica Aplicada", creditos: 5, prerequisitos: ["ESTA001-17"] },
  { codigo: "ESTI002-17", nome: "Eletrônica Digital", creditos: 6, prerequisitos: ["ESTA001-17"] }, // Nome na Tabela INFO2 é EST1002-17, mas no fluxograma é ESTI002-17. Usando o do fluxograma.
  { codigo: "ESTI003-17", nome: "Transformadas em Sinais e Sistemas Lineares", creditos: 4, prerequisitos: ["BCN0405-15", "MCTB001-17"] }, // Nome na Tabela INFO2 é EST1003-17, mas no fluxograma é ESTI003-17.
  { codigo: "ESTI004-17", nome: "Princípios de Comunicação", creditos: 4, prerequisitos: ["ESTI003-17"] }, // Nome na Tabela INFO2 é EST1004-17.
  { codigo: "ESTA003-17", nome: "Sistemas de Controle I", creditos: 5, prerequisitos: ["ESTI003-17"] },
  { codigo: "MCTA022-13", nome: "Redes de Computadores", creditos: 4, prerequisitos: ["BCM0506-15"] },
  { codigo: "ESTI005-17", nome: "Sinais Aleatórios", creditos: 4, prerequisitos: ["BIN0406-15", "ESTI003-17"] }, // Nome na Tabela INFO2 é EST1005-17.
  { codigo: "ESTI006-17", nome: "Processamento Digital de Sinais", creditos: 4, prerequisitos: ["ESTI003-17"] }, // Nome na Tabela INFO2 é EST1006-17.
  { codigo: "ESTI007-17", nome: "Comunicação Digital", creditos: 4, prerequisitos: ["ESTI004-17", "ESTI005-17"] }, // Nome na Tabela INFO2 é EST1007-17.
  { codigo: "ESTI008-17", nome: "Teoria da Informação e Códigos", creditos: 4, prerequisitos: ["ESTI005-17"] }, // Nome na Tabela INFO2 é EST1008-17.
  { codigo: "ESTI018-17", nome: "Ondas Eletromagnéticas Aplicadas", creditos: 4, prerequisitos: ["ESTI017-17"] }, // Nome na Tabela INFO2 é EST1018-17.
  { codigo: "ESTI010-17", nome: "Comunicações Ópticas", creditos: 4, prerequisitos: ["ESTI017-17", "ESTI004-17"] }, // Nome na Tabela INFO2 é EST1010-17.
  { codigo: "ESTI019-17", nome: "Codificação de Sinais Multimídia", creditos: 4, prerequisitos: ["MCTA022-13", "ESTI006-17"] }, // Nome na Tabela INFO2 é EST1019-17.
  { codigo: "ESTI013-17", nome: "Sistemas Microprocessados", creditos: 4, prerequisitos: ["ESTI002-17"] }, // Nome na Tabela INFO2 é EST1013-17.
  { codigo: "ESTI015-17", nome: "Comunicações Móveis", creditos: 4, prerequisitos: ["ESTI007-17", "ESTI018-17"] }, // Nome na Tabela INFO2 é EST1015-17.
  { codigo: "ESTI020-17", nome: "Teoria de Filas e Análise de Desempenho", creditos: 4, prerequisitos: ["ESTI005-17"] }, // Nome na Tabela INFO2 é EST1020-17.
  { codigo: "ESTI905-17", nome: "Estágio Curricular em Engenharia de Informação", creditos: 14, prerequisitos: [] }, // Nome na Tabela INFO2 é EST1905-17.
  { codigo: "ESTI902-17", nome: "Trabalho de Graduação I em Engenharia de Informação", creditos: 2, prerequisitos: [] }, // Nome na Tabela INFO2 é EST1902-17.
  { codigo: "ESTI903-17", nome: "Trabalho de Graduação II em Engenharia de Informação", creditos: 2, prerequisitos: ["ESTI902-17"] }, // Nome na Tabela INFO2 é EST1903-17.
  { codigo: "ESTI904-17", nome: "Trabalho de Graduação III em Engenharia de Informação", creditos: 2, prerequisitos: ["ESTI903-17"] }, // Nome na Tabela INFO2 é EST1904-17.

  // ==========================================================
  // DISCIPLINAS DE OPÇÃO LIMITADA (Tabela INFO3)
  // Total: 57 Disciplinas
  // Nota: O PPC (PDF) não especifica os pré-requisitos
  // para as disciplinas de Opção Limitada.
  // ==========================================================

  { codigo: "ESZ1027-17", nome: "Informação e Sociedade", creditos: 2, prerequisitos: [] },
  { codigo: "ESZ1002-17", nome: "Filtragem Adaptativa", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1003-17", nome: "Processamento de Informação em Línguas Naturais", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1028-17", nome: "TV Digital", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1029-17", nome: "Redes WAN de Banda Larga", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1030-17", nome: "Gerenciamento e Interoperabilidade de Redes", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI031-17", nome: "Segurança de Redes", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1032-17", nome: "Processamento de Vídeo", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI010-17", nome: "Simulação de Sistemas de Comunicação", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1033-17", nome: "Programação de Dispositivos Móveis", creditos: 2, prerequisitos: [] },
  { codigo: "ESZ1034-17", nome: "Jogos Digitais: Aspectos Técnicos e Aplicações", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI013-17", nome: "Informática Industrial", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI014-17", nome: "Sistemas Inteligentes", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1035-17", nome: "Introdução ao Processamento de Sinais de Voz e Áudio", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI016-17", nome: "Projeto de Filtros Digitais", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI017-17", nome: "Fundamentos de Processamento Gráfico", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI018-17", nome: "Tecnologia de Redes Ópticas", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1019-17", nome: "Sistemas de Micro-ondas", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1036-17", nome: "Projeto de Alta Frequência", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1037-17", nome: "Aplicações em Voz, Áudio e Acústica", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1022-17", nome: "Planejamento de Redes de Informação", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI023-17", nome: "Projeto de Sistemas de Comunicação", creditos: 3, prerequisitos: [] },
  { codigo: "ESZ1038-17", nome: "Projeto de Sistemas Multimídia", creditos: 3, prerequisitos: [] },
  { codigo: "ESZ1025-17", nome: "Aplicações de Microcontroladores", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI039-17", nome: "Propagação e Antenas", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1040-17", nome: "Telefonia Fixa e VOIP", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI041-18", nome: "Programação de Software Embarcado", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI026-17", nome: "Engenharia de Sistemas de Comunicação e Missão Crítica", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI042-17", nome: "Instrumentação em RF e Micro-ondas", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI043-17", nome: "Programação Baseada em Componentes para Jogos", creditos: 4, prerequisitos: [] },
  { codigo: "ESZI044-17", nome: "Fundamentos da Computação Semântica", creditos: 4, prerequisitos: [] },
  { codigo: "ESZ1045-17", nome: "Introdução à Linguística Computacional", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA018-13", nome: "Programação Orientada a Objetos", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA033-15", nome: "Engenharia de Software", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA001-17", nome: "Algoritmos e Estruturas de Dados I", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA002-17", nome: "Algoritmos e Estruturas de Dados II", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA034-17", nome: "Banco de Dados", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA004-17", nome: "Arquitetura de Computadores", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA026-13", nome: "Sistemas Operacionais", creditos: 5, prerequisitos: [] },
  { codigo: "MCTA025-13", nome: "Sistemas Distribuídos", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA032-14", nome: "Introdução à Programação de Jogos", creditos: 4, prerequisitos: [] },
  { codigo: "MCZB018-13", nome: "Introdução à Modelagem e Processos Estocásticos", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA011-17", nome: "Laboratório de Redes", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA023-17", nome: "Redes Convergentes", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA021-17", nome: "Projeto de Redes", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA025-13", nome: "Segurança em Redes", creditos: 4, prerequisitos: [] },
  { codigo: "ESZA017-17", nome: "Lógica Programável", creditos: 4, prerequisitos: [] },
  { codigo: "MCTB010-13", nome: "Cálculo Vetorial e Tensorial", creditos: 4, prerequisitos: [] },
  { codigo: "ESTO007-17", nome: "Mecânica dos Fluidos I", creditos: 4, prerequisitos: [] },
  { codigo: "EST0014-17", nome: "Termodinâmica Aplicada I", creditos: 4, prerequisitos: [] },
  { codigo: "EST0004-17", nome: "Instrumentação e Controle", creditos: 4, prerequisitos: [] },
  { codigo: "ESTO001-17", nome: "Circuitos Elétricos e Fotônica", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA024-17", nome: "Redes sem Fio", creditos: 4, prerequisitos: [] },
  { codigo: "MCZA018-17", nome: "Processamento Digital de Imagens", creditos: 4, prerequisitos: [] },
  { codigo: "MCTA014-15", nome: "Inteligência Artificial", creditos: 4, prerequisitos: [] },
  { codigo: "ESTA008-17", nome: "Sistemas de Controle II", creditos: 5, prerequisitos: [] },
  { codigo: "ESTA006-17", nome: "Fotônica", creditos: 4, prerequisitos: [] },
];