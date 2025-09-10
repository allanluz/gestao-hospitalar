import React, { useState } from 'react';

interface IndicacaoCorporalProps {
  onIndicacaoChange: (indicacao: any) => void;
  indicacaoAtual?: any;
}

const IndicacaoCorporal: React.FC<IndicacaoCorporalProps> = ({ onIndicacaoChange, indicacaoAtual }) => {
  const [pontosSelecionados, setPontosSelecionados] = useState<Array<{id: string, x: number, y: number, descricao: string}>>(indicacaoAtual || []);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pontoEditando, setPontoEditando] = useState<{x: number, y: number} | null>(null);
  const [descricaoPonto, setDescricaoPonto] = useState('');

  const handleClickCorpo = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setPontoEditando({ x, y });
    setDescricaoPonto('');
    setMostrarModal(true);
  };

  const adicionarPonto = () => {
    if (pontoEditando && descricaoPonto.trim()) {
      const novoPonto = {
        id: Date.now().toString(),
        x: pontoEditando.x,
        y: pontoEditando.y,
        descricao: descricaoPonto
      };
      
      const novosPontos = [...pontosSelecionados, novoPonto];
      setPontosSelecionados(novosPontos);
      onIndicacaoChange(novosPontos);
      setMostrarModal(false);
      setPontoEditando(null);
      setDescricaoPonto('');
    }
  };

  const removerPonto = (id: string) => {
    const novosPontos = pontosSelecionados.filter(p => p.id !== id);
    setPontosSelecionados(novosPontos);
    onIndicacaoChange(novosPontos);
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <h4 className="text-md font-semibold mb-3 text-gray-700">Indicação Corporal</h4>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Corpo Humano - Vista Frontal */}
        <div className="flex-1">
          <h5 className="text-sm font-medium mb-2">Vista Frontal</h5>
          <div 
            className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            style={{ aspectRatio: '1/1.5', minHeight: '300px' }}
            onClick={handleClickCorpo}
          >
            {/* SVG Corpo Humano Simplificado */}
            <svg 
              viewBox="0 0 200 300" 
              className="w-full h-full"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* Cabeça */}
              <ellipse cx="100" cy="30" rx="25" ry="30" fill="none" stroke="#666" strokeWidth="2"/>
              
              {/* Tronco */}
              <rect x="70" y="60" width="60" height="120" rx="10" fill="none" stroke="#666" strokeWidth="2"/>
              
              {/* Braços */}
              <rect x="30" y="70" width="40" height="15" rx="7" fill="none" stroke="#666" strokeWidth="2"/>
              <rect x="130" y="70" width="40" height="15" rx="7" fill="none" stroke="#666" strokeWidth="2"/>
              <rect x="25" y="85" width="15" height="60" rx="7" fill="none" stroke="#666" strokeWidth="2"/>
              <rect x="160" y="85" width="15" height="60" rx="7" fill="none" stroke="#666" strokeWidth="2"/>
              
              {/* Pernas */}
              <rect x="80" y="180" width="15" height="80" rx="7" fill="none" stroke="#666" strokeWidth="2"/>
              <rect x="105" y="180" width="15" height="80" rx="7" fill="none" stroke="#666" strokeWidth="2"/>
              
              {/* Pés */}
              <ellipse cx="87" cy="270" rx="12" ry="8" fill="none" stroke="#666" strokeWidth="2"/>
              <ellipse cx="113" cy="270" rx="12" ry="8" fill="none" stroke="#666" strokeWidth="2"/>
            </svg>
            
            {/* Pontos marcados */}
            {pontosSelecionados.map((ponto) => (
              <div
                key={ponto.id}
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2 cursor-pointer hover:bg-red-600"
                style={{ left: `${ponto.x}%`, top: `${ponto.y}%` }}
                title={ponto.descricao}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Remover marcação: ${ponto.descricao}?`)) {
                    removerPonto(ponto.id);
                  }
                }}
              >
                <span className="absolute top-5 left-0 bg-black text-white text-xs px-1 py-0.5 rounded whitespace-nowrap z-10 opacity-0 group-hover:opacity-100">
                  {ponto.descricao}
                </span>
              </div>
            ))}
            
            {/* Instruções */}
            <div className="absolute bottom-2 left-2 right-2 text-center text-xs text-gray-500 bg-white bg-opacity-80 rounded p-1">
              Clique no corpo para adicionar marcações
            </div>
          </div>
        </div>

        {/* Lista de Pontos */}
        <div className="flex-1 lg:max-w-xs">
          <h5 className="text-sm font-medium mb-2">Marcações ({pontosSelecionados.length})</h5>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {pontosSelecionados.map((ponto, index) => (
              <div key={ponto.id} className="bg-gray-50 p-2 rounded border">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-red-600">#{index + 1}</span>
                  <button
                    onClick={() => removerPonto(ponto.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-700 mt-1">{ponto.descricao}</p>
                <p className="text-xs text-gray-500">
                  Posição: {ponto.x.toFixed(1)}%, {ponto.y.toFixed(1)}%
                </p>
              </div>
            ))}
            {pontosSelecionados.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma marcação adicionada
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para adicionar descrição */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Adicionar Marcação</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da marcação:
              </label>
              <textarea
                value={descricaoPonto}
                onChange={(e) => setDescricaoPonto(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ex: Local da incisão, área de dor, ferimento..."
                autoFocus
              />
            </div>
            
            {pontoEditando && (
              <p className="text-xs text-gray-500 mb-4">
                Posição: {pontoEditando.x.toFixed(1)}%, {pontoEditando.y.toFixed(1)}%
              </p>
            )}
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setPontoEditando(null);
                  setDescricaoPonto('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarPonto}
                disabled={!descricaoPonto.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndicacaoCorporal;
