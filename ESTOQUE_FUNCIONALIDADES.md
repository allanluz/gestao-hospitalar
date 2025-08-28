# Funcionalidades de Estoque - Sistema de Gestão Hospitalar

## Funcionalidades Implementadas

### 1. **Inclusão de Itens** ➕
- **Acesso**: Botão "Novo Item" no topo da página
- **Campos obrigatórios**:
  - Nome do Item
  - Categoria (Medicamento, Material Hospitalar, etc.)
  - Setor (Farmácia, UTI, Centro Cirúrgico, etc.)
  - Quantidade
  - Estoque Mínimo
  - Unidade (UN, CX, PC, ML, G, KG, L)
  - Lote
  - Data de Validade
  - Fornecedor

### 2. **Alteração de Itens** ✏️
- **Acesso**: Botão de edição (✏️) na coluna "Ações" de cada item
- **Funcionalidades**:
  - Edição de todos os campos do item
  - Validação dos dados
  - Feedback de sucesso/erro

### 3. **Exclusão de Itens** 🗑️
- **Acesso**: Botão de exclusão (🗑️) na coluna "Ações" de cada item
- **Funcionalidades**:
  - Modal de confirmação
  - Exclusão permanente do item
  - Feedback de sucesso/erro

### 4. **Movimentação de Estoque** 📦
- **Acesso**: Botão de movimentação (📦) na coluna "Ações" de cada item
- **Tipos de movimentação**:
  - **Entrada**: Adiciona itens ao estoque
  - **Saída**: Remove itens do estoque
- **Campos**:
  - Tipo (Entrada/Saída)
  - Quantidade
  - Responsável
  - Observações (opcional)

## Validações Implementadas

### Validações de Formulário
- ✅ Todos os campos obrigatórios preenchidos
- ✅ Quantidade não pode ser negativa
- ✅ Estoque mínimo não pode ser negativo
- ✅ Data de validade não pode ser anterior à data atual
- ✅ Validação de campos específicos (números, datas, etc.)

### Validações de Movimentação
- ✅ Quantidade deve ser maior que zero
- ✅ Responsável é obrigatório
- ✅ Verificação de estoque suficiente para saídas (validação no backend)

## Recursos Adicionais

### Interface do Usuário
- 🎨 Design responsivo com Tailwind CSS
- 📱 Modais interativos para todas as operações
- 🔍 Busca por nome ou categoria
- ⚠️ Alertas de estoque baixo
- ✅ Feedback visual para operações (sucesso/erro)
- 🔄 Atualização automática da listagem após operações

### Indicadores Visuais
- **Status de Estoque**:
  - 🟢 Normal: Quantidade acima do estoque mínimo
  - 🔴 Baixo: Quantidade abaixo do estoque mínimo
- **Alertas**: Banner destacado para itens com estoque baixo

### Integração Backend
- 🔗 API REST completa com endpoints para CRUD
- 📊 Persistência de dados em arquivo JSON
- 🛡️ Tratamento de erros e validações
- 🔄 Sincronização em tempo real

## Como Usar

### Acessar a Página
1. Navegue para `http://localhost:3000/estoque`
2. A página carregará automaticamente todos os itens do estoque

### Criar Novo Item
1. Clique no botão "➕ Novo Item"
2. Preencha todos os campos obrigatórios
3. Clique em "Criar"

### Editar Item
1. Clique no ícone ✏️ na linha do item desejado
2. Modifique os campos necessários
3. Clique em "Salvar"

### Excluir Item
1. Clique no ícone 🗑️ na linha do item desejado
2. Confirme a exclusão no modal
3. O item será removido permanentemente

### Movimentar Estoque
1. Clique no ícone 📦 na linha do item desejado
2. Selecione o tipo (Entrada/Saída)
3. Informe a quantidade e responsável
4. Adicione observações se necessário
5. Clique em "Confirmar Movimentação"

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Persistência**: Arquivo JSON
- **API**: RESTful com validações
- **UI/UX**: Componentes modais responsivos

## Estrutura de Arquivos

```
frontend/src/pages/Estoque.tsx    - Componente principal da página
backend/src/controllers/estoqueController.js - Controlador da API
backend/src/routes/estoque.js     - Rotas da API
backend/src/data/estoque.json     - Dados persistidos
frontend/src/services/api.ts      - Cliente da API
```

---

**Status**: ✅ Todas as funcionalidades implementadas e testadas
**Última atualização**: Agosto 2025
