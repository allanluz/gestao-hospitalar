import React, { useState, useRef } from 'react';
import { Paciente } from '../../types';

interface CodeScannerProps {
  onPatientFound: (paciente: Paciente) => void;
  onClose: () => void;
}

const CodeScanner: React.FC<CodeScannerProps> = ({ onPatientFound, onClose }) => {
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchPatientByCode = async (code: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Aqui você implementaria a busca no backend
      // Por enquanto, vou simular com dados locais
      
      // Extrair ID do paciente do código
      let patientId: number;
      
      if (code.startsWith('PAC')) {
        // Código de barras formato: PAC000001123456789012
        patientId = parseInt(code.substring(3, 9));
      } else {
        // Tentar parseear JSON do QR Code
        try {
          const qrData = JSON.parse(code);
          patientId = qrData.id;
        } catch {
          throw new Error('Formato de código inválido');
        }
      }

      // Buscar paciente no backend (simulado)
      const response = await fetch(`http://localhost:5000/api/pacientes/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Paciente não encontrado');
      }

      const paciente: Paciente = await response.json();
      onPatientFound(paciente);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleManualInput = () => {
    if (!inputCode.trim()) {
      setError('Digite um código válido');
      return;
    }
    searchPatientByCode(inputCode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Aqui você implementaria um leitor de QR Code para imagens
    // Por simplicidade, vou apenas simular
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulação: extrair código da imagem
      // Em produção, use uma biblioteca como qr-scanner ou jsqr
      const simulatedCode = 'PAC000001123456789012';
      searchPatientByCode(simulatedCode);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Escanear Código do Paciente</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Modo de escaneamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Escaneamento
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setScanMode('manual')}
                  className={`px-4 py-2 rounded-md ${
                    scanMode === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  📝 Manual
                </button>
                <button
                  onClick={() => setScanMode('camera')}
                  className={`px-4 py-2 rounded-md ${
                    scanMode === 'camera'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  📷 Imagem
                </button>
              </div>
            </div>

            {scanMode === 'manual' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digite o código ou QR Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Ex: PAC000001123456789012 ou dados JSON"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
                  />
                  <button
                    onClick={handleManualInput}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? '⏳' : '🔍'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carregar imagem com QR Code
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Selecione uma imagem contendo QR Code do paciente
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Dicas:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use um leitor de código de barras para entrada rápida</li>
                <li>• QR Codes contêm dados completos do paciente</li>
                <li>• Códigos de barras são mais simples: PAC + ID + CPF</li>
                <li>• Verifique se o código está legível e completo</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeScanner;
