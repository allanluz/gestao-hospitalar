const QRCode = require('qrcode');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');

/**
 * Serviço para geração de códigos QR e códigos de barras
 * Reutilizável para pacientes, medicamentos e outros recursos
 */

/**
 * Gera um código único baseado no tipo e ID
 * @param {string} tipo - Tipo do recurso (PACIENTE, MEDICAMENTO, etc)
 * @param {string|number} id - ID do recurso
 * @param {object} extras - Dados extras para incluir no código (opcional)
 * @returns {string} Código único formatado
 */
const gerarCodigoUnico = (tipo, id, extras = {}) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Formato: TIPO-ID-TIMESTAMP-RANDOM
  let codigo = `${tipo}-${id}-${timestamp}-${random}`;
  
  // Se houver extras, adicionar ao formato JSON
  if (Object.keys(extras).length > 0) {
    const data = {
      tipo,
      id,
      timestamp,
      ...extras
    };
    codigo = JSON.stringify(data);
  }
  
  return codigo;
};

/**
 * Gera QR Code em formato Data URL (base64)
 * @param {string} data - Dados para codificar
 * @param {object} options - Opções do QR Code
 * @returns {Promise<string>} Data URL do QR Code
 */
const gerarQRCode = async (data, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    const qrCodeDataURL = await QRCode.toDataURL(data, qrOptions);
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new Error('Falha ao gerar QR Code');
  }
};

/**
 * Gera código de barras em formato SVG
 * @param {string} data - Dados para codificar
 * @param {object} options - Opções do código de barras
 * @returns {string} SVG do código de barras
 */
const gerarCodigoBarras = (data, options = {}) => {
  try {
    const defaultOptions = {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 14,
      margin: 10,
      background: '#ffffff',
      lineColor: '#000000'
    };
    
    const barcodeOptions = { ...defaultOptions, ...options };
    
    // Criar um canvas virtual para gerar o SVG
    const canvas = createCanvas(400, 150);
    
    // Gerar o código de barras
    JsBarcode(canvas, data, barcodeOptions);
    
    // Converter para Data URL
    return canvas.toDataURL();
  } catch (error) {
    console.error('Erro ao gerar código de barras:', error);
    throw new Error('Falha ao gerar código de barras');
  }
};

/**
 * Gera código de barras em formato SVG (texto)
 * @param {string} data - Dados para codificar
 * @param {object} options - Opções do código de barras
 * @returns {string} SVG texto do código de barras
 */
const gerarCodigoBarrasSVG = (data, options = {}) => {
  try {
    const defaultOptions = {
      format: 'CODE128',
      width: 2,
      height: 80,
      displayValue: true,
      fontSize: 14,
      margin: 5,
      background: '#ffffff',
      lineColor: '#000000'
    };
    
    const barcodeOptions = { ...defaultOptions, ...options };
    
    let svg = '';
    JsBarcode('#barcode', data, {
      ...barcodeOptions,
      xmlDocument: {
        createElementNS: (ns, tag) => {
          if (!svg) svg = '<svg xmlns="http://www.w3.org/2000/svg">';
          return {
            setAttribute: (attr, value) => {
              if (attr === 'width') svg = svg.replace('<svg', `<svg width="${value}"`);
              if (attr === 'height') svg = svg.replace('<svg', `<svg height="${value}"`);
            },
            appendChild: (child) => {
              // Adiciona elementos ao SVG
            }
          };
        }
      }
    });
    
    return svg || generateSimpleSVG(data, barcodeOptions);
  } catch (error) {
    console.error('Erro ao gerar código de barras SVG:', error);
    return generateSimpleSVG(data, options);
  }
};

/**
 * Gera um SVG simples como fallback
 */
const generateSimpleSVG = (data, options) => {
  const width = options.width || 300;
  const height = options.height || 100;
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${options.background || '#fff'}"/>
      <text x="50%" y="50%" text-anchor="middle" font-size="12" fill="#000">${data}</text>
    </svg>
  `;
};

/**
 * Valida se um código é válido
 * @param {string} codigo - Código para validar
 * @returns {boolean} Se o código é válido
 */
const validarCodigo = (codigo) => {
  if (!codigo) return false;
  
  // Tentar parsear como JSON (códigos complexos)
  try {
    const data = JSON.parse(codigo);
    return data.tipo && data.id;
  } catch {
    // Se não for JSON, validar formato simples
    const regex = /^[A-Z]+-\d+-\d+-\d+$/;
    return regex.test(codigo);
  }
};

/**
 * Extrai informações de um código
 * @param {string} codigo - Código para extrair informações
 * @returns {object} Informações extraídas
 */
const extrairInformacoes = (codigo) => {
  try {
    // Tentar parsear como JSON primeiro
    const data = JSON.parse(codigo);
    return data;
  } catch {
    // Se não for JSON, extrair do formato simples
    const parts = codigo.split('-');
    if (parts.length >= 4) {
      return {
        tipo: parts[0],
        id: parts[1],
        timestamp: parseInt(parts[2]),
        random: parts[3]
      };
    }
    return null;
  }
};

/**
 * Gera etiqueta completa com QR Code e Código de Barras
 * @param {object} dados - Dados do recurso
 * @param {string} tipo - Tipo do recurso
 * @returns {Promise<object>} Objeto com QR Code e Código de Barras
 */
const gerarEtiquetaCompleta = async (dados, tipo) => {
  try {
    const codigoSimples = gerarCodigoUnico(tipo, dados.id);
    const codigoCompleto = gerarCodigoUnico(tipo, dados.id, {
      nome: dados.nome || dados.nomeCompleto,
      data: new Date().toISOString()
    });
    
    const qrCode = await gerarQRCode(codigoCompleto);
    const codigoBarras = gerarCodigoBarras(codigoSimples);
    
    return {
      codigoSimples,
      codigoCompleto,
      qrCode,
      codigoBarras,
      geradoEm: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao gerar etiqueta completa:', error);
    throw error;
  }
};

module.exports = {
  gerarCodigoUnico,
  gerarQRCode,
  gerarCodigoBarras,
  gerarCodigoBarrasSVG,
  validarCodigo,
  extrairInformacoes,
  gerarEtiquetaCompleta
};
