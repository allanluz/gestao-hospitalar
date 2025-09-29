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
  placeholder = "Buscar funcionário...",
  className = "",
  multiplo = false,
  funcionariosSelecionados = [],
  showCrmCoren = true
}) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);

  useEffect(() => {
    const buscarFuncionarios = async () => {
      if (searchTerm.length < 2) {
        setFuncionarios([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const funcionariosEncontrados = await DataIntegrationService.searchFuncionarios({
          setor,
          cargo,
          searchTerm
        });
        
        setFuncionarios(funcionariosEncontrados);
        setShowDropdown(true);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        setFuncionarios([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(buscarFuncionarios, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, setor, cargo]);

  const handleSelectFuncionario = (funcionario: Funcionario) => {
    setSearchTerm(`${funcionario.nome}${funcionario.crm ? ` - CRM: ${funcionario.crm}` : ''}`);
    setShowDropdown(false);
    setFuncionarios([]); // Limpar a lista para evitar mostrar "Nenhum funcionário encontrado"
    setFuncionarioSelecionado(funcionario);
    onFuncionarioSelecionado(funcionario);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (funcionarioSelecionado && e.target.value !== `${funcionarioSelecionado.nome}${funcionarioSelecionado.crm ? ` - CRM: ${funcionarioSelecionado.crm}` : ''}`) {
              setFuncionarioSelecionado(null); // Reset se usuário começar a digitar algo diferente
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {isLoading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showDropdown && funcionarios.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {funcionarios.map((funcionario) => (
            <div
              key={funcionario.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelectFuncionario(funcionario)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{funcionario.nome}</div>
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
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && searchTerm.length >= 2 && funcionarios.length === 0 && !isLoading && !funcionarioSelecionado && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            Nenhum funcionário encontrado
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionarioSeletor;
