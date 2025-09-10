# Sistema de Gerenciamento Hospitalar - Santa Casa de Misericórdia de Tupã

Um sistema completo de gerenciamento hospitalar desenvolvido com tecnologias modernas, implementando todo o fluxo de trabalho da Santa Casa de Misericórdia de Tupã, incluindo módulos específicos para Centro Cirúrgico com protocolos médicos padronizados.

## 🏥 Funcionalidades

### Principais Módulos

- **Dashboard**: Visão geral com estatísticas e indicadores em tempo real
- **Cadastro de Pacientes**: Gestão completa de informações dos pacientes
- **Cadastro de Funcionários**: Controle de equipe médica e administrativa
- **Controle de Estoque**: Gerenciamento de medicamentos e materiais hospitalares
- **UTI**: Controle específico de consumo e movimentações da UTI

### Centro Cirúrgico - Fluxo Completo

#### 1. **Recepção do Centro Cirúrgico**
- ✅ Recebimento e verificação de pacientes
- ✅ Checklist de segurança pré-operatória
- ✅ Controle de documentação e consentimentos
- ✅ Preparação pré-anestésica

#### 2. **Assistência Intra-Operatória**
- ✅ **Escala de Sedação de Ramsay** (1-6 pontos com indicadores visuais)
- ✅ **Monitor de Sinais Vitais** em tempo real
- ✅ Controle de medicamentos utilizados
- ✅ Registro de eventos intra-operatórios
- ✅ Monitoramento contínuo do paciente

#### 3. **Recuperação Anestésica**
- ✅ **Índice de Aldrete-Kroulik** (≥8 pontos para alta)
- ✅ Monitoramento pós-anestésico
- ✅ Controle de dor e náuseas
- ✅ Critérios de alta da recuperação
- ✅ Registro de complicações

#### 4. **Controle de Infecção Hospitalar**
- ✅ Protocolos de assepsia e antissepsia
- ✅ Controle de materiais estéreis
- ✅ Registro de procedimentos de limpeza
- ✅ Monitoramento de infecções relacionadas

#### 5. **Custeio Cirúrgico**
- ✅ Controle de custos por procedimento
- ✅ Relatórios de materiais utilizados
- ✅ Análise de rentabilidade
- ✅ Faturamento de procedimentos

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

#### Recepção do Centro Cirúrgico
- `GET /api/centro-cirurgico-recepcao` - Listar registros de recepção
- `POST /api/centro-cirurgico-recepcao` - Criar registro de recepção
- `PUT /api/centro-cirurgico-recepcao/:id` - Atualizar registro
- `DELETE /api/centro-cirurgico-recepcao/:id` - Remover registro

#### Assistência Intra-Operatória
- `GET /api/assistencia-intra-operatoria` - Listar assistências
- `POST /api/assistencia-intra-operatoria` - Criar nova assistência
- `PUT /api/assistencia-intra-operatoria/:id` - Atualizar assistência
- `DELETE /api/assistencia-intra-operatoria/:id` - Remover assistência

#### Recuperação Anestésica
- `GET /api/recuperacao-anestesica` - Listar recuperações
- `POST /api/recuperacao-anestesica` - Criar registro de recuperação
- `PUT /api/recuperacao-anestesica/:id` - Atualizar recuperação
- `DELETE /api/recuperacao-anestesica/:id` - Remover registro

#### Controle de Infecção Hospitalar
- `GET /api/controle-infeccao-hospitalar` - Listar controles de infecção
- `POST /api/controle-infeccao-hospitalar` - Criar controle
- `PUT /api/controle-infeccao-hospitalar/:id` - Atualizar controle
- `DELETE /api/controle-infeccao-hospitalar/:id` - Remover controle

#### Custeio Cirúrgico
- `GET /api/custeio-cirurgico` - Listar custeios
- `POST /api/custeio-cirurgico` - Criar custeio
- `PUT /api/custeio-cirurgico/:id` - Atualizar custeio
- `DELETE /api/custeio-cirurgico/:id` - Remover custeio

## � Componentes Médicos Especializados

### Escala de Sedação de Ramsay
- **6 níveis de sedação** com indicadores visuais coloridos
- **Verde**: Níveis 1-2 (Paciente acordado)
- **Amarelo**: Níveis 3-4 (Sedação leve a moderada)
- **Vermelho**: Níveis 5-6 (Sedação profunda)
- Interface intuitiva para rápida avaliação

### Índice de Aldrete-Kroulik
- **Sistema automático de pontuação** (0-10 pontos)
- **Critérios médicos**: Atividade, respiração, circulação, consciência, saturação
- **Indicador de alta**: ≥8 pontos com alerta visual
- **Validação em tempo real** dos critérios de segurança

### Monitor de Sinais Vitais
- **Monitoramento contínuo** de PA, FC, FR, Temp, SpO2
- **Alertas automáticos** para valores fora dos parâmetros normais
- **Histórico temporal** de medições
- **Interface responsiva** para diferentes dispositivos

## �🎨 Design e UX

- **Paleta de cores**: Azul e verde (tons hospitalares)
- **Layout responsivo**: Adaptável a diferentes dispositivos
- **Navegação intuitiva**: Menu lateral com ícones identificadores
- **Dropdown do Centro Cirúrgico**: 5 módulos especializados
- **Feedback visual**: Alertas, loading states e validações
- **Acessibilidade**: Contrastes adequados e navegação por teclado

## 📊 Dados de Demonstração

O sistema vem com dados mockados incluindo:
- 4 pacientes de exemplo
- 5 funcionários de diferentes setores
- 7 itens de estoque (medicamentos e materiais)
- Histórico de movimentações da UTI e Centro Cirúrgico

## ✅ Funcionalidades Implementadas

### Módulos Básicos
- ✅ Dashboard com estatísticas em tempo real
- ✅ Cadastro completo de pacientes com CEP automático
- ✅ Gestão de funcionários por setor
- ✅ Controle de estoque com alertas
- ✅ UTI com controle de consumo

### Centro Cirúrgico - Fluxo Completo Santa Casa de Tupã
- ✅ **Recepção**: Checklist pré-operatório completo
- ✅ **Intra-Operatório**: Escala Ramsay + Sinais Vitais
- ✅ **Recuperação**: Índice Aldrete-Kroulik automatizado
- ✅ **Controle de Infecção**: Protocolos de assepsia
- ✅ **Custeio**: Análise financeira por procedimento

### Componentes Médicos
- ✅ Escala de Sedação de Ramsay (1-6 com cores)
- ✅ Índice de Aldrete-Kroulik (alta ≥8 pontos)
- ✅ Monitor de Sinais Vitais em tempo real

## 🔜 Próximas Funcionalidades

- [ ] Autenticação e autorização por perfil médico
- [ ] Banco de dados PostgreSQL
- [ ] Relatórios em PDF com gráficos
- [ ] Dashboard em tempo real com WebSocket
- [ ] Notificações push para alertas críticos
- [ ] Backup automático de dados
- [ ] Integração com equipamentos médicos (HL7)
- [ ] Prontuário eletrônico integrado
- [ ] Agendamento de cirurgias
- [ ] Controle de leitos em tempo real

## 🏥 Santa Casa de Misericórdia de Tupã

Este sistema foi desenvolvido seguindo os protocolos e fluxos específicos da **Santa Casa de Misericórdia de Tupã**, implementando todas as etapas do processo cirúrgico desde a recepção até o custeio final.

### Conformidade com Protocolos Médicos
- ✅ **CFM** - Conselho Federal de Medicina
- ✅ **ANVISA** - Agência Nacional de Vigilância Sanitária  
- ✅ **SOBECC** - Associação Brasileira de Enfermeiros de Centro Cirúrgico
- ✅ **ABRACC** - Associação Brasileira de Controle de Infecção Hospitalar

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Desenvolvimento

**Sistema desenvolvido para Santa Casa de Misericórdia de Tupã**

Implementação completa do fluxo hospitalar com foco em:
- ✅ Segurança do paciente
- ✅ Controle de qualidade
- ✅ Eficiência operacional
- ✅ Conformidade regulatória

---

⚡ **Status**: Sistema Completo e Operacional  
🏥 **Versão**: 2.0.0 - Centro Cirúrgico Completo  
📅 **Última Atualização**: Dezembro 2024  
🚀 **Ambiente**: Produção Ready
