import type { DefinicaoCurso } from "../../types/types";

export const BCC: DefinicaoCurso = {
  id: "bcc",
  nome: "Bacharelado em Ciência da Computação",

  // Créditos totais: (90 do BC&T + 124 do BCC = 214)
  totalObrigatorias: 214,
  totalLimitadas: 30,
  totalLivres: 12,

  obrigatorias: [
    // --- Disciplinas Obrigatórias do BC&T (Base Comum) ---
    "BIS0005-15", // Bases Computacionais
    "BIJ0207-15", // Bases Conceituais da Energia
    "BIR0004-15", // Bases Epistemológicas
    "BCS0001-15", // Base Experimental
    "BIS0003-15", // Bases Matemáticas
    "BCL0306-15", // Biodiversidade
    "BCL0308-15", // Bioquímica
    "BIR0603-15", // Ciência, Tecnologia e Sociedade
    "BCM0506-15", // Comunicação e Redes
    "BIK0102-15", // Estrutura da Matéria
    "BIQ0602-15", // Estrutura e Dinâmica Social
    "BIL0304-15", // Evolução e Diversificação da Vida
    "BCJ0203-15", // Fenômenos Eletromagnéticos
    "BCJ0204-15", // Fenômenos Mecânicos
    "BCJ0205-15", // Fenômenos Térmicos
    "BCK0103-15", // Física Quântica
    "BCN0402-15", // Funções de Uma Variável
    "BCN0407-15", // Funções de Várias Variáveis
    "BCN0404-15", // Geometria Analítica
    "BCK0104-15", // Interações Atômicas e Moleculares
    "BIN0406-15", // Introdução à Probabilidade e Estatística
    "BCN0405-15", // Introdução às Equações Diferenciais
    "BCM0504-15", // Natureza da Informação
    "BCM0505-15", // Processamento da Informação
    "BCS0002-15", // Projeto Dirigido
    "BCL0307-15", // Transformações Químicas

    // --- Disciplinas Obrigatórias do BCC (Núcleo Específico) ---
    "MCTB001-17", // Algebra Linear
    "MCTA001-17", // Algoritmos e Estruturas de Dados I
    "MCTA002-17", // Algoritmos e Estruturas de Dados II
    "MCTA003-17", // Análise de Algoritmos
    "MCTA004-17", // Arquitetura de Computadores
    "MCTA037-17", // Banco de Dados
    "MCTA006-17", // Circuitos Digitais
    "MCTA007-17", // Compiladores
    "MCTA008-17", // Computação Gráfica
    "MCTA009-13", // Computadores, Ética e Sociedade
    "MCTA033-15", // Engenharia de Software
    "MCTA014-15", // Inteligência Artificial
    "MCTA015-13", // Linguagens Formais e Autômatos
    "NHI2049-13", // Lógica Básica
    "MCTB019-17", // Matemática Discreta
    "MCTA016-13", // Paradigmas de Programação
    "MCTA028-15", // Programação Estruturada
    "MCTA017-17", // Programação Matemática
    "MCTA018-13", // Programação Orientada a Objetos
    "MCTA029-17", // Projeto de Graduação I
    "MCTA030-17", // Projeto de Graduação II
    "MCTA031-17", // Projeto de Graduação III
    "MCTA022-17", // Redes de Computadores
    "MCTA023-17", // Segurança de Dados
    "MCTA024-13", // Sistemas Digitais
    "MCTA025-13", // Sistemas Distribuídos
    "MCTA026-13", // Sistemas Operacionais
    "MCTA027-17", // Teoria dos Grafos
  ],
  limitadas: [
    // --- Disciplinas de Opção Limitada ---
    "MCZA035-17", // Algoritmos Probabilísticos
    "MCZA036-17", // Análise de Algoritmos II
    "MCZA001-13", // Análise de Projetos
    "MCTB007-17", // Anéis e Corpos
    "MCZA002-17", // Aprendizado de Máquina
    "MCZA003-17", // Arquitetura de Computadores de Alto Desempenho
    "MCZA004-13", // Avaliação de Desempenho de Redes
    "MCZA005-17", // Banco de Dados de Apoio à Decisão
    "MCTB009-17", // Cálculo Numérico
    "MCZA037-17", // Combinatória Extremal
    "MCZA006-17", // Computação Evolutiva e Conexionista
    "ESZG013-17", // Empreendedorismo
    "MCZA007-13", // Empreendedorismo e Desenvolvimento de Negócios
    "MCZA051-17", // Estágio Supervisionado
    "ESZI030-17", // Gerenciamento e Interoperabilidade de Redes
    "MCZA016-17", // Gestão de projetos de software
    "ESZG019-17", // Gestão Estratégica e Organizacional
    "MCTB018-17", // Grupos
    "MCZB012-13", // Inferência Estatística
    "ESZI013-17", // Informática Industrial
    "MCZA008-17", // Interação Humano-Computador
    "ESZB022-17", // Introdução à Bioinformática
    "MCZB015-13", // Introdução à Criptografia
    "MCZB018-13", // Introdução à Modelagem Estocástica
    "MCTC021-15", // Introdução à Neurociência Computacional
    "MCZA032-17", // Introdução à Programação de Jogos
    "ESZI034-17", // Jogos Digitais
    "MCZA010-13", // Laboratório de Engenharia de Software
    "MCZA011-17", // Laboratório de Redes
    "MCZA012-13", // Laboratório de Sistemas Operacionais
    "MCZA013-13", // Lógicas não Clássicas
    "MCZA014-17", // Métodos de Otimização
    "MCZA015-13", // Mineração de Dados
    "ESTG013-17", // Pesquisa Operacional
    "ESZI022-17", // Planejamento de Redes
    "MCZA038-17", // Prática Avançada de Programação A
    "MCZA039-17", // Prática Avançada de Programação B
    "MCZA040-17", // Prática Avançada de Programação C
    "MCZA041-17", // Processamento de Imagens (GPU)
    "MCZA017-13", // Processamento de Linguagem Natural
    "MCTC022-15", // Processamento de Sinais Neurais
    "MCZA018-17", // Processamento Digital de Imagens
    "MCZA042-17", // Desenvolvimento de Softwares Educacionais
    "MCZA033-17", // Programação Avançada para Dispositivos Móveis
    "ESZI033-17", // Programação de Dispositivos Móveis
    "MCZA019-17", // Programação para Web
    "MCZA020-13", // Programação Paralela
    "MCZA034-17", // Programação Segura
    "MCZA021-17", // Projeto de Redes
    "MCZA022-17", // Projeto Interdisciplinar
    "MCZA023-17", // Redes Convergentes
    "ESZI029-17", // Redes WAN de Banda Larga
    "MCZA024-17", // Redes sem Fio
    "MCZA044-17", // Robótica e Sistemas Inteligentes
    "MCZA045-17", // Robótica Educacional
    "MCZA025-13", // Segurança em Redes
    "MCZA046-17", // Semântica de Linguagem de Programação
    "MCZA026-17", // Sistemas de Gerenciamento de Banco de Dados
    "MCZA027-17", // Sistemas de Informação
    "ESZI014-17", // Sistemas Inteligentes
    "MCZA028-13", // Sistemas Multiagentes
    "MCZA029-13", // Sistemas Multimídia
    "MCZA047-17", // Sistemas Multi-Robôs Sociais
    "MCZA050-15", // Técnicas Avançadas de Programação
    "NHZ5019-15", // TI e Comunicação na Educação
    "MCZB033-17", // Teoria da Recursão e Computabilidade
    "MCZA048-17", // Teoria Espectral de Grafos
    "MCZA049-17", // Tópicos Emergentes em Banco de Dados
    "MCZA030-17", // Vida Artificial na Computação
    "ESZA019-17", // Visão Computacional
    "MCZA031-13", // Web Semântica
  ],
};