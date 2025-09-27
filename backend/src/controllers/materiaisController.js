const fs = require('fs').promises;
const path = require('path');

const MATERIAIS_FILE = path.join(__dirname, '../data/materiais.json');

// Função para ler os dados dos materiais
const readMateriaisData = async () => {
  try {
    const data = await fs.readFile(MATERIAIS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler dados dos materiais:', error);
    return { materiais: [] };
  }
};

// Função para salvar os dados dos materiais
const writeMateriaisData = async (data) => {
  try {
    await fs.writeFile(MATERIAIS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados dos materiais:', error);
    return false;
  }
};

// Gerar ID único
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Listar todos os materiais com filtros
const getMateriais = async (req, res) => {
  try {
    const data = await readMateriaisData();
    let materiais = data.materiais || [];

    // Aplicar filtros da query
    const { categoria, subcategoria, ativo, esteril, descartavel, implantavel, search } = req.query;

    if (categoria) {
      materiais = materiais.filter(material => material.categoria === categoria);
    }

    if (subcategoria) {
      materiais = materiais.filter(material => material.subcategoria === subcategoria);
    }

    if (ativo !== undefined) {
      materiais = materiais.filter(material => material.ativo === (ativo === 'true'));
    }

    if (esteril !== undefined) {
      materiais = materiais.filter(material => material.esteril === (esteril === 'true'));
    }

    if (descartavel !== undefined) {
      materiais = materiais.filter(material => material.descartavel === (descartavel === 'true'));
    }

    if (implantavel !== undefined) {
      materiais = materiais.filter(material => material.implantavel === (implantavel === 'true'));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      materiais = materiais.filter(material => 
        material.nome.toLowerCase().includes(searchLower) ||
        material.codigo?.toLowerCase().includes(searchLower) ||
        material.especificacao?.toLowerCase().includes(searchLower)
      );
    }

    res.json(materiais);
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar material por ID
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readMateriaisData();
    const material = data.materiais.find(m => m.id === id);

    if (!material) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }

    res.json(material);
  } catch (error) {
    console.error('Erro ao buscar material:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Criar novo material
const createMaterial = async (req, res) => {
  try {
    const materialData = req.body;
    const data = await readMateriaisData();

    const novoMaterial = {
      ...materialData,
      id: generateId(),
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    data.materiais.push(novoMaterial);

    const saved = await writeMateriaisData(data);
    if (saved) {
      res.status(201).json(novoMaterial);
    } else {
      res.status(500).json({ error: 'Erro ao salvar material' });
    }
  } catch (error) {
    console.error('Erro ao criar material:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar material
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const materialData = req.body;
    const data = await readMateriaisData();

    const index = data.materiais.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }

    data.materiais[index] = {
      ...data.materiais[index],
      ...materialData,
      id, // Manter o ID original
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    const saved = await writeMateriaisData(data);
    if (saved) {
      res.json(data.materiais[index]);
    } else {
      res.status(500).json({ error: 'Erro ao atualizar material' });
    }
  } catch (error) {
    console.error('Erro ao atualizar material:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar material
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readMateriaisData();

    const index = data.materiais.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }

    data.materiais.splice(index, 1);

    const saved = await writeMateriaisData(data);
    if (saved) {
      res.json({ message: 'Material deletado com sucesso' });
    } else {
      res.status(500).json({ error: 'Erro ao deletar material' });
    }
  } catch (error) {
    console.error('Erro ao deletar material:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter categorias e subcategorias
const getCategorias = async (req, res) => {
  try {
    const categorias = {
      'MATERIAIS_BASICOS': {
        label: 'Materiais Básicos de Cirurgia',
        subcategorias: [
          'Instrumentais Cortantes',
          'Fios Cirúrgicos Absorvíveis',
          'Fios Cirúrgicos Não Absorvíveis',
          'Agulhas Hipodérmicas',
          'Seringas'
        ]
      },
      'CURATIVOS': {
        label: 'Materiais para Curativos',
        subcategorias: [
          'Compressas e Gazes',
          'Fitas e Adesivos',
          'Ataduras'
        ]
      },
      'PROTECAO': {
        label: 'Equipamentos de Proteção',
        subcategorias: [
          'Luvas',
          'Máscaras e Proteção'
        ]
      },
      'CATETERES_SONDAS': {
        label: 'Cateteres e Sondas',
        subcategorias: [
          'Cateteres Vesicais',
          'Cateteres Vasculares',
          'Sondas',
          'Cateteres Especiais'
        ]
      },
      'DRENOS_COLETORES': {
        label: 'Drenos e Coletores',
        subcategorias: [
          'Tipos de Drenos',
          'Coletores'
        ]
      },
      'SOLUCOES_MEDICAMENTOS': {
        label: 'Soluções e Medicamentos',
        subcategorias: [
          'Soluções Parenterais',
          'Soluções Antissépticas',
          'Anestésicos Locais',
          'Anestésicos Gerais',
          'Relaxantes Musculares',
          'Opioides',
          'Sedativos'
        ]
      },
      'EQUIPOS_CONECTORES': {
        label: 'Equipos e Conectores',
        subcategorias: [
          'Equipos',
          'Conectores e Acessórios'
        ]
      },
      'ORTOPEDICOS': {
        label: 'Materiais Ortopédicos',
        subcategorias: [
          'Parafusos',
          'Placas',
          'Fios e Pinos',
          'Outros Ortopédicos'
        ]
      },
      'GRAMPOS_CLIPES': {
        label: 'Grampos e Clipes',
        subcategorias: [
          'Grampos',
          'Clipes'
        ]
      },
      'ELETROCIRURGIA': {
        label: 'Materiais para Eletrocirurgia',
        subcategorias: []
      },
      'KITS_ESPECIALIZADOS': {
        label: 'Kits Especializados',
        subcategorias: [
          'Kits Cirúrgicos',
          'Kits de Procedimentos'
        ]
      },
      'LABORATORIAIS': {
        label: 'Materiais Laboratoriais',
        subcategorias: [
          'Coleta de Sangue',
          'Coleta de Urina'
        ]
      },
      'ANESTESIA': {
        label: 'Materiais para Anestesia',
        subcategorias: [
          'Vias Aéreas',
          'Intubação',
          'Máscara Laríngea'
        ]
      },
      'UTI': {
        label: 'Materiais para UTI',
        subcategorias: [
          'Ventilação',
          'Monitorização'
        ]
      },
      'HEMOTERAPIA': {
        label: 'Materiais para Hemoterapia',
        subcategorias: []
      }
    };

    res.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Estatísticas dos materiais
const getEstatisticas = async (req, res) => {
  try {
    const data = await readMateriaisData();
    const materiais = data.materiais || [];

    const estatisticas = {
      total: materiais.length,
      ativos: materiais.filter(m => m.ativo).length,
      inativos: materiais.filter(m => !m.ativo).length,
      estereis: materiais.filter(m => m.esteril).length,
      descartaveis: materiais.filter(m => m.descartavel).length,
      implantaveis: materiais.filter(m => m.implantavel).length,
      estoqueZerado: materiais.filter(m => m.estoqueAtual === 0).length,
      estoqueBaixo: materiais.filter(m => m.estoqueAtual > 0 && m.estoqueAtual <= (m.estoqueMinimo || 0)).length,
      valorTotalEstoque: materiais.reduce((acc, m) => acc + (m.valorCusto * (m.estoqueAtual || 0)), 0),
      porCategoria: {},
      porSubcategoria: {}
    };

    // Estatísticas por categoria
    materiais.forEach(material => {
      if (!estatisticas.porCategoria[material.categoria]) {
        estatisticas.porCategoria[material.categoria] = 0;
      }
      estatisticas.porCategoria[material.categoria]++;

      if (material.subcategoria) {
        if (!estatisticas.porSubcategoria[material.subcategoria]) {
          estatisticas.porSubcategoria[material.subcategoria] = 0;
        }
        estatisticas.porSubcategoria[material.subcategoria]++;
      }
    });

    res.json(estatisticas);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getMateriais,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getCategorias,
  getEstatisticas
};