import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavSubItem {
  path: string;
  label: string;
}

interface NavItem {
  path: string;
  label: string;
  subItems?: NavSubItem[];
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard' },
    { path: '/pacientes', label: 'Pacientes' },
    { path: '/funcionarios', label: 'Funcionários' },
    { path: '/estoque', label: 'Estoque' },
    { path: '/uti', label: 'UTI' },
    { 
      path: '/centro-cirurgico', 
      label: 'Centro Cirúrgico',
      subItems: [
        { path: '/centro-cirurgico-recepcao', label: 'Recepção CC' },
        { path: '/assistencia-intra-operatoria', label: 'Intra-Operatório' },
        { path: '/recuperacao-anestesica', label: 'Recuperação' },
        { path: '/controle-infeccao', label: 'CCIH' },
        { path: '/custeio-cirurgico', label: 'Custeio' },
      ]
    },
  ];

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="text-white text-2xl">🏥</div>
            <h1 className="text-white text-xl font-bold">Hospital Manager</h1>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
              
              if (item.subItems) {
                const handleMouseEnter = () => {
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    setDropdownTimeout(null);
                  }
                  setIsDropdownOpen(true);
                };

                const handleMouseLeave = () => {
                  const timeout = setTimeout(() => {
                    setIsDropdownOpen(false);
                  }, 200); // Delay de 200ms antes de fechar
                  setDropdownTimeout(timeout);
                };

                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`px-3 py-2 rounded-md transition-colors flex items-center ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      {item.label}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-2 z-50 border"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              location.pathname === subItem.path
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
                
                if (item.subItems) {
                  return (
                    <div key={item.path} className="space-y-1">
                      <div
                        className={`block px-3 py-2 rounded-md font-medium ${
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'text-blue-100'
                        }`}
                      >
                        {item.label}
                      </div>
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`block px-6 py-2 rounded-md transition-colors text-sm ${
                            location.pathname === subItem.path
                              ? 'bg-blue-800 text-white'
                              : 'text-blue-200 hover:bg-blue-500 hover:text-white'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
