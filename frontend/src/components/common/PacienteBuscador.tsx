import React, { useState, useEffect } from 'react';
import { Paciente } from '../../types';
import DataIntegrationService from '../../services/dataIntegration';

interface PacienteBuscadorProps {
  onPacienteSelecionado: (paciente: Paciente) => void;
  placeholder?: string;
  className?: string;
  showInternacaoInfo?: boolean;
  filtrarPorStatus?: string[];
}

const PacienteBuscador: React.FC<PacienteBuscadorProps> = ({
  onPacienteSelecionado,
  placeholder = "Buscar paciente (nome, CPF ou nº internação)",
  className = "",
  showInternacaoInfo = true,
  filtrarPorStatus = []
}) => {
  const [query, setQuery] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);

  useEffect(() => {
    const buscarPacientes = async () => {
      if (query.length < 2) {
        setPacientes([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        let resultados = await DataIntegrationService.searchPacientes(query);
        
        // Filtrar por status se especificado
        if (filtrarPorStatus.length > 0) {
          resultados = resultados.filter(p => 
            p.statusAtual && filtrarPorStatus.includes(p.statusAtual)
          );
        }
        
        setPacientes(resultados);
        setShowDropdown(true);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        setPacientes([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(buscarPacientes, 300);
    return () => clearTimeout(timeoutId);
  }, [query, filtrarPorStatus]);

  const handleSelectPaciente = (paciente: Paciente) => {
    setQuery(`${paciente.nome} - ${paciente.cpf}`);
    setShowDropdown(false);
    setPacientes([]); // Limpar a lista para evitar mostrar "Nenhum paciente encontrado"
    setPacienteSelecionado(paciente); // Marcar paciente como selecionado
    onPacienteSelecionado(paciente);
  };

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      'ambulatorial': 'bg-green-100 text-green-800',
      'internado': 'bg-blue-100 text-blue-800',
      'centro_cirurgico': 'bg-yellow-100 text-yellow-800',
      'uti': 'bg-red-100 text-red-800',
      'recuperacao': 'bg-purple-100 text-purple-800',
      'alta': 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
      'ambulatorial': 'Ambulatorial',
      'internado': 'Internado',
      'centro_cirurgico': 'Centro Cirúrgico',
      'uti': 'UTI',
      'recuperacao': 'Recuperação',
      'alta': 'Alta'
    };

    if (!status) return null;

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const getInternacaoAtiva = (paciente: Paciente) => {
    return paciente.internacoes?.find(i => i.status === 'ativa');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (pacienteSelecionado && e.target.value !== `${pacienteSelecionado.nome} - ${pacienteSelecionado.cpf}`) {
              setPacienteSelecionado(null); // Reset se usuário começar a digitar algo diferente
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {isLoading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showDropdown && pacientes.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {pacientes.map((paciente) => {
            const internacaoAtiva = getInternacaoAtiva(paciente);
            
            return (
              <div
                key={paciente.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectPaciente(paciente)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{paciente.nome}</div>
                    <div className="text-sm text-gray-600">
                      CPF: {paciente.cpf} | Idade: {paciente.idade} anos
                    </div>
                    {paciente.convenio && (
                      <div className="text-sm text-gray-600">
                        Convênio: {paciente.convenio}
                      </div>
                    )}
                    {showInternacaoInfo && internacaoAtiva && (
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Internação: {internacaoAtiva.numeroInternacao}</div>
                        <div>Unidade: {internacaoAtiva.unidade}</div>
                        {internacaoAtiva.quarto && (
                          <div>Quarto/Leito: {internacaoAtiva.quarto}/{internacaoAtiva.leito}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(paciente.statusAtual)}
                  </div>
                </div>
                {paciente.alergias?.possui && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <span className="font-medium text-red-800">⚠️ Alergias:</span>
                    <span className="text-red-700 ml-1">{paciente.alergias.descricao}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showDropdown && query.length >= 2 && pacientes.length === 0 && !isLoading && !pacienteSelecionado && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            Nenhum paciente encontrado
          </div>
        </div>
      )}
    </div>
  );
};

export default PacienteBuscador;
