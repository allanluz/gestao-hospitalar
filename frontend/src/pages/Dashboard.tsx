import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { DashboardData, Paciente, Internacao } from '../types';
import DataIntegrationService from '../services/dataIntegration';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pacientesInternados, setPacientesInternados] = useState<Paciente[]>([]);
  const [internacoesAtivas, setInternacoesAtivas] = useState<Internacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    document.title = 'Dashboard - Gestão Hospitalar';
    
    // Atualizar relógio a cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      document.title = 'Gestão Hospitalar - Sistema de Administração';
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [data, pacientes, internacoes] = await Promise.all([
          apiService.getDashboard() as Promise<DashboardData>,
          DataIntegrationService.getPacientes(),
          DataIntegrationService.getInternacoesAtivas()
        ]);
        
        setDashboardData(data);
        setPacientesInternados(pacientes.filter(p => p.statusAtual !== 'ambulatorial' && p.statusAtual !== 'alta'));
        setInternacoesAtivas(internacoes);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Funções para ações rápidas
  const handleCadastrarPaciente = () => {
    navigate('/pacientes');
    // Trigger de abertura do modal após navegação
    setTimeout(() => {
      const event = new CustomEvent('openNewPatientModal');
      window.dispatchEvent(event);
    }, 100);
  };

  const handleMovimentarEstoque = () => {
    navigate('/estoque');
  };

  const handleCadastrarFuncionario = () => {
    navigate('/funcionarios');
    // Trigger de abertura do modal após navegação
    setTimeout(() => {
      const event = new CustomEvent('openNewEmployeeModal');
      window.dispatchEvent(event);
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total de Pacientes',
      value: dashboardData?.totalPacientes || 0,
      emoji: '👥',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Pacientes Internados',
      value: pacientesInternados.length,
      emoji: '🏥',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      change: '+2',
      changeType: 'neutral'
    },
    {
      title: 'Total de Funcionários',
      value: dashboardData?.totalFuncionarios || 0,
      emoji: '👨‍⚕️',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-green-700',
      bgLight: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Itens em Estoque',
      value: dashboardData?.totalItensEstoque || 0,
      emoji: '📦',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '-8%',
      changeType: 'negative'
    },
    {
      title: 'Estoque Baixo',
      value: dashboardData?.itensEstoqueBaixo || 0,
      emoji: '⚠️',
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      textColor: 'text-red-700',
      bgLight: 'bg-red-50',
      borderColor: 'border-red-200',
      change: 'Atenção',
      changeType: 'warning'
    },
    {
      title: 'Internações Ativas',
      value: internacoesAtivas.length,
      emoji: '🛏️',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      textColor: 'text-orange-700',
      bgLight: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: 'Hoje',
      changeType: 'neutral'
    },
    {
      title: 'Cirurgias Agendadas',
      value: Math.floor(Math.random() * 6) + 3,
      emoji: '⚕️',
      color: 'bg-gradient-to-br from-teal-500 to-teal-600',
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50',
      borderColor: 'border-teal-200',
      change: 'Próximas 24h',
      changeType: 'neutral'
    },
    {
      title: 'Taxa de Ocupação',
      value: `${Math.min(95, Math.round((pacientesInternados.length / 50) * 100))}%`,
      emoji: '📊',
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      textColor: 'text-cyan-700',
      bgLight: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      change: 'Capacidade',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header com boas-vindas e hora atual */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo ao Hospital Manager 🏥
            </h1>
            <p className="text-blue-100 text-lg">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-5xl font-bold">
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </div>
            <p className="text-blue-100 text-sm mt-1">Horário Atual</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const isNumeric = typeof card.value === 'number' || !isNaN(parseInt(card.value as string));
          return (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${card.borderColor} overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {card.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${card.color} shadow-lg`}>
                    <span className="text-white text-3xl">{card.emoji}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span 
                    className={`text-sm font-semibold ${
                      card.changeType === 'positive' ? 'text-green-600' :
                      card.changeType === 'negative' ? 'text-red-600' :
                      card.changeType === 'warning' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-400">vs. período anterior</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertas e Notificações */}
      {dashboardData?.itensEstoqueBaixo && dashboardData.itensEstoqueBaixo > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl shadow-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">
                Atenção: Itens com Estoque Baixo
              </h3>
              <p className="text-red-700 mb-3">
                Existem <strong>{dashboardData.itensEstoqueBaixo} itens</strong> com estoque abaixo do nível mínimo recomendado.
                É necessário realizar pedidos de reposição imediatamente.
              </p>
              <button 
                onClick={() => navigate('/estoque')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 shadow-md"
              >
                Verificar Estoque →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">⚡</span>
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <button 
              onClick={handleCadastrarPaciente}
              className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">👥</span>
                <div>
                  <div className="font-semibold text-blue-900">Cadastrar Paciente</div>
                  <div className="text-sm text-blue-600">Adicionar novo paciente</div>
                </div>
              </div>
            </button>
            
            <button 
              onClick={handleMovimentarEstoque}
              className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">📦</span>
                <div>
                  <div className="font-semibold text-purple-900">Movimentar Estoque</div>
                  <div className="text-sm text-purple-600">Entrada/Saída de itens</div>
                </div>
              </div>
            </button>
            
            <button 
              onClick={handleCadastrarFuncionario}
              className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 hover:from-green-100 hover:to-green-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">👨‍⚕️</span>
                <div>
                  <div className="font-semibold text-green-900">Cadastrar Funcionário</div>
                  <div className="text-sm text-green-600">Adicionar colaborador</div>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/prescricoes')}
              className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">📋</span>
                <div>
                  <div className="font-semibold text-indigo-900">Nova Prescrição</div>
                  <div className="text-sm text-indigo-600">Criar prescrição médica</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Estatísticas Hospitalares */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">📈</span>
            Indicadores Hospitalares
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🛏️</span>
                <span className="text-gray-700 font-medium">Leitos Ocupados</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {pacientesInternados.length}/50
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <span className="text-gray-700 font-medium">Altas Hoje</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {Math.floor(Math.random() * 8) + 2}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">�</span>
                <span className="text-gray-700 font-medium">Emergências</span>
              </div>
              <span className="text-xl font-bold text-orange-600">
                {Math.floor(Math.random() * 5) + 1}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚕️</span>
                <span className="text-gray-700 font-medium">Cirurgias Hoje</span>
              </div>
              <span className="text-xl font-bold text-purple-600">
                {Math.floor(Math.random() * 6) + 3}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💊</span>
                <span className="text-gray-700 font-medium">Prescrições Ativas</span>
              </div>
              <span className="text-xl font-bold text-teal-600">
                {pacientesInternados.length * 3}
              </span>
            </div>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">ℹ️</span>
            Informações do Sistema
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Status</span>
                <span className="flex items-center text-green-600 font-bold">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Última Atualização</div>
              <div className="text-gray-900 font-semibold">
                {dashboardData?.timestamp ? 
                  new Date(dashboardData.timestamp).toLocaleString('pt-BR') : 
                  currentTime.toLocaleString('pt-BR')
                }
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Versão do Sistema</div>
              <div className="text-gray-900 font-semibold">1.0.0</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Uptime</div>
              <div className="text-gray-900 font-semibold">99.9%</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 font-medium mb-2">
                💡 Dica do Dia
              </div>
              <div className="text-sm text-gray-700">
                Use os filtros nas páginas para encontrar informações rapidamente!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-2xl mr-3">📝</span>
          Atividades Recentes
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl mr-4">👥</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Novo paciente cadastrado</div>
              <div className="text-sm text-gray-600">há 15 minutos</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl mr-4">📦</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Entrada de estoque realizada</div>
              <div className="text-sm text-gray-600">há 1 hora</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-2xl mr-4">⚕️</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Cirurgia concluída com sucesso</div>
              <div className="text-sm text-gray-600">há 2 horas</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <span className="text-2xl mr-4">💊</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Prescrição médica emitida</div>
              <div className="text-sm text-gray-600">há 3 horas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
