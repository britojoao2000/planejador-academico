import type { DefinicaoCurso } from "../../types/types";

export const EngInformacao: DefinicaoCurso = {
  id: "eng-informacao",
  nome: "Engenharia de Informação",
  
  // Créditos totais necessários
  totalObrigatorias: 245,
  totalLimitadas: 28,
  totalLivres: 27,
  
  obrigatorias: [
    // --- Disciplinas Obrigatórias (Núcleo Comum) ---
    "BCS0001-15", // Base Experimental das Ciências Naturais
    "BIJ0207-15", // Bases Conceituais da Energia
    "BIK0102-15", // Estrutura da Matéria
    "BIL0304-15", // Evolução e Diversificação da Vida na Terra
    "BIS0003-15", // Bases Matemáticas
    "BIS0005-15", // Bases Computacionais da Ciência
    "BCJ0204-15", // Fenômenos Mecânicos
    "BCL0306-15", // Biodiversidade
    "BCM0504-15", // Natureza da Informação
    "BCN0402-15", // Funções de Uma Variável
    "BCN0404-15", // Geometria Analítica
    "BCJ0205-15", // Fenômenos Térmicos
    "BCL0307-15", // Transformações Químicas
    "BCM0505-15", // Processamento da Informação
    "BCN0407-15", // Funções de Várias Variáveis
    "BCJ0203-15", // Fenômenos Eletromagnéticos
    "BCM0506-15", // Comunicação e Redes
    "BCN0405-15", // Introdução às Equações Diferenciais Ordinárias
    "BIN0406-15", // Introdução à Probabilidade e à Estatística
    "BIR0004-15", // Bases Epistemológicas
    "BCK0103-15", // Física Quântica
    "BCL0308-15", // Bioquímica
    "BIQ0602-15", // Estrutura e Dinâmica Social
    "BCK0104-15", // Interações Atômicas e Moleculares
    "BIR0603-15", // Ciência, Tecnologia e Sociedade
    "BCS0002-15", // Projeto Dirigido

    // --- Disciplinas Obrigatórias (Específicas) ---
    "MCTB001-17", // Álgebra Linear
    "MCTB009-17", // Cálculo Numérico
    "ESTO013-17", // Engenharia Econômica
    "ESTO011-17", // Fundamentos de Desenho Técnico
    "ESTO005-17", // Introdução às Engenharias
    "ESTO006-17", // Materiais e Suas Propriedades
    "ESTO008-17", // Mecânica dos Sólidos I
    "ESTO012-17", // Princípios de Administração
    "ESTO016-17", // Fenômenos de Transporte
    "ESTO017-17", // Métodos Experimentais em Engenharia
    "ESTO902-17", // Engenharia Unificada I
    "ESTO903-17", // Engenharia Unificada II
    "MCTA028-15", // Programação Estruturada
    "ESTI016-17", // Eletricidade e Magnetismo
    "ESTA002-17", // Circuitos Elétricos I
    "ESTI017-17", // Circuitos Elétricos e Eletroeletrônicos
    "ESTA004-17", // Circuitos Elétricos II
    "ESTA001-17", // Dispositivos Eletrônicos
    "ESTA007-17", // Eletrônica Analógica Aplicada
    "ESTI002-17", // Análise e Processamento de Sinais
    "ESTI003-17", // Sistemas de Comunicação
    "ESTI004-17", // Sistemas de Controle
    "ESTA003-17", // Sistemas de Controle I
    "MCTA022-13", // Redes de Computadores
    "ESTI005-17", // Sistemas Distribuídos
    "ESTI006-17", // Engenharia de Software I
    "ESTI007-17", // Sistemas de Banco de Dados
    "ESTI008-17", // Engenharia de Software II
    "ESTI018-17", // Processamento Digital de Imagens
    "ESTI010-17", // Engenharia de Sistemas
    "ESTI019-17", // Sistemas Operacionais
    "ESTI013-17", // Sistemas Microprocessados
    "ESTI015-17", // Redes de Computadores e Internet
    "ESTI020-17", // Laboratório de Sistemas de Comunicação
    "ESTI905-17", // Estágio Curricular
    "ESTI902-17", // Trabalho de Graduação I
    "ESTI903-17", // Trabalho de Graduação II
    "ESTI904-17", // Trabalho de Graduação III
  ],
  limitadas: [
    // --- Disciplinas de Opção Limitada ---
    "ESZ1027-17", // Sistemas de Comunicação Digital
    "ESZ1002-17", // Comunicações Ópticas
    "ESZ1003-17", // Comunicações Móveis
    "ESZ1028-17", // Sistemas de Rádio
    "ESZ1029-17", // Laboratório de Comunicações I
    "ESZ1030-17", // Laboratório de Comunicações II
    "ESZI031-17", // Introdução ao Projeto de Sistemas
    "ESZ1032-17", // Introdução ao Processamento de Sinais
    "ESZI010-17", // Processamento de Sinais Multimídia
    "ESZ1033-17", // Introdução a Instrumentação
    "ESZ1034-17", // Instrumentação Eletrônica
    "ESZI013-17", // Informática Industrial
    "ESZI014-17", // Sistemas Inteligentes
    "ESZ1035-17", // Eletrônica de Potência
    "ESZI016-17", // Projeto de Filtros Digitais
    "ESZI017-17", // Tópicos Especiais em Sistemas
    "ESZI018-17", // Tópicos Especiais em Telecomunicações
    "ESZ1019-17", // Tópicos Especiais em Redes
    "ESZ1036-17", // Projeto de Hardware Digital
    "ESZ1037-17", // Sistemas Embarcados
    "ESZ1022-17", // Sistemas de Informação
    "ESZI023-17", // Gestão de Projetos
    "ESZ1038-17", // Introdução à Teoria da Informação
    "ESZ1025-17", // Aplicações de Microcontroladores
    "ESZI039-17", // Tópicos Especiais em Informação
    "ESZ1040-17", // Segurança em Sistemas
    "ESZI041-18", // Tópicos em Desenvolvimento Ágil
    "ESZI026-17", // Projeto de Sistemas
    "ESZI042-17", // Tópicos em Internet das Coisas
    "ESZI043-17", // Sistemas de Informação Geográfica
    "ESZI044-17", // Sistemas de Recomendação
    "ESZ1045-17", // Tópicos em Otimização
    "MCTA018-13", // Programação Orientada a Objetos
    "MCTA033-15", // Engenharia de Software
    "MCTA001-17", // Algoritmos e Estruturas de Dados I
    "MCTA002-17", // Algoritmos e Estruturas de Dados II
    "MCTA034-17", // Organização de Computadores
    "MCTA004-17", // Arquitetura de Computadores
    "MCTA026-13", // Sistemas Operacionais
    "MCTA025-13", // Sistemas Distribuídos
    "MCZA032-14", // Introdução à Programação de Jogos
    "MCZB018-13", // Introdução à Modelagem Estocástica
    "MCZA011-17", // Laboratório de Redes
    "MCZA023-17", // Redes Convergentes
    "MCZA021-17", // Projeto de Redes
    "MCZA025-13", // Segurança em Redes
    "ESZA017-17", // Lógica Programável
    "MCTB010-13", // Cálculo Vetorial e Tensorial
    "ESTO007-17", // Materiais de Construção Mecânica
    "EST0014-17", // Sistemas de Conversão de Energia
    "EST0004-17", // Instrumentação e Controle
    "ESTO001-17", // Circuitos Elétricos e Fotônica
    "MCZA024-17", // Redes sem Fio
    "MCZA018-17", // Processamento Digital de Imagens
    "MCTA014-15", // Inteligência Artificial
    "ESTA008-17", // Sistemas de Controle II
    "ESTA006-17", // Fotônica
  ],
};