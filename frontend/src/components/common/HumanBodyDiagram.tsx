import React from 'react';

interface BodyMarker {
  x: number;
  y: number;
  note: string;
  id: string;
}

interface HumanBodyDiagramProps {
  markers: BodyMarker[];
  onAddMarker: (marker: Omit<BodyMarker, 'id'>) => void;
  onRemoveMarker: (id: string) => void;
}

const HumanBodyDiagram: React.FC<HumanBodyDiagramProps> = ({
  markers,
  onAddMarker,
  onRemoveMarker
}) => {
  const handleBodyClick = (event: React.MouseEvent<HTMLDivElement>, view: 'front' | 'back') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const note = prompt('Digite uma observação para este ponto:');
    if (note) {
      const markerWithView = {
        x,
        y,
        note: `${note} (${view === 'front' ? 'Frente' : 'Costas'})`
      };
      onAddMarker(markerWithView);
    }
  };

  const FrontBodySVG = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full">
      {/* Cabeça com mais detalhes */}
      <ellipse cx="100" cy="40" rx="25" ry="32" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Cabelo */}
      <path d="M75 25 Q100 10 125 25 Q120 35 100 35 Q80 35 75 25" fill="#6b7280" stroke="#374151" strokeWidth="1"/>
      
      {/* Pescoço mais realista */}
      <ellipse cx="100" cy="75" rx="12" ry="18" fill="#fdf2f8" stroke="#374151" strokeWidth="1.5"/>
      
      {/* Tronco mais anatômico */}
      <path d="M75 90 Q65 100 65 120 L65 160 Q65 180 75 190 L125 190 Q135 180 135 160 L135 120 Q135 100 125 90 Z" 
            fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Clavículas */}
      <line x1="80" y1="95" x2="120" y2="95" stroke="#9ca3af" strokeWidth="2"/>
      
      {/* Costelas (linhas sutis) */}
      <path d="M80 110 Q100 115 120 110" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      <path d="M82 125 Q100 130 118 125" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      <path d="M84 140 Q100 145 116 140" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      
      {/* Braços mais proporcionais */}
      <ellipse cx="55" cy="110" rx="15" ry="45" fill="#fdf2f8" stroke="#374151" strokeWidth="2" transform="rotate(-10 55 110)"/>
      <ellipse cx="145" cy="110" rx="15" ry="45" fill="#fdf2f8" stroke="#374151" strokeWidth="2" transform="rotate(10 145 110)"/>
      
      {/* Articulações dos cotovelos */}
      <circle cx="50" cy="150" r="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1"/>
      <circle cx="150" cy="150" r="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1"/>
      
      {/* Antebraços */}
      <ellipse cx="45" cy="185" rx="12" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="155" cy="185" rx="12" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Mãos mais detalhadas */}
      <ellipse cx="42" cy="225" rx="10" ry="15" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="158" cy="225" rx="10" ry="15" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Dedos simplificados */}
      <rect x="38" y="230" width="2" height="8" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      <rect x="41" y="232" width="2" height="10" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      <rect x="44" y="231" width="2" height="9" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      <rect x="47" y="229" width="2" height="7" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      
      <rect x="154" y="230" width="2" height="8" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      <rect x="157" y="232" width="2" height="10" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      <rect x="160" y="231" width="2" height="9" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      <rect x="163" y="229" width="2" height="7" fill="#fdf2f8" stroke="#374151" strokeWidth="0.5"/>
      
      {/* Pelve/Quadril mais realista */}
      <ellipse cx="100" cy="210" rx="35" ry="25" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Cintura */}
      <path d="M75 190 Q100 185 125 190" stroke="#374151" strokeWidth="2" fill="none"/>
      
      {/* Coxas mais anatômicas */}
      <ellipse cx="82" cy="265" rx="18" ry="50" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="118" cy="265" rx="18" ry="50" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Joelhos */}
      <circle cx="82" cy="320" r="12" fill="#f3f4f6" stroke="#374151" strokeWidth="1.5"/>
      <circle cx="118" cy="320" r="12" fill="#f3f4f6" stroke="#374151" strokeWidth="1.5"/>
      
      {/* Pernas/Canelas */}
      <ellipse cx="82" cy="360" rx="14" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="118" cy="360" rx="14" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Tornozelos */}
      <circle cx="82" cy="390" r="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1"/>
      <circle cx="118" cy="390" r="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1"/>
      
      {/* Pés */}
      <ellipse cx="82" cy="400" rx="8" ry="12" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="118" cy="400" rx="8" ry="12" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Características faciais */}
      <circle cx="92" cy="37" r="3" fill="#374151"/>
      <circle cx="108" cy="37" r="3" fill="#374151"/>
      <path d="M96 45 Q100 48 104 45" stroke="#374151" strokeWidth="1.5" fill="none"/>
      <ellipse cx="100" cy="42" rx="2" ry="3" fill="none" stroke="#374151" strokeWidth="1"/>
      
      {/* Linha central de referência */}
      <line x1="100" y1="10" x2="100" y2="410" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5"/>
      
      {/* Linhas horizontais de referência */}
      <line x1="40" y1="140" x2="160" y2="140" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.3"/>
      <line x1="40" y1="210" x2="160" y2="210" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.3"/>
      <line x1="40" y1="320" x2="160" y2="320" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.3"/>
    </svg>
  );

  const BackBodySVG = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full">
      {/* Cabeça vista traseira */}
      <ellipse cx="100" cy="40" rx="25" ry="32" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Cabelo vista traseira */}
      <path d="M75 25 Q100 8 125 25 Q125 40 100 42 Q75 40 75 25" fill="#6b7280" stroke="#374151" strokeWidth="1"/>
      
      {/* Pescoço */}
      <ellipse cx="100" cy="75" rx="12" ry="18" fill="#fdf2f8" stroke="#374151" strokeWidth="1.5"/>
      
      {/* Tronco vista traseira */}
      <path d="M75 90 Q65 100 65 120 L65 160 Q65 180 75 190 L125 190 Q135 180 135 160 L135 120 Q135 100 125 90 Z" 
            fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Omoplatas detalhadas */}
      <ellipse cx="82" cy="115" rx="12" ry="20" fill="none" stroke="#9ca3af" strokeWidth="1.5" transform="rotate(-15 82 115)"/>
      <ellipse cx="118" cy="115" rx="12" ry="20" fill="none" stroke="#9ca3af" strokeWidth="1.5" transform="rotate(15 118 115)"/>
      
      {/* Coluna vertebral detalhada */}
      <line x1="100" y1="85" x2="100" y2="200" stroke="#9ca3af" strokeWidth="3"/>
      
      {/* Vértebras */}
      <circle cx="100" cy="95" r="3" fill="#9ca3af"/>
      <circle cx="100" cy="110" r="3" fill="#9ca3af"/>
      <circle cx="100" cy="125" r="3" fill="#9ca3af"/>
      <circle cx="100" cy="140" r="3" fill="#9ca3af"/>
      <circle cx="100" cy="155" r="3" fill="#9ca3af"/>
      <circle cx="100" cy="170" r="3" fill="#9ca3af"/>
      <circle cx="100" cy="185" r="3" fill="#9ca3af"/>
      
      {/* Costelas traseiras */}
      <path d="M100 110 Q85 115 82 120 Q85 125 100 120" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      <path d="M100 110 Q115 115 118 120 Q115 125 100 120" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      <path d="M100 130 Q85 135 82 140 Q85 145 100 140" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      <path d="M100 130 Q115 135 118 140 Q115 145 100 140" stroke="#e5e7eb" strokeWidth="1" fill="none"/>
      
      {/* Braços vista traseira */}
      <ellipse cx="55" cy="110" rx="15" ry="45" fill="#fdf2f8" stroke="#374151" strokeWidth="2" transform="rotate(-10 55 110)"/>
      <ellipse cx="145" cy="110" rx="15" ry="45" fill="#fdf2f8" stroke="#374151" strokeWidth="2" transform="rotate(10 145 110)"/>
      
      {/* Cotovelos */}
      <circle cx="50" cy="150" r="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1"/>
      <circle cx="150" cy="150" r="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1"/>
      
      {/* Antebraços */}
      <ellipse cx="45" cy="185" rx="12" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="155" cy="185" rx="12" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Mãos */}
      <ellipse cx="42" cy="225" rx="10" ry="15" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="158" cy="225" rx="10" ry="15" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Pelve vista traseira */}
      <ellipse cx="100" cy="210" rx="35" ry="25" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Sacro */}
      <path d="M95 200 Q100 205 105 200 Q105 215 100 220 Q95 215 95 200" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/>
      
      {/* Coxas */}
      <ellipse cx="82" cy="265" rx="18" ry="50" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="118" cy="265" rx="18" ry="50" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Joelhos vista traseira */}
      <circle cx="82" cy="320" r="12" fill="#f3f4f6" stroke="#374151" strokeWidth="1.5"/>
      <circle cx="118" cy="320" r="12" fill="#f3f4f6" stroke="#374151" strokeWidth="1.5"/>
      
      {/* Tendões da corva */}
      <line x1="77" y1="310" x2="77" y2="330" stroke="#9ca3af" strokeWidth="1"/>
      <line x1="87" y1="310" x2="87" y2="330" stroke="#9ca3af" strokeWidth="1"/>
      <line x1="113" y1="310" x2="113" y2="330" stroke="#9ca3af" strokeWidth="1"/>
      <line x1="123" y1="310" x2="123" y2="330" stroke="#9ca3af" strokeWidth="1"/>
      
      {/* Panturrilhas */}
      <ellipse cx="82" cy="360" rx="14" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="118" cy="360" rx="14" ry="35" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Tendão de Aquiles */}
      <line x1="82" y1="385" x2="82" y2="395" stroke="#9ca3af" strokeWidth="2"/>
      <line x1="118" y1="385" x2="118" y2="395" stroke="#9ca3af" strokeWidth="2"/>
      
      {/* Calcanhares */}
      <ellipse cx="82" cy="400" rx="8" ry="12" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      <ellipse cx="118" cy="400" rx="8" ry="12" fill="#fdf2f8" stroke="#374151" strokeWidth="2"/>
      
      {/* Linha central de referência */}
      <line x1="100" y1="10" x2="100" y2="410" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5"/>
      
      {/* Linhas horizontais de referência */}
      <line x1="40" y1="140" x2="160" y2="140" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.3"/>
      <line x1="40" y1="210" x2="160" y2="210" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.3"/>
      <line x1="40" y1="320" x2="160" y2="320" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.3"/>
    </svg>
  );

  const frontMarkers = markers.filter(marker => marker.note.includes('(Frente)'));
  const backMarkers = markers.filter(marker => marker.note.includes('(Costas)'));

  return (
    <div className="space-y-6">
      {/* Título e instruções */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Diagrama Corporal</h3>
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Instruções:</strong> Clique nos diagramas corporais abaixo para marcar pontos de intervenção cirúrgica.
          A vista frontal está à esquerda e a vista traseira à direita.
        </p>
      </div>

      {/* Diagramas lado a lado */}
      <div className="flex justify-center gap-8">
        {/* Vista Frontal */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Vista Frontal</h4>
          <div className="relative w-80 h-96 border-2 border-blue-300 rounded-lg bg-gradient-to-b from-blue-50 to-white shadow-lg">
            <div 
              className="relative w-full h-full cursor-crosshair p-4"
              onClick={(e) => handleBodyClick(e, 'front')}
            >
              <FrontBodySVG />
              
              {/* Marcadores da vista frontal */}
              {frontMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-125 transition-all duration-200"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.note}
                >
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg">
                    {marker.note.replace(' (Frente)', '')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicador da vista */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Frente
            </div>
          </div>
        </div>

        {/* Vista Traseira */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Vista Traseira</h4>
          <div className="relative w-80 h-96 border-2 border-green-300 rounded-lg bg-gradient-to-b from-green-50 to-white shadow-lg">
            <div 
              className="relative w-full h-full cursor-crosshair p-4"
              onClick={(e) => handleBodyClick(e, 'back')}
            >
              <BackBodySVG />
              
              {/* Marcadores da vista traseira */}
              {backMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-125 transition-all duration-200"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.note}
                >
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg">
                    {marker.note.replace(' (Costas)', '')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicador da vista */}
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Costas
            </div>
          </div>
        </div>
      </div>

      {/* Marcações registradas */}
      {markers.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Marcações Registradas ({markers.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {markers.map((marker) => (
              <div key={marker.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 break-words">
                        {marker.note.replace(/ \((Frente|Costas)\)/, '')}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          marker.note.includes('(Frente)') 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {marker.note.includes('(Frente)') ? '👤 Vista Frontal' : '🔄 Vista Traseira'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveMarker(marker.id)}
                    className="ml-3 text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                    title="Remover marcação"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HumanBodyDiagram;
