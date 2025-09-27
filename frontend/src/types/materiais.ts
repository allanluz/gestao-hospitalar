export interface Material {
  id: string;
  codigo?: string;
  nome: string;
  categoria: CategoriaMaterial;
  subcategoria?: string;
  especificacao?: string;
  unidadeMedida: string;
  valorCusto: number;
  valorVenda: number;
  estoqueMinimo?: number;
  estoqueAtual?: number;
  ativo: boolean;
  esteril: boolean;
  descartavel: boolean;
  implantavel: boolean;
  observacoes?: string;
  fornecedor?: string;
  codigoFornecedor?: string;
  dataAtualizacao: string;
}

export enum CategoriaMaterial {
  MATERIAIS_BASICOS = 'MATERIAIS_BASICOS',
  CURATIVOS = 'CURATIVOS',
  PROTECAO = 'PROTECAO',
  CATETERES_SONDAS = 'CATETERES_SONDAS',
  DRENOS_COLETORES = 'DRENOS_COLETORES',
  SOLUCOES_MEDICAMENTOS = 'SOLUCOES_MEDICAMENTOS',
  EQUIPOS_CONECTORES = 'EQUIPOS_CONECTORES',
  ORTOPEDICOS = 'ORTOPEDICOS',
  GRAMPOS_CLIPES = 'GRAMPOS_CLIPES',
  ELETROCIRURGIA = 'ELETROCIRURGIA',
  KITS_ESPECIALIZADOS = 'KITS_ESPECIALIZADOS',
  LABORATORIAIS = 'LABORATORIAIS',
  ANESTESIA = 'ANESTESIA',
  UTI = 'UTI',
  HEMOTERAPIA = 'HEMOTERAPIA'
}

export const CATEGORIAS_LABELS = {
  [CategoriaMaterial.MATERIAIS_BASICOS]: 'Materiais Básicos de Cirurgia',
  [CategoriaMaterial.CURATIVOS]: 'Materiais para Curativos',
  [CategoriaMaterial.PROTECAO]: 'Equipamentos de Proteção',
  [CategoriaMaterial.CATETERES_SONDAS]: 'Cateteres e Sondas',
  [CategoriaMaterial.DRENOS_COLETORES]: 'Drenos e Coletores',
  [CategoriaMaterial.SOLUCOES_MEDICAMENTOS]: 'Soluções e Medicamentos',
  [CategoriaMaterial.EQUIPOS_CONECTORES]: 'Equipos e Conectores',
  [CategoriaMaterial.ORTOPEDICOS]: 'Materiais Ortopédicos',
  [CategoriaMaterial.GRAMPOS_CLIPES]: 'Grampos e Clipes',
  [CategoriaMaterial.ELETROCIRURGIA]: 'Materiais para Eletrocirurgia',
  [CategoriaMaterial.KITS_ESPECIALIZADOS]: 'Kits Especializados',
  [CategoriaMaterial.LABORATORIAIS]: 'Materiais Laboratoriais',
  [CategoriaMaterial.ANESTESIA]: 'Materiais para Anestesia',
  [CategoriaMaterial.UTI]: 'Materiais para UTI',
  [CategoriaMaterial.HEMOTERAPIA]: 'Materiais para Hemoterapia'
};

export const SUBCATEGORIAS = {
  [CategoriaMaterial.MATERIAIS_BASICOS]: [
    'Instrumentais Cortantes',
    'Fios Cirúrgicos Absorvíveis',
    'Fios Cirúrgicos Não Absorvíveis',
    'Agulhas Hipodérmicas',
    'Seringas'
  ],
  [CategoriaMaterial.CURATIVOS]: [
    'Compressas e Gazes',
    'Fitas e Adesivos',
    'Ataduras'
  ],
  [CategoriaMaterial.PROTECAO]: [
    'Luvas',
    'Máscaras e Proteção'
  ],
  [CategoriaMaterial.CATETERES_SONDAS]: [
    'Cateteres Vesicais',
    'Cateteres Vasculares',
    'Sondas',
    'Cateteres Especiais'
  ],
  [CategoriaMaterial.DRENOS_COLETORES]: [
    'Tipos de Drenos',
    'Coletores'
  ],
  [CategoriaMaterial.SOLUCOES_MEDICAMENTOS]: [
    'Soluções Parenterais',
    'Soluções Antissépticas',
    'Anestésicos Locais',
    'Anestésicos Gerais',
    'Relaxantes Musculares',
    'Opioides',
    'Sedativos'
  ],
  [CategoriaMaterial.EQUIPOS_CONECTORES]: [
    'Equipos',
    'Conectores e Acessórios'
  ],
  [CategoriaMaterial.ORTOPEDICOS]: [
    'Parafusos',
    'Placas',
    'Fios e Pinos',
    'Outros Ortopédicos'
  ],
  [CategoriaMaterial.GRAMPOS_CLIPES]: [
    'Grampos',
    'Clipes'
  ],
  [CategoriaMaterial.ANESTESIA]: [
    'Vias Aéreas',
    'Intubação',
    'Máscara Laríngea'
  ],
  [CategoriaMaterial.UTI]: [
    'Ventilação',
    'Monitorização'
  ]
};