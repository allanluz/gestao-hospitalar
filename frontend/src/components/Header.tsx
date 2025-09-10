import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, title = 'Dashboard' }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu toggle para mobile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">Sistema de Gestão Hospitalar</p>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a9 9 0 1 0-12.728 0L5 17h5m5 0v1a3 3 0 0 1-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil do usuário */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">Administrador</p>
              <p className="text-xs text-gray-500">admin@hospital.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
