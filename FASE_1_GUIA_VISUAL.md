# 📸 GUIA VISUAL - FASE 1: ETIQUETAGEM DE MEDICAMENTOS

## 🎯 Visão Geral do Sistema

Este documento descreve visualmente as funcionalidades implementadas na Fase 1.

---

## 🏠 PÁGINA PRINCIPAL DE MEDICAMENTOS

### URL
```
http://localhost:3000/medicamentos
```

### Layout da Página

```
┌─────────────────────────────────────────────────────────────────────┐
│  🏥 SISTEMA HOSPITALAR              Medicamentos        👤 Admin    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 Gerenciamento de Medicamentos                                  │
│  Controle completo do estoque de medicamentos com etiquetagem      │
│                                                                     │
│  ┌───────────┬───────────┬───────────┬───────────┐                │
│  │ Total     │ Estoque   │ Próximos  │ Com       │                │
│  │ Medicamen.│ Baixo     │ Vencimento│ Etiqueta  │                │
│  │    15     │     3     │     2     │    12     │                │
│  └───────────┴───────────┴───────────┴───────────┘                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 🔍 [Buscar...]  │ [Categoria ▼] │ [Status ▼]         │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [+ Novo Medicamento]                                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ MEDICAMENTO │ LOTE/VALIDADE │ CATEGORIA │ ESTOQUE │ AÇÕES    │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ Paracetamol │ LOT2024001    │ Analgésico│ 500     │ 🔲 ✏️ 🗑️ │  │
│  │ 750mg       │ ⏰ Válido      │           │ 🟢      │          │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ Morfina     │ LOT2024008    │ Opioide   │  50     │ 🔲 ✏️ 🗑️ │  │
│  │ 10mg/ml     │ ⚠️ 28 dias    │           │ 🟡      │          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📝 FORMULÁRIO DE CADASTRO

### Quando Exibido
- Ao clicar em "Novo Medicamento"
- Ao clicar no ícone ✏️ (Editar)

### Campos do Formulário

```
┌─────────────────────────────────────────────────────────────────┐
│  Novo Medicamento                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┬──────────────┬──────────────┐               │
│  │ Nome *       │ Princípio *  │ Concentração*│               │
│  │ [________]   │ [________]   │ [________]   │               │
│  └──────────────┴──────────────┴──────────────┘               │
│                                                                 │
│  ┌──────────────┬──────────────┬──────────────┐               │
│  │ Forma Farm.* │ Fabricante * │ Lote *       │               │
│  │ [Comprim. ▼] │ [________]   │ [________]   │               │
│  └──────────────┴──────────────┴──────────────┘               │
│                                                                 │
│  ┌──────────────┬──────────────┬──────────────┐               │
│  │ Validade *   │ Reg. ANVISA  │ Categoria *  │               │
│  │ [__/__/____] │ [________]   │ [Analgés. ▼] │               │
│  └──────────────┴──────────────┴──────────────┘               │
│                                                                 │
│  ┌──────────────┬──────────────┬──────────────┐               │
│  │ Quantidade * │ Est. Mín. *  │ Est. Máx. *  │               │
│  │ [________]   │ [________]   │ [________]   │               │
│  └──────────────┴──────────────┴──────────────┘               │
│                                                                 │
│  ┌──────────────┬──────────────────────────────┐               │
│  │ Unidade *    │ Localização *                │               │
│  │ [________]   │ [___________________]        │               │
│  └──────────────┴──────────────────────────────┘               │
│                                                                 │
│  ┌────────────────────────────────────────────┐                 │
│  │ Observações                                │                 │
│  │ [________________________________]         │                 │
│  │ [________________________________]         │                 │
│  └────────────────────────────────────────────┘                 │
│                                                                 │
│  [Cadastrar]  [Cancelar]                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏷️ MODAL DE ETIQUETA

### Quando Exibido
- Ao clicar no ícone 🔲 (QR Code) na lista

### Layout do Modal

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ 🔲 Etiqueta do Medicamento                            ✕  │   │
│  │ Geração de QR Code e Código de Barras                    │   │
│  ├───────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  📦 PARACETAMOL 750MG                                     │   │
│  │  ┌─────────────┬─────────────┐                           │   │
│  │  │ Princípio:  │ Lote:       │                           │   │
│  │  │ Paracetamol │ LOT2024001  │                           │   │
│  │  ├─────────────┼─────────────┤                           │   │
│  │  │ Concentr.:  │ Validade:   │                           │   │
│  │  │ 750mg       │ 31/12/2025  │                           │   │
│  │  └─────────────┴─────────────┘                           │   │
│  │                                                           │   │
│  │  ╔═══════════════════════════════════════╗               │   │
│  │  ║                                       ║               │   │
│  │  ║         🔲 QR CODE                    ║               │   │
│  │  ║                                       ║               │   │
│  │  ║     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓               ║               │   │
│  │  ║     ▓▓  ▓▓▓▓  ▓▓  ▓▓▓▓               ║               │   │
│  │  ║     ▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓               ║               │   │
│  │  ║     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓               ║               │   │
│  │  ║                                       ║               │   │
│  │  ║     {"tipo":"MEDICAMENTO"...}         ║               │   │
│  │  ║                                       ║               │   │
│  │  ╠═══════════════════════════════════════╣               │   │
│  │  ║                                       ║               │   │
│  │  ║    📊 CÓDIGO DE BARRAS                ║               │   │
│  │  ║                                       ║               │   │
│  │  ║    |||  ||||||  ||  |||  ||||  ||    ║               │   │
│  │  ║                                       ║               │   │
│  │  ║    MEDICAMENTO-1-1727971200000-457    ║               │   │
│  │  ║                                       ║               │   │
│  │  ╠═══════════════════════════════════════╣               │   │
│  │  ║ Paracetamol 750mg | Lote: LOT2024001 ║               │   │
│  │  ║ Val: 31/12/2025                       ║               │   │
│  │  ╚═══════════════════════════════════════╝               │   │
│  │                                                           │   │
│  │  [🖨️ Imprimir Etiqueta]  [💾 Baixar Imagem]             │   │
│  │                                                           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🎨 INDICADORES VISUAIS

### Status de Estoque

| Status | Cor | Descrição | Quando Aparece |
|--------|-----|-----------|----------------|
| 🔴 Crítico | Vermelho | Estoque = Mínimo | Qtd ≤ Estoque Mínimo |
| 🟡 Baixo | Amarelo | Estoque Atenção | Qtd ≤ 1.5x Estoque Mínimo |
| 🟢 Normal | Verde | Estoque OK | Qtd > 1.5x Estoque Mínimo |

### Status de Validade

| Status | Cor | Descrição | Quando Aparece |
|--------|-----|-----------|----------------|
| 🔴 Vencido | Vermelho | Produto vencido | Data < Hoje |
| 🟡 Atenção | Amarelo | Vence em breve | Vence em ≤ 30 dias |
| 🟢 Válido | Verde | Validade OK | Vence em > 30 dias |

---

## 🔍 FILTROS DISPONÍVEIS

### 1. Busca por Texto
```
┌─────────────────────────────────────────┐
│ 🔍 Buscar por nome, princípio ou lote  │
└─────────────────────────────────────────┘
```
- Busca em tempo real
- Procura em: nome, princípio ativo, lote, fabricante

### 2. Filtro por Categoria
```
┌─────────────────────┐
│ Todas as Categorias ▼│
├─────────────────────┤
│ Analgésico          │
│ Antibiótico         │
│ Antiulceroso        │
│ Anti-hipertensivo   │
│ ... (13 categorias) │
└─────────────────────┘
```

### 3. Filtro por Status
```
┌───────────────────────┐
│ Todos os Status      ▼│
├───────────────────────┤
│ Todos                 │
│ Estoque Baixo         │
│ Vencimento Próximo    │
└───────────────────────┘
```

---

## 📊 DASHBOARD DE ESTATÍSTICAS

### Cards Informativos

```
┌──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ Total de Medicamentos│    Estoque Baixo     │ Próximos Vencimento  │   Com Etiqueta       │
│                      │                      │                      │                      │
│        15            │         3            │          2           │        12            │
│    ────────          │     ⚠️ ────          │      ⏰ ────          │     ✅ ────          │
│                      │                      │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 🖨️ IMPRESSÃO DE ETIQUETA

### Formato de Impressão

```
┌─────────────────────────────────┐
│                                 │
│     PARACETAMOL 750MG           │
│     Lote: LOT2024001            │
│     Validade: 31/12/2025        │
│                                 │
│         ▓▓▓▓▓▓▓▓▓▓▓            │
│         ▓▓  ▓▓  ▓▓             │
│         ▓▓▓▓▓▓▓▓▓▓▓            │
│         ▓▓▓▓▓▓▓▓▓▓▓            │
│                                 │
│    |||  ||||||  ||  |||         │
│                                 │
│  MEDICAMENTO-1-1727971200000    │
│                                 │
│     EMS - Prateleira A1         │
│                                 │
└─────────────────────────────────┘
```

### Tamanho Sugerido
- **Largura**: 8cm
- **Altura**: 10cm
- **Resolução**: 300 DPI
- **Formato**: PNG (download) ou impressão direta

---

## 💾 DOWNLOAD DE ETIQUETA

### Formato do Arquivo
- **Nome**: `etiqueta-Paracetamol-750mg-LOT2024001.png`
- **Tipo**: PNG
- **Tamanho**: ~100KB
- **Dimensões**: 400x600 pixels

---

## 🎯 CASOS DE USO COMUNS

### Caso 1: Cadastrar Novo Medicamento
1. Clicar em "Novo Medicamento"
2. Preencher dados obrigatórios (*)
3. Clicar em "Cadastrar"
4. Medicamento aparece na lista

### Caso 2: Gerar Etiqueta
1. Localizar medicamento na lista
2. Clicar no ícone 🔲 (QR Code)
3. Modal abre com etiqueta gerada
4. Escolher: Imprimir ou Baixar

### Caso 3: Buscar Medicamento
1. Digitar no campo de busca
2. Lista filtra automaticamente
3. Medicamentos correspondentes aparecem

### Caso 4: Verificar Estoque Baixo
1. Selecionar "Estoque Baixo" no filtro de status
2. Lista mostra apenas medicamentos críticos
3. Indicadores 🔴 e ⚠️ aparecem

---

## 📱 RESPONSIVIDADE

### Desktop (> 1024px)
```
┌───────────────────────────────────────────────┐
│ [Sidebar] │  [Dashboard]  │  [Tabela]        │
└───────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────┐
│ [☰] │  [Dashboard]           │
│      │  [Tabela com scroll]  │
└──────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│ [☰]  [Dashboard] │
│                  │
│ [Cards Verticais]│
│                  │
│ [Botões Grandes] │
└──────────────────┘
```

---

## 🎨 PALETA DE CORES

### Cores Principais
- **Primária**: `#2563eb` (Azul) - Botões, links
- **Secundária**: `#64748b` (Cinza) - Textos secundários
- **Sucesso**: `#16a34a` (Verde) - Status OK, confirmações
- **Aviso**: `#ca8a04` (Amarelo) - Alertas, atenção
- **Erro**: `#dc2626` (Vermelho) - Crítico, erros
- **Fundo**: `#f8fafc` (Cinza Claro) - Background

### Uso das Cores
```
🟦 Azul   → Ações principais (Cadastrar, Gerar Etiqueta)
🟩 Verde  → Status positivo (Estoque OK, Válido)
🟨 Amarelo → Alertas (Estoque Baixo, Vence em 30 dias)
🟥 Vermelho → Crítico (Estoque Mínimo, Vencido)
⬜ Cinza  → Neutro (Cancelar, Backgrounds)
```

---

## 📐 DIMENSÕES E ESPAÇAMENTOS

### Grid do Dashboard
```
Grid: 4 colunas em desktop
      2 colunas em tablet
      1 coluna em mobile

Gap: 1rem (16px)
```

### Cards
```
Padding: 1rem (16px)
Border-radius: 0.5rem (8px)
Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

### Botões
```
Altura: 2.5rem (40px)
Padding: 0.5rem 1rem
Border-radius: 0.5rem (8px)
```

---

## 🔤 TIPOGRAFIA

### Fontes
- **Principal**: System Font Stack
- **Monospace**: Para códigos (QR, Barras)

### Hierarquia
```
H1 (Título Principal): 1.875rem (30px), Bold
H2 (Seção): 1.5rem (24px), Bold
H3 (Subsection): 1.25rem (20px), SemiBold
Body: 1rem (16px), Regular
Small: 0.875rem (14px), Regular
```

---

## ✨ ANIMAÇÕES

### Loading
```
Spinner circular rotativo
Cor: Azul primário
Duração: 1s infinito
```

### Hover em Botões
```
Transition: 200ms ease
Scale: 1.02
Opacity: 0.9
```

### Modal
```
Fade in: 200ms
Backdrop: Fade in 150ms
```

---

## 🎬 FLUXO DE USUÁRIO

### Fluxo Principal: Cadastrar e Etiquetar
```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Acessar │ ──> │ Clicar  │ ──> │ Preen-  │ ──> │ Salvar  │ ──> │ Gerar   │
│ Medica- │     │ "Novo"  │     │ cher    │     │ Dados   │     │ Etiqueta│
│ mentos  │     │         │     │ Formulá.│     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
                                                                       │
                                                                       ▼
                                ┌─────────┐     ┌─────────┐     ┌─────────┐
                                │ Fechar  │ <── │ Baixar/ │ <── │ Visuali-│
                                │ Modal   │     │ Imprimir│     │ zar     │
                                └─────────┘     └─────────┘     └─────────┘
```

---

## 📄 EXEMPLOS DE DADOS

### Medicamento Comum
```json
{
  "nome": "Paracetamol 750mg",
  "categoria": "Analgésico",
  "quantidade": 500,
  "status": "🟢 Normal"
}
```

### Medicamento Controlado
```json
{
  "nome": "Morfina 10mg/ml",
  "categoria": "Analgésico Opioide",
  "quantidade": 50,
  "localizacao": "Cofre - Controlados",
  "observacoes": "⚠️ CONTROLADO - Portaria 344/98"
}
```

### Medicamento Crítico
```json
{
  "nome": "Insulina NPH",
  "categoria": "Hormônio",
  "quantidade": 30,
  "estoqueMinimo": 30,
  "status": "🔴 Crítico",
  "observacoes": "🧊 Refrigerado 2-8°C"
}
```

---

## 🎯 ATALHOS E DICAS

### Teclado
- `Ctrl + F`: Focar na busca
- `Esc`: Fechar modais
- `Enter`: Confirmar formulário

### Mouse
- **Click simples**: Selecionar
- **Double-click**: Editar rápido
- **Hover**: Mostrar tooltips

### Dicas de Uso
💡 Use filtros combinados para busca precisa  
💡 Gere etiquetas assim que cadastrar  
💡 Configure alertas de estoque mínimo adequadamente  
💡 Verifique semanalmente medicamentos próximos ao vencimento  

---

**FIM DO GUIA VISUAL** 📸

*Este guia serve como referência para entender visualmente o sistema implementado.*  
*Para implementação técnica, consulte os documentos de código.*

Data: 03/10/2025
