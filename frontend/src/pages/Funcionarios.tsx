import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Funcionario } from '../types';
import { buscarEnderecoPorCep, formatarCep, validarCep } from '../services/viaCep';

const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    setor: '',
    telefone: '',
    email: '',
    endereco: {
      rua: '',
      bairro: '',
      cidade: '',
      cep: '',
      uf: ''
    }
  });

  useEffect(() => {
    document.title = 'Funcionários - Gestão Hospitalar';
    return () => {
      document.title = 'Gestão Hospitalar - Sistema de Administração';
    };
  }, []);

  useEffect(() => {
    const handleOpenModal = () => {
      setShowModal(true);
      setEditingFuncionario(null);
    };

    window.addEventListener('openNewEmployeeModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openNewEmployeeModal', handleOpenModal);
    };
  }, []);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const data = await apiService.getFuncionarios() as Funcionario[];
      setFuncionarios(data);
    } catch (err) {
      setError('Erro ao carregar funcionários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFuncionario) {
        await apiService.updateFuncionario(editingFuncionario.id, formData);
      } else {
        await apiService.createFuncionario(formData);
      }
      fetchFuncionarios();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar funcionário:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await apiService.deleteFuncionario(id);
        fetchFuncionarios();
      } catch (err) {
        console.error('Erro ao excluir funcionário:', err);
      }
    }
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      cargo: funcionario.cargo,
      setor: funcionario.setor,
      telefone: funcionario.telefone,
      email: funcionario.email,
      endereco: funcionario.endereco || {
        rua: '',
        bairro: '',
        cidade: '',
        cep: '',
        uf: ''
      }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      cargo: '',
      setor: '',
      telefone: '',
      email: '',
      endereco: {
        rua: '',
        bairro: '',
        cidade: '',
        cep: '',
        uf: ''
      }
    });
    setEditingFuncionario(null);
    setShowModal(false);
    setCepError(null);
  };

  const handleCepChange = async (cep: string) => {
    const cepFormatado = formatarCep(cep);
    
    setFormData({
      ...formData,
      endereco: { ...formData.endereco, cep: cepFormatado }
    });

    setCepError(null);

    if (validarCep(cep)) {
      setCepLoading(true);
      try {
        const endereco = await buscarEnderecoPorCep(cep);
        if (endereco) {
          setFormData({
            ...formData,
            endereco: {
              ...formData.endereco,
              cep: cepFormatado,
              rua: endereco.logradouro,
              bairro: endereco.bairro,
              cidade: endereco.localidade,
              uf: endereco.uf
            }
          });
        }
      } catch (error) {
        setCepError(error instanceof Error ? error.message : 'Erro ao buscar CEP');
      } finally {
        setCepLoading(false);
      }
    }
  };

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Funcionários</h1>
        <button
          onClick={() => setShowModal(true)}
          data-action="novo-funcionario"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          ➕ Novo Funcionário
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          🔍
          <input
            type="text"
            placeholder="Buscar por nome ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFuncionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {funcionario.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.cargo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.setor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(funcionario)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(funcionario.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cargo</label>
                    <input
                      type="text"
                      required
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Setor</label>
                    <select
                      required
                      value={formData.setor}
                      onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Selecione um setor</option>
                      <option value="UTI">UTI</option>
                      <option value="Centro Cirúrgico">Centro Cirúrgico</option>
                      <option value="Enfermaria">Enfermaria</option>
                      <option value="Farmácia">Farmácia</option>
                      <option value="Administração">Administração</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                      type="text"
                      required
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Endereço</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CEP</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="00000-000"
                          maxLength={9}
                          value={formData.endereco.cep}
                          onChange={(e) => handleCepChange(e.target.value)}
                          className={`mt-1 block w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                            cepError ? 'border-red-300' : 'border-gray-300'
                          } ${cepLoading ? 'bg-gray-50' : ''}`}
                        />
                        {cepLoading && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      {cepError && (
                        <p className="mt-1 text-sm text-red-600">{cepError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">UF</label>
                      <input
                        type="text"
                        placeholder="SP"
                        maxLength={2}
                        value={formData.endereco.uf}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, uf: e.target.value.toUpperCase() }
                        })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cidade</label>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={formData.endereco.cidade}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, cidade: e.target.value }
                        })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logradouro</label>
                      <input
                        type="text"
                        placeholder="Rua, Avenida, etc."
                        value={formData.endereco.rua}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, rua: e.target.value }
                        })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bairro</label>
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={formData.endereco.bairro}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, bairro: e.target.value }
                        })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {editingFuncionario ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funcionarios;
