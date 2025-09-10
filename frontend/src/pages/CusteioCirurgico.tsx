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

  useEffect(() => {
    fetchCusteios();
  }, []);

  useEffect(() => {
    calcularTotais();
  }, [formData.materiaisUtilizados]);

  const fetchCusteios = async () => {
    try {
      const data = await api.getCusteios();
      setCusteios(Array.isArray(data) ? data as CusteioCircurgico[] : []);
    } catch (error) {
      console.error('Erro ao buscar custeios:', error);
      setCusteios([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotais = () => {
    const totalCusto = formData.materiaisUtilizados?.reduce((acc, material) => 
      acc + (material.quantidade * material.valorCusto), 0) || 0;
    const totalVenda = formData.materiaisUtilizados?.reduce((acc, material) => 
      acc + (material.quantidade * material.valorVenda), 0) || 0;

    setFormData(prev => ({
      ...prev,
      somaTotal: {
        custo: totalCusto,
        venda: totalVenda
      }
    }));
  };

  const calcularDuracaoTotal = (inicio: string, fim: string): number => {
    if (!inicio || !fim) return 0;
    
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFim, minutoFim] = fim.split(':').map(Number);
    
    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosFim = horaFim * 60 + minutoFim;
    
    return Math.max(0, minutosFim - minutosInicio);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCusteioCircurgico(editingId, formData);
      } else {
        await api.createCusteioCircurgico(formData);
      }
      resetForm();
      fetchCusteios();
    } catch (error) {
      console.error('Erro ao salvar custeio:', error);
    }
  };

  const handleEdit = (custeio: CusteioCircurgico) => {
    setFormData(custeio);
    setEditingId(custeio.id || null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.deleteCusteioCircurgico(id);
        fetchCusteios();
      } catch (error) {
        console.error('Erro ao excluir custeio:', error);
      }
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

  const adicionarMaterial = () => {
    if (novoMaterial.material && novoMaterial.quantidade && novoMaterial.valorCusto && novoMaterial.valorVenda) {
      const material: MaterialUtilizado = {
        quantidade: novoMaterial.quantidade || 0,
        material: novoMaterial.material || '',
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

  const removerMaterial = (index: number) => {
    const materiais = [...(formData.materiaisUtilizados || [])];
    materiais.splice(index, 1);
    setFormData({ ...formData, materiaisUtilizados: materiais });
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

  const atualizarAssistente = (index: number, valor: string) => {
    const assistentes = [...(formData.equipe?.assistentes || [])];
    assistentes[index] = valor;
    setFormData({
      ...formData,
      equipe: {
        ...formData.equipe!,
        assistentes
      }
    });
  };

  const atualizarInstrumentadora = (index: number, valor: string) => {
    const instrumentadoras = [...(formData.equipe?.instrumentadoras || [])];
    instrumentadoras[index] = valor;
    setFormData({
      ...formData,
      equipe: {
        ...formData.equipe!,
        instrumentadoras
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

  const filteredCusteios = Array.isArray(custeios) ? custeios.filter(custeio =>
    custeio.nomePaciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custeio.numeroInternacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custeio.equipe?.cirurgiao?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Internação *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Paciente *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quarto *
                </label>
                <input
                  type="text"
                  value={formData.quarto || ''}
                  onChange={(e) => setFormData({ ...formData, quarto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cirurgia *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Cirurgia *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porte Cirúrgico *
                </label>
                <select
                  value={formData.porte || '0'}
                  onChange={(e) => setFormData({ ...formData, porte: e.target.value as '0' | '1' | '2' | '3' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="0">Porte 0</option>
                  <option value="1">Porte 1</option>
                  <option value="2">Porte 2</option>
                  <option value="3">Porte 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classificação
                </label>
                <input
                  type="text"
                  value={formData.classificacao || ''}
                  onChange={(e) => setFormData({ ...formData, classificacao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Eletiva, Urgência, etc."
                />
              </div>
            </div>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Horários da Cirurgia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Início
                </label>
                <input
                  type="time"
                  value={formData.horarios?.inicio || ''}
                  onChange={(e) => {
                    const novoHorario = { 
                      ...formData.horarios!, 
                      inicio: e.target.value,
                      total: calcularDuracaoTotal(e.target.value, formData.horarios?.fim || '')
                    };
                    setFormData({ ...formData, horarios: novoHorario });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fim
                </label>
                <input
                  type="time"
                  value={formData.horarios?.fim || ''}
                  onChange={(e) => {
                    const novoHorario = { 
                      ...formData.horarios!, 
                      fim: e.target.value,
                      total: calcularDuracaoTotal(formData.horarios?.inicio || '', e.target.value)
                    };
                    setFormData({ ...formData, horarios: novoHorario });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total (minutos)
                </label>
                <input
                  type="number"
                  value={formData.horarios?.total || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Equipe Cirúrgica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Equipe Cirúrgica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cirurgião *
                </label>
                <input
                  type="text"
                  value={formData.equipe?.cirurgiao || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      cirurgiao: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anestesista
                </label>
                <input
                  type="text"
                  value={formData.equipe?.anestesista || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      anestesista: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Circulante
                </label>
                <input
                  type="text"
                  value={formData.equipe?.circulante || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      circulante: e.target.value 
                    } 
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
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  + Adicionar Assistente
                </button>
              </div>
              
              {formData.equipe?.assistentes?.map((assistente, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={assistente}
                    onChange={(e) => atualizarAssistente(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={`Assistente ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removerAssistente(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Remover
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
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  + Adicionar Instrumentadora
                </button>
              </div>
              
              {formData.equipe?.instrumentadoras?.map((instrumentadora, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={instrumentadora}
                    onChange={(e) => atualizarInstrumentadora(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={`Instrumentadora ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removerInstrumentadora(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Materiais Utilizados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Materiais Utilizados</h3>
            
            {/* Adicionar Novo Material */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-600 mb-3">Adicionar Material</h4>
              
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
                    value={novoMaterial.quantidade || ''}
                    onChange={(e) => setNovoMaterial({ ...novoMaterial, quantidade: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoMaterial.valorCusto || ''}
                    onChange={(e) => setNovoMaterial({ ...novoMaterial, valorCusto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoMaterial.valorVenda || ''}
                    onChange={(e) => setNovoMaterial({ ...novoMaterial, valorVenda: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={adicionarMaterial}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Materiais */}
            {formData.materiaisUtilizados && formData.materiaisUtilizados.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venda Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venda Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.materiaisUtilizados.map((material, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.material}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.quantidade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {material.valorCusto.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {(material.quantidade * material.valorCusto).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {material.valorVenda.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {(material.quantidade * material.valorVenda).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => removerMaterial(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totais */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Custo
                  </label>
                  <div className="text-lg font-semibold text-blue-600">
                    R$ {formData.somaTotal?.custo?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Venda
                  </label>
                  <div className="text-lg font-semibold text-green-600">
                    R$ {formData.somaTotal?.venda?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Assinaturas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cirurgião Responsável
                </label>
                <input
                  type="text"
                  value={formData.assinaturas?.cirurgiao || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    assinaturas: { 
                      ...formData.assinaturas!, 
                      cirurgiao: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável pelo Custeio
                </label>
                <input
                  type="text"
                  value={formData.assinaturas?.responsavel || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    assinaturas: { 
                      ...formData.assinaturas!, 
                      responsavel: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Custeios */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Registros de Custeio</h2>
            <input
              type="text"
              placeholder="Buscar por paciente, internação ou cirurgião..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cirurgia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cirurgião
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCusteios.map((custeio) => (
                <tr key={custeio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{custeio.nomePaciente}</div>
                    <div className="text-sm text-gray-500">{custeio.idade} anos - Quarto {custeio.quarto}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {custeio.numeroInternacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{custeio.tipoCirurgia}</div>
                    <div className="text-sm text-gray-500">Porte {custeio.porte} - {custeio.horarios?.total}min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {custeio.data}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {custeio.equipe?.cirurgiao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">C: R$ {custeio.somaTotal?.custo?.toFixed(2) || '0.00'}</div>
                    <div className="text-sm text-gray-500">V: R$ {custeio.somaTotal?.venda?.toFixed(2) || '0.00'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(custeio)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(custeio.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCusteios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CusteioCirurgicoPage;
