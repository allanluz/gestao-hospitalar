import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavSubItem {
  path: string;
  label: string;
  icon: string;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
  subItems?: NavSubItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: '📊' 
    },
    { 
      path: '/pacientes', 
      label: 'Pacientes', 
      icon: '👥' 
    },
    { 
      path: '/funcionarios', 
      label: 'Funcionários', 
      icon: '👨‍⚕️' 
    },
    { 
      path: '/estoque', 
      label: 'Estoque', 
      icon: '📦' 
    },
    { 
      path: '/medicamentos', 
      label: 'Medicamentos', 
      icon: '💊' 
    },
    { 
      path: '/prescricoes', 
      label: 'Prescrições', 
      icon: '📋' 
    },
    { 
      path: '/movimentacoes', 
      label: 'Movimentações', 
      icon: '📦' 
    },
    { 
      path: '/dispensacoes', 
      label: 'Dispensações', 
      icon: '💊' 
    },
    { 
      path: '/gerenciamento-materiais', 
      label: 'Materiais', 
      icon: '🧰' 
    },
    { 
      path: '/uti', 
      label: 'UTI', 
      icon: '🏥' 
    },
    { 
      path: '/centro-cirurgico', 
      label: 'Centro Cirúrgico',
      icon: '⚕️',
      subItems: [
        { path: '/centro-cirurgico-recepcao', label: 'Recepção CC', icon: '📋' },
        { path: '/assistencia-intra-operatoria', label: 'Intra-Operatório', icon: '🔬' },
        { path: '/recuperacao-anestesica', label: 'Recuperação', icon: '😴' },
        { path: '/controle-infeccao', label: 'CCIH', icon: '🦠' },
        { path: '/custeio-cirurgico', label: 'Custeio', icon: '💰' },
      ]
    },
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.path ? null : item.path);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const hasActiveSubItem = (item: NavItem) => 
    item.subItems && item.subItems.some(sub => location.pathname === sub.path);

  return (
    <>
      {/* Overlay para mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 
        shadow-2xl z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-72 lg:w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="text-white text-2xl">🏥</div>
            {!isCollapsed && (
              <div>
                <h1 className="text-white text-lg font-bold">Hospital Manager</h1>
                <p className="text-blue-200 text-xs">Sistema de Gestão</p>
              </div>
            )}
          </div>
          
          {/* Toggle button - apenas desktop */}
          <button
            onClick={onToggle}
            className="hidden lg:block text-white hover:bg-blue-700 p-1 rounded transition-colors"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-3 py-4 space-y-2">
            {navItems.map((item) => {
              const itemIsActive = isActive(item.path) || hasActiveSubItem(item);
              const isExpanded = expandedItem === item.path;
              
              return (
                <div key={item.path}>
                  {/* Item principal */}
                  {item.subItems ? (
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`
                        w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                        group relative
                        ${itemIsActive 
                          ? 'bg-blue-700 text-white shadow-lg' 
                          : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-xl mr-3 flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left font-medium">{item.label}</span>
                          <svg 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                      
                      {/* Tooltip para modo colapsado */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded 
                                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                                      whitespace-nowrap z-10">
                          {item.label}
                        </div>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`
                        flex items-center px-3 py-3 rounded-lg transition-all duration-200
                        group relative
                        ${itemIsActive 
                          ? 'bg-blue-700 text-white shadow-lg' 
                          : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-xl mr-3 flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                      
                      {/* Tooltip para modo colapsado */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded 
                                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                                      whitespace-nowrap z-10">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Subitens */}
                  {item.subItems && !isCollapsed && isExpanded && (
                    <div className="mt-2 ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`
                            flex items-center px-3 py-2 rounded-md transition-all duration-200
                            text-sm
                            ${isActive(subItem.path)
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'text-blue-200 hover:bg-blue-700/50 hover:text-white'
                            }
                          `}
                        >
                          <span className="text-base mr-3 flex-shrink-0">{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          {!isCollapsed && (
            <div className="text-center">
              <p className="text-blue-200 text-xs">v1.0.0</p>
              <p className="text-blue-300 text-xs mt-1">© 2025 Hospital Manager</p>
            </div>
          )}
          
          {/* Botão de fechar para mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden w-full mt-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Fechar Menu
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
