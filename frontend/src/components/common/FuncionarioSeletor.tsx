import React, { useState, useEffect } from 'react';
import { Funcionario } from '../../types';
import DataIntegrationService from '../../services/dataIntegration';

interface FuncionarioSeletorProps {
  onFuncionarioSelecionado: (funcionario: Funcionario) => void;
  setor?: string;
  cargo?: string;
  placeholder?: string;
  className?: string;
  multiplo?: boolean;
  funcionariosSelecionados?: Funcionario[];
  showCrmCoren?: boolean;
}

const FuncionarioSeletor: React.FC<FuncionarioSeletorProps> = ({
  onFuncionarioSelecionado,
  setor,
  cargo,
  placeholder = "Selecionar funcionário",
  className = "",
  multiplo = false,
  funcionariosSelecionados = [],
  showCrmCoren = true
}) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarFuncionarios();
  }, [setor, cargo]);

  const carregarFuncionarios = async () => {
    setIsLoading(true);
    try {
      let funcionarios: Funcionario[] = [];
      
      if (setor && cargo) {
        // Se ambos especificados, filtrar por ambos
        const funcionariosSetor = await DataIntegrationService.getFuncionariosBySetor(setor);
        funcionarios = funcionariosSetor.filter(f => f.cargo === cargo);
      } else if (setor) {
        funcionarios = await DataIntegrationService.getFuncionariosBySetor(setor);
      } else if (cargo) {
        funcionarios = await DataIntegrationService.getFuncionariosByCargo(cargo);
      } else {
        funcionarios = await DataIntegrationService.getFuncionarios();
      }
      
      setFuncionarios(funcionarios);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const funcionariosFiltrados = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (funcionario.crm && funcionario.crm.includes(searchTerm)) ||
    (funcionario.coren && funcionario.coren.includes(searchTerm))
  );

  const handleSelectFuncionario = (funcionario: Funcionario) => {
    onFuncionarioSelecionado(funcionario);
    if (!multiplo) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const isSelecionado = (funcionario: Funcionario) => {
    return funcionariosSelecionados.some(f => f.id === funcionario.id);
  };

  const getDisplayText = () => {
    if (funcionariosSelecionados.length === 0) {
      return placeholder;
    }
    
    if (multiplo) {
      if (funcionariosSelecionados.length === 1) {
        return funcionariosSelecionados[0].nome;
      }
      return `${funcionariosSelecionados.length} funcionários selecionados`;
    }
    
    return funcionariosSelecionados[0]?.nome || placeholder;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
      >
        <span className={funcionariosSelecionados.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
          {getDisplayText()}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <div className="mt-2 text-sm text-gray-600">Carregando...</div>
              </div>
            ) : funcionariosFiltrados.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhum funcionário encontrado
              </div>
            ) : (
              funcionariosFiltrados.map((funcionario) => (
                <div
                  key={funcionario.id}
                  onClick={() => handleSelectFuncionario(funcionario)}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    isSelecionado(funcionario) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 flex items-center">
                        {multiplo && (
                          <input
                            type="checkbox"
                            checked={isSelecionado(funcionario)}
                            onChange={() => handleSelectFuncionario(funcionario)}
                            className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {funcionario.nome}
                      </div>
                      <div className="text-sm text-gray-600">
                        {funcionario.cargo} - {funcionario.setor}
                      </div>
                      {showCrmCoren && (funcionario.crm || funcionario.coren) && (
                        <div className="text-sm text-gray-600">
                          {funcionario.crm && `CRM: ${funcionario.crm}`}
                          {funcionario.coren && `COREN: ${funcionario.coren}`}
                          {funcionario.especialidade && ` | ${funcionario.especialidade}`}
                        </div>
                      )}
                    </div>
                    {isSelecionado(funcionario) && (
                      <div className="ml-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {(setor || cargo) && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600">
                Filtros ativos: 
                {setor && <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{setor}</span>}
                {cargo && <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full">{cargo}</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FuncionarioSeletor;
