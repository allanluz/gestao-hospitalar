# Sistema de Gerenciamento Hospitalar

Um sistema completo de gerenciamento hospitalar desenvolvido com tecnologias modernas, incluindo cadastro de pacientes, funcionários, controle de estoque e movimentações específicas para UTI e Centro Cirúrgico.

## 🏥 Funcionalidades

### Principais Módulos

- **Dashboard**: Visão geral com estatísticas e indicadores
- **Cadastro de Pacientes**: Gestão completa de informações dos pacientes
- **Cadastro de Funcionários**: Controle de equipe médica e administrativa
- **Controle de Estoque**: Gerenciamento de medicamentos e materiais hospitalares
- **UTI**: Controle específico de consumo e movimentações da UTI
- **Centro Cirúrgico**: Rastreamento de materiais utilizados em cirurgias

### Recursos Técnicos

- ✅ Interface responsiva (mobile, tablet, desktop)
- ✅ Validações de formulário
- ✅ Busca e filtros
- ✅ Controle de estoque com alertas de estoque baixo
- ✅ Relatórios de movimentação
- ✅ API RESTful completa
- ✅ Dados mockados para demonstração

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **TailwindCSS** para estilização
- **React Router** para navegação
- **React Icons** para ícones
- **Fetch API** para requisições

### Backend
- **Node.js** com Express.js
- **JSON** para persistência de dados (mockados)
- **CORS** habilitado
- **Nodemon** para desenvolvimento

## 📦 Estrutura do Projeto

```
gestao-hospitalar/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── types/           # Definições TypeScript
│   │   └── ...
│   └── ...
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── routes/          # Definições de rotas
│   │   └── data/            # Dados mockados (JSON)
│   └── server.js            # Servidor principal
└── .vscode/                 # Configurações do VS Code
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd gestao-hospitalar
```

### 2. Instale as dependências

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### 3. Execute a aplicação

#### Opção 1: Usando tarefas do VS Code
1. Abra o projeto no VS Code
2. Use `Ctrl+Shift+P` e digite "Tasks: Run Task"
3. Selecione "Start Backend Server"
4. Repita o processo e selecione "Start Frontend Server"

#### Opção 2: Via terminal

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
O servidor estará disponível em `http://localhost:5000`

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
```
A aplicação estará disponível em `http://localhost:3000`

## 📡 API Endpoints

### Dashboard
- `GET /api/dashboard` - Estatísticas gerais
- `GET /api/status` - Status da API

### Pacientes
- `GET /api/pacientes` - Listar todos os pacientes
- `GET /api/pacientes/:id` - Buscar paciente por ID
- `POST /api/pacientes` - Criar novo paciente
- `PUT /api/pacientes/:id` - Atualizar paciente
- `DELETE /api/pacientes/:id` - Remover paciente

### Funcionários
- `GET /api/funcionarios` - Listar funcionários
- `POST /api/funcionarios` - Criar funcionário
- `PUT /api/funcionarios/:id` - Atualizar funcionário
- `DELETE /api/funcionarios/:id` - Remover funcionário

### Estoque
- `GET /api/estoque` - Listar itens do estoque
- `GET /api/estoque/baixo` - Itens com estoque baixo
- `POST /api/estoque` - Criar item
- `PUT /api/estoque/:id` - Atualizar item
- `POST /api/estoque/movimentar` - Movimentar estoque

### UTI
- `GET /api/uti/movimentacoes` - Listar movimentações
- `POST /api/uti/consumo` - Registrar consumo
- `GET /api/uti/relatorio` - Relatório de consumo

### Centro Cirúrgico
- `GET /api/centro-cirurgico/movimentacoes` - Listar movimentações
- `POST /api/centro-cirurgico/consumo` - Registrar consumo cirúrgico
- `GET /api/centro-cirurgico/relatorio` - Relatório por cirurgia

## 🎨 Design e UX

- **Paleta de cores**: Azul e verde (tons hospitalares)
- **Layout responsivo**: Adaptável a diferentes dispositivos
- **Navegação intuitiva**: Menu lateral com ícones identificadores
- **Feedback visual**: Alertas, loading states e validações
- **Acessibilidade**: Contrastes adequados e navegação por teclado

## 📊 Dados de Demonstração

O sistema vem com dados mockados incluindo:
- 4 pacientes de exemplo
- 5 funcionários de diferentes setores
- 7 itens de estoque (medicamentos e materiais)
- Histórico de movimentações da UTI e Centro Cirúrgico

## 🔜 Próximas Funcionalidades

- [ ] Autenticação e autorização
- [ ] Banco de dados real (PostgreSQL/MongoDB)
- [ ] Relatórios em PDF
- [ ] Dashboard em tempo real
- [ ] Notificações push
- [ ] Backup automático
- [ ] Integração com equipamentos médicos

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autor

Desenvolvido como sistema de demonstração para gerenciamento hospitalar.

---

⚡ **Status**: Em desenvolvimento ativo
🏥 **Versão**: 1.0.0
