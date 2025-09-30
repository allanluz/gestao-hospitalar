import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CusteioCircurgico, MaterialUtilizado } from '../types/centro-cirurgico';

const CusteioCirurgicoPage: React.FC = () => {
  const [custeios, setCusteios] = useState<CusteioCircurgico[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<CusteioCircurgico>>({
    numeroInternacao: '',
    nomePaciente: '',
    idade: 0,
    quarto: '',
    tipoCirurgia: '',
    horarios: {
      inicio: '',
      fim: '',
      total: 0
    },
    equipe: {
      cirurgiao: '',
      assistentes: [],
      instrumentadoras: [],
      anestesista: '',
      circulante: ''
    },
    porte: '0',
    classificacao: '',
    data: '',
    materiaisUtilizados: [],
    somaTotal: {
      custo: 0,
      venda: 0
    },
    assinaturas: {
      cirurgiao: '',
      responsavel: ''
    }
  });

  const [novoMaterial, setNovoMaterial] = useState<Partial<MaterialUtilizado>>({
    quantidade: 0,
    material: '',
    valorCusto: 0,
    valorVenda: 0
  });

  // Lista de materiais carregada do sistema
  const [materiaisDisponiveis, setMateriaisDisponiveis] = useState<any[]>([]);

  const [materialSelecionado, setMaterialSelecionado] = useState('');
  const [quantidadeMaterial, setQuantidadeMaterial] = useState(0);
  const [mostrarListaMateriais, setMostrarListaMateriais] = useState(false);
  const [buscaMaterial, setBuscaMaterial] = useState('');
  
  // Estados para filtros e ordenação de materiais
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroFaixaPreco, setFiltroFaixaPreco] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchCusteios();
    fetchMateriais();
  }, []);

  const fetchMateriais = async () => {
    try {
      const response = await api.getMateriais({ ativo: true });
      const data = (response as any)?.data || response;
      setMateriaisDisponiveis(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
      setMateriaisDisponiveis([]);
    }
  };

  const fetchCusteios = async () => {
    try {
      const response = await api.getCusteios();
      const data = (response as any)?.data || response;
      setCusteios(Array.isArray(data) ? data as CusteioCircurgico[] : []);
    } catch (error) {
      console.error('Erro ao carregar custeios:', error);
      setCusteios([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotais = (materiais: MaterialUtilizado[]) => {
    const custo = materiais.reduce(
      (total, material) => total + (material.quantidade * material.valorCusto), 0
    );
    const venda = materiais.reduce(
      (total, material) => total + (material.quantidade * material.valorVenda), 0
    );

    return { custo, venda };
  };

  useEffect(() => {
    if (formData.materiaisUtilizados) {
      const totais = calcularTotais(formData.materiaisUtilizados);
      setFormData(prev => ({
        ...prev,
        somaTotal: totais
      }));
    }
  }, [formData.materiaisUtilizados?.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await api.updateCusteio(editingId, formData as CusteioCircurgico);
      } else {
        await api.createCusteio(formData as Omit<CusteioCircurgico, 'id'>);
      }
      
      await fetchCusteios();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar custeio:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      numeroInternacao: '',
      nomePaciente: '',
      idade: 0,
      quarto: '',
      tipoCirurgia: '',
      horarios: {
        inicio: '',
        fim: '',
        total: 0
      },
      equipe: {
        cirurgiao: '',
        assistentes: [],
        instrumentadoras: [],
        anestesista: '',
        circulante: ''
      },
      porte: '0',
      classificacao: '',
      data: '',
      materiaisUtilizados: [],
      somaTotal: {
        custo: 0,
        venda: 0
      },
      assinaturas: {
        cirurgiao: '',
        responsavel: ''
      }
    });
    setEditingId(null);
  };

  const handleEdit = (custeio: CusteioCircurgico) => {
    setFormData(custeio);
    setEditingId(custeio.id || null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este custeio?')) {
      try {
        // await api.deleteCusteio(id); // Implementar quando disponível
        console.log('Deletando custeio:', id);
        await fetchCusteios();
      } catch (error) {
        console.error('Erro ao excluir custeio:', error);
      }
    }
  };

  const adicionarMaterial = () => {
    if (novoMaterial.material && novoMaterial.quantidade && novoMaterial.quantidade > 0) {
      const material: MaterialUtilizado = {
        quantidade: novoMaterial.quantidade,
        material: novoMaterial.material,
        valorCusto: novoMaterial.valorCusto || 0,
        valorVenda: novoMaterial.valorVenda || 0
      };

      setFormData({
        ...formData,
        materiaisUtilizados: [...(formData.materiaisUtilizados || []), material]
      });

      setNovoMaterial({
        quantidade: 0,
        material: '',
        valorCusto: 0,
        valorVenda: 0
      });
    }
  };

  const adicionarMaterialPredefinido = () => {
    if (materialSelecionado && quantidadeMaterial > 0) {
      const materialInfo = materiaisDisponiveis.find((m: any) => m.nome === materialSelecionado);
      if (materialInfo) {
        const material: MaterialUtilizado = {
          quantidade: quantidadeMaterial,
          material: materialInfo.nome,
          valorCusto: materialInfo.valorCusto,
          valorVenda: materialInfo.valorVenda
        };

        setFormData({
          ...formData,
          materiaisUtilizados: [...(formData.materiaisUtilizados || []), material]
        });

        setMaterialSelecionado('');
        setQuantidadeMaterial(0);
        setBuscaMaterial('');
      }
    }
  };

  const removerMaterial = (index: number) => {
    const materiais = [...(formData.materiaisUtilizados || [])];
    materiais.splice(index, 1);
    setFormData({ ...formData, materiaisUtilizados: materiais });
  };

  // Função para filtrar e ordenar materiais
  const getMateriaisFilteredAndSorted = () => {
    let materiaisFiltrados = [...materiaisDisponiveis];

    // Aplicar busca por nome
    if (buscaMaterial) {
      materiaisFiltrados = materiaisFiltrados.filter((material: any) => 
        material.nome.toLowerCase().includes(buscaMaterial.toLowerCase())
      );
    }

    // Aplicar filtro por categoria
    if (filtroCategoria) {
      materiaisFiltrados = materiaisFiltrados.filter((material: any) => 
        material.categoria === filtroCategoria
      );
    }

    // Aplicar filtro por faixa de preço
    if (filtroFaixaPreco) {
      materiaisFiltrados = materiaisFiltrados.filter((material: any) => {
        const preco = material.valorVenda;
        switch (filtroFaixaPreco) {
          case 'ate-10': return preco <= 10;
          case '10-50': return preco > 10 && preco <= 50;
          case '50-100': return preco > 50 && preco <= 100;
          case '100-500': return preco > 100 && preco <= 500;
          case 'acima-500': return preco > 500;
          default: return true;
        }
      });
    }

    // Aplicar ordenação
    materiaisFiltrados.sort((a: any, b: any) => {
      let valorA, valorB;
      
      switch (ordenacao) {
        case 'nome':
          valorA = a.nome.toLowerCase();
          valorB = b.nome.toLowerCase();
          break;
        case 'categoria':
          valorA = a.categoria?.toLowerCase() || '';
          valorB = b.categoria?.toLowerCase() || '';
          break;
        case 'valorCusto':
          valorA = a.valorCusto;
          valorB = b.valorCusto;
          break;
        case 'valorVenda':
          valorA = a.valorVenda;
          valorB = b.valorVenda;
          break;
        default:
          valorA = a.nome.toLowerCase();
          valorB = b.nome.toLowerCase();
      }

      if (typeof valorA === 'string') {
        const comparacao = valorA.localeCompare(valorB);
        return direcaoOrdenacao === 'asc' ? comparacao : -comparacao;
      } else {
        return direcaoOrdenacao === 'asc' ? valorA - valorB : valorB - valorA;
      }
    });

    return materiaisFiltrados;
  };

  // Função para obter categorias únicas
  const getCategoriasUnicas = () => {
    const categorias = materiaisDisponiveis
      .map((material: any) => material.categoria)
      .filter((categoria: string) => categoria && categoria.trim() !== '')
      .filter((categoria: string, index: number, array: string[]) => array.indexOf(categoria) === index)
      .sort();
    return categorias;
  };

  const adicionarAssistente = () => {
    const assistentes = [...(formData.equipe?.assistentes || []), ''];
    setFormData({
      ...formData,
      equipe: {
        ...formData.equipe!,
        assistentes
      }
    });
  };

  const removerAssistente = (index: number) => {
    const assistentes = [...(formData.equipe?.assistentes || [])];
    assistentes.splice(index, 1);
    setFormData({
      ...formData,
      equipe: {
        ...formData.equipe!,
        assistentes
      }
    });
  };

  const adicionarInstrumentadora = () => {
    const instrumentadoras = [...(formData.equipe?.instrumentadoras || []), ''];
    setFormData({
      ...formData,
      equipe: {
        ...formData.equipe!,
        instrumentadoras
      }
    });
  };

  const removerInstrumentadora = (index: number) => {
    const instrumentadoras = [...(formData.equipe?.instrumentadoras || [])];
    instrumentadoras.splice(index, 1);
    setFormData({
      ...formData,
      equipe: {
        ...formData.equipe!,
        instrumentadoras
      }
    });
  };

  const filteredCusteios = custeios.filter(custeio =>
    custeio.nomePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custeio.numeroInternacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custeio.tipoCirurgia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Custeio Cirúrgico</h1>

      {/* Informações dos Materiais */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-800 mb-1">📦 Central de Materiais</h2>
            <p className="text-sm text-blue-600">
              Temos <span className="font-bold">{materiaisDisponiveis.length} materiais</span> cadastrados para facilitar o seu trabalho
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">{materiaisDisponiveis.length}</div>
            <div className="text-xs text-blue-500">materiais disponíveis</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/70 p-2 rounded border border-blue-100">
            <div className="font-medium text-blue-700">Materiais Básicos</div>
            <div className="text-blue-600">Lâminas, agulhas, seringas</div>
          </div>
          <div className="bg-white/70 p-2 rounded border border-blue-100">
            <div className="font-medium text-blue-700">Fios Cirúrgicos</div>
            <div className="text-blue-600">Vicryl, Nylon, Prolene, Seda</div>
          </div>
          <div className="bg-white/70 p-2 rounded border border-blue-100">
            <div className="font-medium text-blue-700">Kits Especializados</div>
            <div className="text-blue-600">Laparoscopia, Artroscopia</div>
          </div>
          <div className="bg-white/70 p-2 rounded border border-blue-100">
            <div className="font-medium text-blue-700">Medicamentos</div>
            <div className="text-blue-600">Anestésicos e soluções</div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Internação
                </label>
                <input
                  type="text"
                  value={formData.numeroInternacao || ''}
                  onChange={(e) => setFormData({ ...formData, numeroInternacao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  value={formData.nomePaciente || ''}
                  onChange={(e) => setFormData({ ...formData, nomePaciente: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  value={formData.idade || ''}
                  onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarto
                </label>
                <input
                  type="text"
                  value={formData.quarto || ''}
                  onChange={(e) => setFormData({ ...formData, quarto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cirurgia
                </label>
                <input
                  type="text"
                  value={formData.tipoCirurgia || ''}
                  onChange={(e) => setFormData({ ...formData, tipoCirurgia: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data || ''}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porte
                </label>
                <select
                  value={formData.porte || '0'}
                  onChange={(e) => setFormData({ ...formData, porte: e.target.value as "0" | "1" | "2" | "3" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Porte 0</option>
                  <option value="1">Porte 1</option>
                  <option value="2">Porte 2</option>
                  <option value="3">Porte 3</option>
                  <option value="4">Porte 4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classificação
              </label>
              <select
                value={formData.classificacao || ''}
                onChange={(e) => setFormData({ ...formData, classificacao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione a classificação</option>
                <option value="limpa">Limpa</option>
                <option value="potencialmente-contaminada">Potencialmente Contaminada</option>
                <option value="contaminada">Contaminada</option>
                <option value="infectada">Infectada</option>
              </select>
            </div>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Horários</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Início
                </label>
                <input
                  type="time"
                  value={formData.horarios?.inicio || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    horarios: { ...formData.horarios!, inicio: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fim
                </label>
                <input
                  type="time"
                  value={formData.horarios?.fim || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    horarios: { ...formData.horarios!, fim: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total (horas)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.horarios?.total || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    horarios: { ...formData.horarios!, total: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Equipe Cirúrgica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Equipe Cirúrgica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cirurgião
                </label>
                <input
                  type="text"
                  value={formData.equipe?.cirurgiao || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    equipe: { ...formData.equipe!, cirurgiao: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anestesista
                </label>
                <input
                  type="text"
                  value={formData.equipe?.anestesista || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    equipe: { ...formData.equipe!, anestesista: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Circulante
                </label>
                <input
                  type="text"
                  value={formData.equipe?.circulante || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    equipe: { ...formData.equipe!, circulante: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Assistentes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Assistentes
                </label>
                <button
                  type="button"
                  onClick={adicionarAssistente}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                >
                  + Adicionar
                </button>
              </div>
              {(formData.equipe?.assistentes || []).map((assistente, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={assistente}
                    onChange={(e) => {
                      const assistentes = [...(formData.equipe?.assistentes || [])];
                      assistentes[index] = e.target.value;
                      setFormData({
                        ...formData,
                        equipe: { ...formData.equipe!, assistentes }
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={`Assistente ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removerAssistente(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Instrumentadoras */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instrumentadoras
                </label>
                <button
                  type="button"
                  onClick={adicionarInstrumentadora}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                >
                  + Adicionar
                </button>
              </div>
              {(formData.equipe?.instrumentadoras || []).map((instrumentadora, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={instrumentadora}
                    onChange={(e) => {
                      const instrumentadoras = [...(formData.equipe?.instrumentadoras || [])];
                      instrumentadoras[index] = e.target.value;
                      setFormData({
                        ...formData,
                        equipe: { ...formData.equipe!, instrumentadoras }
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={`Instrumentadora ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removerInstrumentadora(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Materiais Utilizados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Materiais Utilizados</h3>
            
            {/* Filtros e Ordenação de Materiais */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="text-md font-medium text-gray-800 mb-3">🔍 Filtros e Ordenação</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtro por Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todas as categorias</option>
                    {getCategoriasUnicas().map((categoria: string) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Faixa de Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faixa de Preço
                  </label>
                  <select
                    value={filtroFaixaPreco}
                    onChange={(e) => setFiltroFaixaPreco(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todos os preços</option>
                    <option value="ate-10">Até R$ 10,00</option>
                    <option value="10-50">R$ 10,01 - R$ 50,00</option>
                    <option value="50-100">R$ 50,01 - R$ 100,00</option>
                    <option value="100-500">R$ 100,01 - R$ 500,00</option>
                    <option value="acima-500">Acima de R$ 500,00</option>
                  </select>
                </div>

                {/* Ordenar por */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordenar por
                  </label>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="nome">Nome (A-Z)</option>
                    <option value="categoria">Categoria</option>
                    <option value="valorCusto">Valor de Custo</option>
                    <option value="valorVenda">Valor de Venda</option>
                  </select>
                </div>

                {/* Direção da Ordenação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Direção
                  </label>
                  <select
                    value={direcaoOrdenacao}
                    onChange={(e) => setDirecaoOrdenacao(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="asc">Crescente</option>
                    <option value="desc">Decrescente</option>
                  </select>
                </div>
              </div>
              
              {/* Botão para limpar filtros */}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setFiltroCategoria('');
                    setFiltroFaixaPreco('');
                    setOrdenacao('nome');
                    setDirecaoOrdenacao('asc');
                    setBuscaMaterial('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
            
            {/* Adicionar Material da Central */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-blue-800">📦 Selecionar da Central de Materiais</h4>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {getMateriaisFilteredAndSorted().length} de {materiaisDisponiveis.length} materiais
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Material *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Digite para buscar material..."
                      value={buscaMaterial}
                      onChange={(e) => setBuscaMaterial(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <select
                      value={materialSelecionado}
                      onChange={(e) => setMaterialSelecionado(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                      size={buscaMaterial || filtroCategoria || filtroFaixaPreco ? Math.min(5, getMateriaisFilteredAndSorted().length) : 1}
                    >
                      <option value="">Selecione um material...</option>
                      {getMateriaisFilteredAndSorted()
                        .map((material: any, index: number) => (
                          <option key={index} value={material.nome}>
                            {material.nome} - Custo: R$ {material.valorCusto.toFixed(2)} | Venda: R$ {material.valorVenda.toFixed(2)}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={quantidadeMaterial || ''}
                    onChange={(e) => setQuantidadeMaterial(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 1, 2.5, 10"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={adicionarMaterialPredefinido}
                    disabled={!materialSelecionado || quantidadeMaterial <= 0}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    ✓ Adicionar
                  </button>
                </div>
              </div>

              {materialSelecionado && (
                <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Material selecionado:</strong> {materialSelecionado}
                    <br />
                    <strong>Valor de custo:</strong> R$ {materiaisDisponiveis.find((m: any) => m.nome === materialSelecionado)?.valorCusto.toFixed(2)}
                    <br />
                    <strong>Valor de venda:</strong> R$ {materiaisDisponiveis.find((m: any) => m.nome === materialSelecionado)?.valorVenda.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Adicionar Material Personalizado */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-600">🔧 Adicionar Material Personalizado</h4>
                <button
                  type="button"
                  onClick={() => setMostrarListaMateriais(!mostrarListaMateriais)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {mostrarListaMateriais ? 'Ocultar' : 'Expandir'}
                </button>
              </div>
              
              {mostrarListaMateriais && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={novoMaterial.material || ''}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, material: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do material"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={novoMaterial.quantidade || ''}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, quantidade: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 1, 2.5, 10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Custo (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={novoMaterial.valorCusto || ''}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, valorCusto: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Venda (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={novoMaterial.valorVenda || ''}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, valorVenda: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={adicionarMaterial}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Materiais Adicionados */}
            {(formData.materiaisUtilizados || []).length > 0 && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">Materiais Selecionados</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Material</th>
                        <th className="text-center py-2">Qtd</th>
                        <th className="text-right py-2">Custo Unit.</th>
                        <th className="text-right py-2">Venda Unit.</th>
                        <th className="text-right py-2">Custo Total</th>
                        <th className="text-right py-2">Venda Total</th>
                        <th className="text-center py-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(formData.materiaisUtilizados || []).map((material, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2">{material.material}</td>
                          <td className="text-center py-2">{material.quantidade}</td>
                          <td className="text-right py-2">R$ {material.valorCusto.toFixed(2)}</td>
                          <td className="text-right py-2">R$ {material.valorVenda.toFixed(2)}</td>
                          <td className="text-right py-2">R$ {(material.quantidade * material.valorCusto).toFixed(2)}</td>
                          <td className="text-right py-2">R$ {(material.quantidade * material.valorVenda).toFixed(2)}</td>
                          <td className="text-center py-2">
                            <button
                              type="button"
                              onClick={() => removerMaterial(index)}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totais */}
                <div className="mt-4 pt-4 border-t bg-gray-50 -m-4 p-4 rounded-b-lg">
                  <div className="flex justify-end space-x-8">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Custo:</div>
                      <div className="text-lg font-bold text-red-600">
                        R$ {formData.somaTotal?.custo.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Venda:</div>
                      <div className="text-lg font-bold text-green-600">
                        R$ {formData.somaTotal?.venda.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Margem:</div>
                      <div className="text-lg font-bold text-blue-600">
                        R$ {((formData.somaTotal?.venda || 0) - (formData.somaTotal?.custo || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assinaturas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Assinaturas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cirurgião Responsável
                </label>
                <input
                  type="text"
                  value={formData.assinaturas?.cirurgiao || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    assinaturas: { ...formData.assinaturas!, cirurgiao: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável pelo Preenchimento
                </label>
                <input
                  type="text"
                  value={formData.assinaturas?.responsavel || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    assinaturas: { ...formData.assinaturas!, responsavel: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Atualizar' : 'Salvar'} Custeio
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Custeios */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Custeios Cadastrados</h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por paciente, internação ou cirurgia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4">Internação</th>
                <th className="text-left py-3 px-4">Paciente</th>
                <th className="text-left py-3 px-4">Cirurgia</th>
                <th className="text-center py-3 px-4">Data</th>
                <th className="text-right py-3 px-4">Total Custo</th>
                <th className="text-right py-3 px-4">Total Venda</th>
                <th className="text-center py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCusteios.map((custeio) => (
                <tr key={custeio.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{custeio.numeroInternacao}</td>
                  <td className="py-3 px-4">{custeio.nomePaciente}</td>
                  <td className="py-3 px-4">{custeio.tipoCirurgia}</td>
                  <td className="text-center py-3 px-4">{custeio.data}</td>
                  <td className="text-right py-3 px-4">R$ {custeio.somaTotal.custo.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">R$ {custeio.somaTotal.venda.toFixed(2)}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(custeio)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => custeio.id && handleDelete(custeio.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCusteios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum custeio encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CusteioCirurgicoPage;