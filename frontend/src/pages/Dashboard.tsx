import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiService.getDashboard() as DashboardData;
        setDashboardData(data);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      color: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total de Funcionários',
      value: dashboardData?.totalFuncionarios || 0,
      emoji: '👨‍⚕️',
      color: 'bg-green-500',
      textColor: 'text-green-700'
    },
    {
      title: 'Itens em Estoque',
      value: dashboardData?.totalItensEstoque || 0,
      emoji: '📦',
      color: 'bg-purple-500',
      textColor: 'text-purple-700'
    },
    {
      title: 'Estoque Baixo',
      value: dashboardData?.itensEstoqueBaixo || 0,
      emoji: '⚠️',
      color: 'bg-red-500',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema hospitalar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <span className="text-white text-xl">{card.emoji}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dashboardData?.itensEstoqueBaixo && dashboardData.itensEstoqueBaixo > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <h3 className="text-lg font-semibold text-red-800">Atenção: Estoque Baixo</h3>
          </div>
          <p className="text-red-700 mt-1">
            Existem {dashboardData.itensEstoqueBaixo} itens com estoque abaixo do mínimo. 
            Verifique a seção de estoque para mais detalhes.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3">👥</span>
                <span>Cadastrar Novo Paciente</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-purple-500 mr-3">📦</span>
                <span>Movimentar Estoque</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">👨‍⚕️</span>
                <span>Cadastrar Funcionário</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Última atualização:</span>
              <span className="text-gray-900">
                {dashboardData?.timestamp ? 
                  new Date(dashboardData.timestamp).toLocaleString('pt-BR') : 
                  'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status do sistema:</span>
              <span className="text-green-600 font-semibold">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Versão:</span>
              <span className="text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
