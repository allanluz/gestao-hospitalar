import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ControleInfeccaoHospitalar } from '../types/centro-cirurgico';

const ControleInfeccaoPage: React.FC = () => {
  const [controles, setControles] = useState<ControleInfeccaoHospitalar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<ControleInfeccaoHospitalar>>({
    dataCirurgia: '',
    nome: '',
    idade: 0,
    classificacao: 'sus',
    sexo: 'm',
    unidadeInternacao: '',
    numeroInternacao: '',
    admissao: {
      data: '',
      horario: ''
    },
    antecedentes: {
      tabagista: false,
      diabetico: false,
      renalCronico: false,
      obeso: false,
      hipertenso: false
    },
    tempoInternacao: {
      unidade: 0,
      uti: 0,
      infeccaoPrevia: false
    },
    preOperatorio: {
      tricotomiaHoras: 0,
      local: '',
      preparoSala: false,
      antissepticos: {
        clorexidinaDegermante: false,
        pvpiDegermante: false,
        clorexidinaAlcoolica: false,
        pvpiTintura: false,
        clorexidinaAquosa: false,
        pvpiTopico: false
      }
    },
    sondagens: {
      vesicalDemora: false,
      nasogastrica: false,
      vesicalAlivio: false,
      responsavel: ''
    },
    antibioticoProfilatico: '',
    transfusoes: {
      sangue: false,
      plasma: false,
      quantidade: ''
    },
    cirurgia: {
      periodo: 'm',
      reoperacao: false,
      duracao: 0,
      asa: '',
      cpc: '',
      realizada: '',
      cirurgiao: '',
      auxiliar: '',
      anestesia: '',
      anestesiologista: '',
      circulantes: []
    },
    proteses: false,
    drenos: {
      succao: false,
      penrose: false,
      torax: false,
      kheer: false,
      outros: '',
      local: ''
    },
    intercorrencias: ''
  });

  useEffect(() => {
    fetchControles();
  }, []);

  const fetchControles = async () => {
    try {
      const data = await api.getControlesInfeccao();
      setControles(Array.isArray(data) ? data as ControleInfeccaoHospitalar[] : []);
    } catch (error) {
      console.error('Erro ao buscar controles:', error);
      setControles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateControleInfeccao(editingId, formData);
      } else {
        await api.createControleInfeccao(formData);
      }
      resetForm();
      fetchControles();
    } catch (error) {
      console.error('Erro ao salvar controle:', error);
    }
  };

  const handleEdit = (controle: ControleInfeccaoHospitalar) => {
    setFormData(controle);
    setEditingId(controle.id || null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.deleteControleInfeccao(id);
        fetchControles();
      } catch (error) {
        console.error('Erro ao excluir controle:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dataCirurgia: '',
      nome: '',
      idade: 0,
      classificacao: 'sus',
      sexo: 'm',
      unidadeInternacao: '',
      numeroInternacao: '',
      admissao: {
        data: '',
        horario: ''
      },
      antecedentes: {
        tabagista: false,
        diabetico: false,
        renalCronico: false,
        obeso: false,
        hipertenso: false
      },
      tempoInternacao: {
        unidade: 0,
        uti: 0,
        infeccaoPrevia: false
      },
      preOperatorio: {
        tricotomiaHoras: 0,
        local: '',
        preparoSala: false,
        antissepticos: {
          clorexidinaDegermante: false,
          pvpiDegermante: false,
          clorexidinaAlcoolica: false,
          pvpiTintura: false,
          clorexidinaAquosa: false,
          pvpiTopico: false
        }
      },
      sondagens: {
        vesicalDemora: false,
        nasogastrica: false,
        vesicalAlivio: false,
        responsavel: ''
      },
      antibioticoProfilatico: '',
      transfusoes: {
        sangue: false,
        plasma: false,
        quantidade: ''
      },
      cirurgia: {
        periodo: 'm',
        reoperacao: false,
        duracao: 0,
        asa: '',
        cpc: '',
        realizada: '',
        cirurgiao: '',
        auxiliar: '',
        anestesia: '',
        anestesiologista: '',
        circulantes: []
      },
      proteses: false,
      drenos: {
        succao: false,
        penrose: false,
        torax: false,
        kheer: false,
        outros: '',
        local: ''
      },
      intercorrencias: ''
    });
    setEditingId(null);
  };

  const filteredControles = Array.isArray(controles) ? controles.filter(controle =>
    controle.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    controle.numeroInternacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    controle.cirurgia?.cirurgiao?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Controle de Infecção Hospitalar</h1>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Paciente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Informações do Paciente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Paciente *
                </label>
                <input
                  type="text"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo *
                </label>
                <select
                  value={formData.sexo || 'm'}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value as 'm' | 'f' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="m">Masculino</option>
                  <option value="f">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classificação *
                </label>
                <select
                  value={formData.classificacao || 'sus'}
                  onChange={(e) => setFormData({ ...formData, classificacao: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="sus">SUS</option>
                  <option value="particular">Particular</option>
                  <option value="scs">SCS</option>
                  <option value="pacote">Pacote</option>
                  <option value="cassi">CASSI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Internação *
                </label>
                <input
                  type="text"
                  value={formData.unidadeInternacao || ''}
                  onChange={(e) => setFormData({ ...formData, unidadeInternacao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Cirurgia *
                </label>
                <input
                  type="date"
                  value={formData.dataCirurgia || ''}
                  onChange={(e) => setFormData({ ...formData, dataCirurgia: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={formData.admissao?.data || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    admissao: { 
                      ...formData.admissao!, 
                      data: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Antecedentes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Antecedentes</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tabagista"
                  checked={formData.antecedentes?.tabagista || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    antecedentes: { 
                      ...formData.antecedentes!, 
                      tabagista: e.target.checked 
                    }
                  })}
                />
                <label htmlFor="tabagista" className="text-sm text-gray-700">
                  Tabagista
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="diabetico"
                  checked={formData.antecedentes?.diabetico || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    antecedentes: { 
                      ...formData.antecedentes!, 
                      diabetico: e.target.checked 
                    }
                  })}
                />
                <label htmlFor="diabetico" className="text-sm text-gray-700">
                  Diabético
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="renalCronico"
                  checked={formData.antecedentes?.renalCronico || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    antecedentes: { 
                      ...formData.antecedentes!, 
                      renalCronico: e.target.checked 
                    }
                  })}
                />
                <label htmlFor="renalCronico" className="text-sm text-gray-700">
                  Renal Crônico
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="obeso"
                  checked={formData.antecedentes?.obeso || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    antecedentes: { 
                      ...formData.antecedentes!, 
                      obeso: e.target.checked 
                    }
                  })}
                />
                <label htmlFor="obeso" className="text-sm text-gray-700">
                  Obeso
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hipertenso"
                  checked={formData.antecedentes?.hipertenso || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    antecedentes: { 
                      ...formData.antecedentes!, 
                      hipertenso: e.target.checked 
                    }
                  })}
                />
                <label htmlFor="hipertenso" className="text-sm text-gray-700">
                  Hipertenso
                </label>
              </div>
            </div>
          </div>

          {/* Informações da Cirurgia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Informações da Cirurgia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cirurgião
                </label>
                <input
                  type="text"
                  value={formData.cirurgia?.cirurgiao || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cirurgia: { 
                      ...formData.cirurgia!, 
                      cirurgiao: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anestesiologista
                </label>
                <input
                  type="text"
                  value={formData.cirurgia?.anestesiologista || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cirurgia: { 
                      ...formData.cirurgia!, 
                      anestesiologista: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cirurgia Realizada
                </label>
                <input
                  type="text"
                  value={formData.cirurgia?.realizada || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cirurgia: { 
                      ...formData.cirurgia!, 
                      realizada: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  value={formData.cirurgia?.duracao || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cirurgia: { 
                      ...formData.cirurgia!, 
                      duracao: parseInt(e.target.value) || 0 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select
                  value={formData.cirurgia?.periodo || 'm'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cirurgia: { 
                      ...formData.cirurgia!, 
                      periodo: e.target.value as 'm' | 't' | 'n' 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="m">Manhã</option>
                  <option value="t">Tarde</option>
                  <option value="n">Noite</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="reoperacao"
                  checked={formData.cirurgia?.reoperacao || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    cirurgia: { 
                      ...formData.cirurgia!, 
                      reoperacao: e.target.checked 
                    }
                  })}
                />
                <label htmlFor="reoperacao" className="text-sm text-gray-700">
                  Reoperação
                </label>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="proteses"
                  checked={formData.proteses || false}
                  onChange={(e) => setFormData({ ...formData, proteses: e.target.checked })}
                />
                <label htmlFor="proteses" className="text-sm text-gray-700">
                  Próteses
                </label>
              </div>
            </div>
          </div>

          {/* Antibiótico Profilático */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antibiótico Profilático
            </label>
            <input
              type="text"
              value={formData.antibioticoProfilatico || ''}
              onChange={(e) => setFormData({ ...formData, antibioticoProfilatico: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do antibiótico utilizado"
            />
          </div>

          {/* Intercorrências */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intercorrências
            </label>
            <textarea
              value={formData.intercorrencias || ''}
              onChange={(e) => setFormData({ ...formData, intercorrencias: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Descreva as intercorrências observadas..."
            />
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

      {/* Lista de Controles */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Registros de Controle</h2>
            <input
              type="text"
              placeholder="Buscar por nome, internação ou cirurgião..."
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
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredControles.map((controle) => (
                <tr key={controle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{controle.nome}</div>
                    <div className="text-sm text-gray-500">{controle.idade} anos</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {controle.numeroInternacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{controle.cirurgia?.realizada}</div>
                    <div className="text-sm text-gray-500">{controle.cirurgia?.duracao} min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {controle.dataCirurgia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {controle.cirurgia?.cirurgiao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(controle)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(controle.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredControles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControleInfeccaoPage;
