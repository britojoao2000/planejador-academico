import type { DefinicaoCurso } from "../../types/types";

export const EngIar: DefinicaoCurso = {
  id: "eng-iar",
  nome: "Engenharia de IAR",
  
  // Totais baseados na Tabela EIAR1
  totalObrigatorias: 254,
  totalLimitadas: 23,
  totalLivres: 23,

  obrigatorias: [
    // Baseado na Tabela EIAR2: Disciplinas Obrigatórias
    "BCJ0204-15", // Fenômenos Mecânicos
    "BCJ0205-15", // Fenômenos Térmicos
    "BCJ0203-15", // Fenômenos Eletromagnéticos
    "BIJ0207-15", // Bases Conceituais da Energia
    "BIL0304-15", // Evolução e Diversificação da Vida na Terra
    "BCL0307-15", // Transformações Químicas
    "BCL0306-15", // Biodiversidade: Interações entre Organismos e Ambiente
    "BCN0404-15", // Geometria Analítica
    "BCN0402-15", // Funções de Uma Variável
    "BCN0407-15", // Funções de Várias Variáveis
    "BCN0405-15", // Introdução às Equações Diferenciais Ordinárias
    "BIN0406-15", // Introdução à Probabilidade e à Estatística
    "BCM0504-15", // Natureza da Informação
    "BCM0505-15", // Processamento da Informação
    "BCM0506-15", // Comunicação e Redes
    "BIK0102-15", // Estrutura da Matéria
    "BCK0103-15", // Física Quântica
    "BCK0104-15", // Interações Atômicas e Moleculares
    "BCL0308-15", // Bioquímica: Estrutura, Propriedade e Funções de Biomoléculas
    "BIR0004-15", // Bases Epistemológicas da Ciência Moderna
    "BIQ0602-15", // Estrutura e Dinâmica Social
    "BIR0603-15", // Ciência, Tecnologia e Sociedade
    "BCS0001-15", // Base Experimental das Ciências Naturais
    "BCS0002-15", // Projeto Dirigido
    "BIS0005-15", // Bases Computacionais da Ciência
    "BIS0003-15", // Bases Matemáticas
    "MCTB001-17", // Álgebra Linear
    "MCTB009-17", // Cálculo Numérico
    "MCTB010-13", // Cálculo Vetorial e Tensorial
    "ESTO013-17", // Engenharia Econômica
    "ESTO011-17", // Fundamentos de Desenho Técnico
    "ESTO005-17", // Introdução às Engenharias
    "EST0006-17", // Materiais e Suas Propriedades
    "EST0008-17", // Mecânica dos Sólidos I
    "ESTO012-17", // Princípios de Administração
    "ESTO014-17", // Termodinâmica Aplicada
    "ESTO015-17", // Mecânica dos Fluidos I
    "ESTO017-17", // Métodos Experimentais em Engenharia
    "ESTA019-17", // Projeto Assistido por Computador
    "ESTA018-17", // Eletromagnetismo Aplicado
    "ESTA020-17", // Modelagem e Controle
    "EST0902-17", // Engenharia Unificada I
    "EST0903-17", // Engenharia Unificada II
    "ESTA001-17", // Dispositivos Eletrônicos
    "ESTA002-17", // Circuitos Elétricos 1
    "ESTA003-17", // Sistemas de Controle I
    "ESTA004-17", // Circuitos Elétricos II
    "ESTA005-17", // Analise de Sistemas Dinâmicos Lineares
    "ESTA006-17", // Fotônica
    "ESTA007-17", // Eletrônica Analógica Aplicada
    "ESTA008-17", // Sistemas de Controle II
    "ESTA021-17", // Introdução ao Controle Discreto
    "ESTA016-17", // Máquinas Elétricas
    "ESTA010-17", // Sensores e Transdutores
    "ESTA011-17", // Automação de Sistemas Industriais
    "ESTA022-17", // Teoria de Acionamentos Elétricos
    "ESTA017-17", // Laboratório de Máquinas Elétricas
    "ESTA013-17", // Fundamentos de Robótica
    "ESTA014-17", // Sistemas CAD/CAM
    "ESTA023-17", // Introdução aos Processos de Fabricação
    "EST1003-17", // Transformadas em Sinais e Sistemas Lineares
    "EST1006-17", // Processamento Digital de Sinais
    "ESTI013-17", // Sistemas Microprocessados
    "EST1002-17", // Eletrônica Digital
    "ESTA905-17", // Estágio Curricular em Engenharia de Instrumentação, Automação e Robótica
    "ESTA902-17", // Trabalho de Graduação I
    "ESTA903-17", // Trabalho de Graduação II
    "ESTA904-17", // Trabalho de Graduação III
  ],
  limitadas: [
    // Baseado na Tabela EIAR3: Disciplinas de Opção Limitada
    "ESZA023-17", // Introdução ao Controle Moderno
    "ESZA002-17", // Controle Robusto Multivariável
    "ESZA003-17", // Controle Não-Linear
    "ESZA024-17", // Projeto de Controle Discreto
    "ESZA005-17", // Processadores Digitais em Controle e Automação
    "ESZA006-17", // Teoria de Controle Ótimo
    "ESZA007-17", // Confiabilidade de Componentes e Sistemas
    "ESZA008-17", // Circuitos Hidráulicos e Pneumáticos
    "ESZA009-17", // Redes de Barramento de Campo
    "ESZI013-17", // Informática Industrial
    "ESZA010-17", // Servo-Sistema para Robôs e Acionamento para Sistemas Mecatrônicos
    "ESZA011-17", // Eletrônica de Potência I
    "ESZA012-17", // Eletrônica de Potência II
    "ESZA013-17", // Instrumentação e Metrologia Óptica
    "ESZA014-17", // Projeto de Microdispositivos para Instrumentação
    "ESZA015-17", // Supervisão e Monitoramento de Processos Energéticos
    "ESZA016-17", // Optoeletrônica
    "ESZA017-17", // Lógica Programável
    "ESZA018-17", // Engenharia Óptica e Imagens
    "ESTE019-17", // Instalações Elétricas I
    "ESTE015-17", // Fundamentos de Conversão de Energia Elétrica
    "ESTE020-17", // Instalações Elétricas II
    "ESZI016-17", // Projeto de Filtros Digitais
    "ESZ1025-17", // Aplicações de Microcontroladores (Nota: OCR leu '1' em vez de 'I', mantido conforme original possível)
    "ESZA019-17", // Visão Computacional
    "ESZA020-17", // Robôs Móveis Autônomos
    "ESZA021-17", // Controle Avançado de Robôs
    "ESZA022-17", // Inteligência Artificial em Robótica
    "EST0016-17", // Fenômenos de Transporte
    "ESTO004-17", // Instrumentação e Controle
    "ESTO001-17", // Circuitos Elétricos e Fotônica
  ],
};