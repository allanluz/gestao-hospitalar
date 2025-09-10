// Tipos para Recepção Centro Cirúrgico
export interface RecepcaoData {
  id?: string;
  numeroInternacao: string;
  nome: string;
  reservaUti: boolean;
  reservaHemoderivados: {
    necessita: boolean;
    tipo: string[];
  };
  tipoSanguineo: string;
  medicacaoPreAnestesica: {
    administrada: boolean;
    medicamento: string;
  };
  alergias: {
    possui: boolean;
    descricao: string;
  };
  patologiasBase: string;
  medicacoesUso: string;
  anotacoesEnfermagem: string;
  responsavel: {
    assinatura: string;
    coren: string;
  };
  dataHora?: string;
  status?: 'ativo' | 'concluido' | 'cancelado';
}

// Tipos para Assistência Intra-Operatória
export interface AssistenciaIntraOperatoria {
  id?: string;
  numeroInternacao: string;
  cirurgiaProposta: string;
  so: string;
  horarios: {
    entrada: string;
    inicio: string;
    fim: string;
  };
  sinaisVitais: {
    pressaoArterial: string;
    frequenciaCardiaca: number;
    saturacaoO2: number;
  };
  equipe: {
    cirurgiao?: string;
    primeiroAssistente: string;
    segundoAssistente?: string;
    equipeCompleta: string[];
    anestesiologista: string;
    circulantesSala: string[];
    instrumentador: string;
    enfermeiro: string;
  };
  anestesia: {
    tipo: string;
    canulaNasofaringea: boolean;
    manobraValsalva: boolean;
    sondaEndotraqueal: string;
    cateterNasal: boolean;
    agulhaRaquianestesia: string;
    agulhaPeridural: string;
    medicamentosAnestesicos?: any[];
    observacoes?: string;
  };
  anestesicosAdministrados: {
    [key: string]: number;
  };
  medicamentosAdministrados: {
    [key: string]: string;
  };
  posicionamentoCirurgico: {
    tipo: 'litotomia' | 'dld' | 'ddh' | 'dle' | 'dv' | 'ginecologica' | 'supina';
    usoCoxim: boolean;
    outros: string;
    protecaoProeminencias?: boolean;
    verificacaoSeguranca?: boolean;
  };
  garrotePneumatico: {
    utilizado: boolean;
    local: string;
    pressao?: string;
    inicioHora: string;
    retiradaHora: string;
    tempoTotal?: string;
  };
  mantaTermica: {
    utilizada: boolean;
    tempo: number;
    temperatura?: string;
  };
  equipamentosSeguranca: {
    travesseiros: boolean;
    faixaSeguranca: boolean;
    protecoesLaterais?: boolean;
    verificacaoFinal?: boolean;
  };
  procedimentoCirurgico?: {
    incisao: string;
    tecnicaCirurgica: string;
    sutura: string;
    drenos: boolean;
    tiposDrenos: string;
    curativos: string;
    especimes: string;
  };
  complicacoes?: {
    intraoperatorias: any[];
    sangramento: {
      estimado: string;
      necessidadeTransfusao: boolean;
      tipoSangue: string;
    };
  };
  indicacaoCorporal?: any[];
  monitoramento?: any;
}

// Tipos para Recuperação Anestésica
export interface RecuperacaoAnestesica {
  id?: string;
  numeroInternacao: string;
  nome: string;
  idade: number;
  quartoLeito: string;
  cirurgiaRealizada: string;
  diagnosticoBase: string;
  tipoAnestesia: {
    geralVenosa: boolean;
    geralInalatoria: boolean;
    geralCombinada: boolean;
    peridural: boolean;
    periduralCateter: boolean;
    raqui: boolean;
    bloqueio: boolean;
    sedacao: boolean;
  };
  alergias: {
    possui: boolean;
    descricao: string;
  };
  anestesiologista: string;
  nebulizacao: boolean;
  monitorizacao: {
    multiparametrico: boolean;
    ecg: boolean;
    oximetroPulso: boolean;
    pa: boolean;
    pvc: boolean;
    paInvasiva: boolean;
    localPaInvasiva: string;
  };
  sinaisVitaisHorarios: SinaisVitais[];
  escalaSedacaoRamsay: EscalaRamsay[];
  escalaPupilas: {
    tamanho: string;
    tipo: string;
    simetria: string;
    fotorreacao: string;
  };
  escalaDor: number;
  medicamentosMinistrados: MedicamentoMinistrado[];
  liquidosEliminados: LiquidoEliminado[];
  indiceAldreteKroulik: {
    movimentacao: number;
    respiracao: number;
    pressaoArterial: number;
    consciencia: number;
    saturacaoO2: number;
    total: number;
    aptoParaAlta?: boolean;
  };
  prescricaoMedica?: {
    altaHorario: string;
    medico: string;
    crm: string;
  };
  transferencia?: {
    destino: string;
    tecnicoEnfermagem: string;
    enfermeiro: string;
  };
}

export interface SinaisVitais {
  hora: string;
  pa: string;
  fc: number;
  fr: number;
  so2: number;
  temperatura: number;
}

export interface EscalaRamsay {
  horario: string;
  valor: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface MedicamentoMinistrado {
  medicamento: string;
  hora: string;
  quantidade: string;
}

export interface LiquidoEliminado {
  tipo: 'sangue' | 'urina' | 'suco_gastrico' | 'miccao_espontanea';
  hora: string;
  quantidade: number;
}

// Tipos para Controle de Infecção Hospitalar
export interface ControleInfeccaoHospitalar {
  id?: string;
  dataCirurgia: string;
  nome: string;
  idade: number;
  classificacao: 'sus' | 'particular' | 'scs' | 'pacote' | 'cassi';
  sexo: 'm' | 'f';
  unidadeInternacao: string;
  numeroInternacao: string;
  admissao: {
    data: string;
    horario: string;
  };
  antecedentes: {
    tabagista: boolean;
    diabetico: boolean;
    renalCronico: boolean;
    obeso: boolean;
    hipertenso: boolean;
  };
  tempoInternacao: {
    unidade: number;
    uti: number;
    infeccaoPrevia: boolean;
  };
  preOperatorio: {
    tricotomiaHoras: number;
    local: string;
    preparoSala: boolean;
    antissepticos: {
      clorexidinaDegermante: boolean;
      pvpiDegermante: boolean;
      clorexidinaAlcoolica: boolean;
      pvpiTintura: boolean;
      clorexidinaAquosa: boolean;
      pvpiTopico: boolean;
    };
  };
  sondagens: {
    vesicalDemora: boolean;
    nasogastrica: boolean;
    vesicalAlivio: boolean;
    responsavel: string;
  };
  antibioticoProfilatico: string;
  transfusoes: {
    sangue: boolean;
    plasma: boolean;
    quantidade: string;
  };
  cirurgia: {
    periodo: 'm' | 't' | 'n';
    reoperacao: boolean;
    duracao: number;
    asa: string;
    cpc: string;
    realizada: string;
    cirurgiao: string;
    auxiliar: string;
    anestesia: string;
    anestesiologista: string;
    circulantes: string[];
  };
  proteses: boolean;
  drenos: {
    succao: boolean;
    penrose: boolean;
    torax: boolean;
    kheer: boolean;
    outros: string;
    local: string;
  };
  intercorrencias: string;
}

// Tipos para Custeio Cirúrgico
export interface CusteioCircurgico {
  id?: string;
  numeroInternacao: string;
  nomePaciente: string;
  idade: number;
  quarto: string;
  tipoCirurgia: string;
  horarios: {
    inicio: string;
    fim: string;
    total: number;
  };
  equipe: {
    cirurgiao: string;
    assistentes: string[];
    instrumentadoras: string[];
    anestesista: string;
    circulante: string;
  };
  porte: '0' | '1' | '2' | '3';
  classificacao: string;
  data: string;
  materiaisUtilizados: MaterialUtilizado[];
  somaTotal: {
    custo: number;
    venda: number;
  };
  assinaturas: {
    cirurgiao: string;
    responsavel: string;
  };
}

export interface MaterialUtilizado {
  quantidade: number;
  material: string;
  valorCusto: number;
  valorVenda: number;
}

export interface MaterialDisponivel {
  nome: string;
  valorCusto: number;
  valorVenda: number;
  unidade: string;
}

// Tipos para API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  total?: number;
}

// Tipos para Dashboard
export interface DashboardData {
  totalPacientes: number;
  totalFuncionarios: number;
  totalItensEstoque: number;
  itensEstoqueBaixo: number;
  centroCircurgico: {
    recepcoesPendentes: number;
    pacientesEmRecuperacao: number;
    cirurgiasHoje: number;
    cirurgiasMes: number;
  };
  financeiro: {
    custoTotalMes: string;
    receitaTotalMes: string;
    margemMes: string;
  };
  timestamp: string;
}

// Constantes para escalas médicas
export const ESCALA_RAMSAY = {
  1: "Acordado / Ansioso / Agitado",
  2: "Cooperativo / Orientado",
  3: "Responde a comando",
  4: "Adormecido / Resp. Ráp. a Estímulo",
  5: "Respiração lenta a estímulo",
  6: "Não responde"
} as const;

export const TIPOS_SANGUINEOS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export const TIPOS_ANESTESIA = [
  'Geral venosa',
  'Geral inalatória',
  'Geral combinada',
  'Peridural',
  'Peridural com cateter',
  'Raquianestesia',
  'Bloqueio regional',
  'Sedação'
] as const;

export const POSICIONAMENTOS_CIRURGICOS = [
  { value: 'litotomia', label: 'Litotomia' },
  { value: 'dld', label: 'Decúbito lateral direito (DLD)' },
  { value: 'ddh', label: 'Decúbito dorsal horizontal (DDH)' },
  { value: 'dle', label: 'Decúbito lateral esquerdo (DLE)' },
  { value: 'dv', label: 'Decúbito ventral (DV)' },
  { value: 'ginecologica', label: 'Posição ginecológica' }
] as const;

// Interface para Recepção do Centro Cirúrgico
export interface RecepcaoCentroCircurgico {
  id?: string;
  numeroInternacao: string;
  nomePaciente: string;
  dataNascimento: string;
  sexo: 'M' | 'F';
  procedimentoProgramado: string;
  medico: string;
  tipoAnestesia: 'geral' | 'peridural' | 'raquianestesia' | 'local' | 'sedacao';
  consentimentoAssinado: boolean;
  tempoJejum: number;
  checklist: {
    identificacaoCorreta: boolean;
    sitioCircurgicoConfirmado: boolean;
    procedimentoConfirmado: boolean;
    consentimentoCircurgia: boolean;
    consentimentoAnestesia: boolean;
    alergiasMedicamentos: boolean;
    sinaisVitaisVerificados: boolean;
    materialCirurgicoDisponivel: boolean;
  };
  observacoes: string;
}
