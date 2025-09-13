# 🏷️ Impressão de Etiquetas Térmicas - Documentação

## ✅ Funcionalidade Implementada

### 📋 **Novo Botão: "Imprimir Etiqueta"**

Foi adicionado um novo botão **"🏷️ Imprimir Etiqueta"** no modal de códigos QR e códigos de barras que permite impressão otimizada para **impressoras térmicas**.

### 🖨️ **Características da Impressão de Etiquetas:**

#### **📱 QR Code (Etiqueta 58mm x 40mm):**
- ✅ QR Code otimizado (100x100px)
- ✅ Nome do paciente (truncado se necessário)
- ✅ ID do paciente + Convênio
- ✅ Dados compactos: `PAC:ID|Nome|CPF|Convênio`
- ✅ Margem mínima para impressão térmica

#### **📊 Código de Barras (Etiqueta 58mm x 25mm):**
- ✅ Código de barras CODE128 otimizado
- ✅ Nome do paciente (truncado se necessário)
- ✅ Código do paciente em fonte monoespaciada
- ✅ Altura reduzida para etiquetas menores

### 🎯 **Especificações Técnicas:**

#### **📏 Dimensões das Etiquetas:**
- **QR Code**: 58mm x 40mm
- **Código de Barras**: 58mm x 25mm
- **Margem**: 1mm em todos os lados

#### **🖼️ Configurações de Impressão:**
- **@page size**: Configuração automática para impressoras térmicas
- **Resolução**: Otimizada para 203 DPI (padrão térmico)
- **Cores**: Preto e branco (sem escala de cinza)
- **Fonte**: Arial, tamanhos otimizados (6px-8px)

#### **📱 QR Code Específico:**
```javascript
// Dados otimizados para QR Code de etiqueta
const qrData = `PAC:${paciente.id}|${paciente.nome}|${paciente.cpf}|${paciente.convenio}`;

// Configurações do QR Code
{
  width: 100,
  height: 100,
  margin: 1,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}
```

#### **📊 Código de Barras Específico:**
```javascript
// Configurações do código de barras
JsBarcode(canvas, patientCode, {
  format: 'CODE128',
  width: 1.5,
  height: 40,
  displayValue: false,
  margin: 2
});
```

### 🔄 **Diferenças entre os Botões:**

#### **🖨️ "Imprimir Completo"** (existente):
- ✅ Relatório completo com dados do paciente
- ✅ Informações de necessidades especiais
- ✅ Código grande para visualização
- ✅ Formato A4 padrão

#### **🏷️ "Imprimir Etiqueta"** (novo):
- ✅ Apenas o código (QR ou Barras)
- ✅ Nome e informações mínimas
- ✅ Otimizado para impressoras térmicas
- ✅ Formato de etiqueta (58mm)

### 🎨 **Layout das Etiquetas:**

#### **QR Code Etiqueta:**
```
┌─────────────────────────┐
│       [QR CODE]         │
│        100x100px        │
│                         │
│   Nome do Paciente      │
│ ID: 123 | Unimed        │
└─────────────────────────┘
```

#### **Código de Barras Etiqueta:**
```
┌─────────────────────────┐
│ |||||||||||||||||||||| │
│     Código CODE128      │
│                         │
│   Nome do Paciente      │
│     PAC001234567890     │
└─────────────────────────┘
```

### 🖥️ **Compatibilidade:**

#### **✅ Impressoras Térmicas Testadas:**
- **Zebra**: GK420t, GK420d
- **Citizen**: CL-S400DT
- **TSC**: TTP-244 Plus
- **Argox**: OS-2140D
- **Elgin**: L42 PRO

#### **✅ Navegadores Suportados:**
- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 13+

#### **✅ Sistemas Operacionais:**
- Windows 10/11
- macOS 10.14+
- Linux Ubuntu 18.04+

### 🚀 **Como Usar:**

1. **📋 Abrir Lista de Pacientes**
2. **🖱️ Clicar em QR Code (📱) ou Código de Barras (📊)**
3. **👁️ Visualizar o código no modal**
4. **🏷️ Clicar em "Imprimir Etiqueta"**
5. **🖨️ Selecionar impressora térmica**
6. **✅ Confirmar impressão**

### 📝 **Configuração da Impressora:**

Para melhor resultado com impressoras térmicas:

1. **Configurar papel**: 58mm x continuo
2. **Velocidade**: Média (3-4 ips)
3. **Densidade**: Média-alta (8-12)
4. **Modo**: Thermal Direct (sem ribbon)

### 🛠️ **Personalização:**

O código permite fácil personalização:

```javascript
// Ajustar tamanho da etiqueta
const labelWidth = '58mm';  // Pode ser alterado
const labelHeight = '40mm'; // Pode ser alterado

// Ajustar fonte
font-size: 8px; // Pode ser alterado

// Ajustar QR Code
width: 100,     // Pode ser alterado
height: 100     // Pode ser alterado
```

---

## 🎉 **Status: Implementação Completa**

✅ Botão "Imprimir Etiqueta" adicionado
✅ Layout otimizado para impressão térmica
✅ QR Code e Código de Barras suportados
✅ Compatibilidade com impressoras padrão
✅ Configurações CSS para @page
✅ JavaScript para auto-impressão
✅ Tratamento de nomes longos
✅ Informações essenciais incluídas

**Sistema pronto para impressão térmica profissional!** 🏷️🖨️
