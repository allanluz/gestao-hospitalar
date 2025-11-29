# 🏥 Sistema de Gerenciamento Hospitalar - Hospital Manager

<div align="center">

![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

**Sistema completo de gerenciamento hospitalar desenvolvido com tecnologias modernas**

Implementação do fluxo de trabalho completo da Santa Casa de Misericórdia de Tupã,  
incluindo módulos especializados para Centro Cirúrgico com protocolos médicos padronizados.

[🚀 Instalação](#-instalação-e-execução) • [📚 Documentação](#-api-endpoints) • [✨ Funcionalidades](#-funcionalidades) • [🌐 Deploy](#-deploy-em-produção)

</div>

---

## 🎯 Visão Geral

Sistema web completo para gestão hospitalar com:
- ✅ **Dashboard Modernizado** com relógio em tempo real e estatísticas
- ✅ **260+ Materiais Hospitalares** organizados em 25+ categorias
- ✅ **Gestão de Medicamentos** completa (prescrições, dispensações, relatórios)
- ✅ **Centro Cirúrgico** com 5 módulos especializados
- ✅ **Protocolos Médicos** (Escala Ramsay, Índice Aldrete-Kroulik)
- ✅ **Interface Responsiva** para desktop, tablet e mobile

---

## 🏥 Funcionalidades

### 📊 Dashboard Inteligente

**Novo Design Moderno (v2.2.0)**
- ⏰ **Relógio em Tempo Real** - Atualiza a cada segundo com data por extenso
- 📈 **8 Cards Estatísticos** - Com gradientes, animações e indicadores de tendência
- 🏥 **Indicadores Hospitalares**
  - Leitos ocupados (50 leitos disponíveis)
  - Altas do dia
  - Emergências ativas
  - Cirurgias programadas
  - Prescrições ativas
- ⚡ **Ações Rápidas** - Acesso direto às 4 funções principais
- 📝 **Atividades Recentes** - Timeline de eventos do sistema
- 🎨 **Design Responsivo** - Gradientes coloridos e animações suaves

### 💊 Gestão de Medicamentos (Novo!)

**Menu Hierárquico Organizado**
- 💊 **Medicamentos** - Catálogo completo de medicamentos
- 📋 **Prescrições Médicas** - Emissão e controle de prescrições
- 🔄 **Movimentações** - Entrada e saída de medicamentos
- ✅ **Dispensações** - Controle de dispensação para pacientes
- 📊 **Relatórios Gerenciais** - Análises e estatísticas detalhadas

### 👥 Gestão de Pacientes e Funcionários

- **Cadastro de Pacientes**: Informações completas, busca por CEP automática
- **Cadastro de Funcionários**: Controle por setor e especialidade
- **Controle de Estoque**: Alertas automáticos de estoque baixo
- **UTI**: Controle específico de consumo e movimentações

### 🏥 Centro Cirúrgico - Fluxo Completo

**Sistema completo com 5 módulos integrados**

#### 1. 📋 Recepção do Centro Cirúrgico
- Recebimento e verificação de pacientes
- Checklist de segurança pré-operatória
- Controle de documentação e consentimentos
- Preparação pré-anestésica

#### 2. 🔬 Assistência Intra-Operatória
- **Escala de Sedação de Ramsay** (1-6 pontos com indicadores visuais)
- **Monitor de Sinais Vitais** em tempo real (PA, FC, FR, Temp, SpO2)
- Controle de medicamentos utilizados
- Registro de eventos intra-operatórios
- Monitoramento contínuo do paciente

#### 3. 😴 Recuperação Anestésica
- **Índice de Aldrete-Kroulik** (≥8 pontos para alta)
- Monitoramento pós-anestésico
- Controle de dor e náuseas
- Critérios de alta da recuperação
- Registro de complicações

#### 4. 🦠 Controle de Infecção Hospitalar (CCIH)
- Protocolos de assepsia e antissepsia
- Controle de materiais estéreis
- Registro de procedimentos de limpeza
- Monitoramento de infecções relacionadas

#### 5. 💰 Custeio Cirúrgico
- Controle de custos por procedimento
- Relatórios de materiais utilizados
- Análise de rentabilidade
- Faturamento de procedimentos

### 🧰 Gerenciamento de Materiais

**Catálogo Completo e Abrangente**

#### 📦 Números do Catálogo
- ✅ **260+ materiais cadastrados** - Cobertura completa hospitalar
- ✅ **25+ categorias especializadas** - Organização por especialidade médica
- ✅ **Controle de estoque avançado** - Mínimos, máximos e alertas automáticos
- ✅ **Precificação completa** - Custos e valores de venda configurados

#### 🏷️ Categorias Principais
- 🫀 **CARDIOLOGIA** - Stents, cateteres, dispositivos cardíacos
- 🧠 **NEUROLOGIA** - Shunts, materiais neurocirúrgicos
- 🎗️ **ONCOLOGIA** - Ports para quimioterapia
- 👁️ **OFTALMOLOGIA** - Lentes intraoculares
- 👶 **PEDIATRIA/NEONATOLOGIA** - Materiais pediátricos
- 🏥 **UTI/EMERGÊNCIA** - Equipamentos críticos
- 🔬 **LABORATÓRIO** - Tubos, reagentes
- 🩺 **CIRURGIA GERAL** - Instrumentais, suturas
- 💊 **MEDICAMENTOS** - Ampolas, comprimidos
- 🦴 **ORTOPEDIA** - Próteses, implantes
- ➕ **E mais 15+ categorias**

#### ⚙️ Funcionalidades Avançadas
- Sistema de filtros múltiplos (categoria, subcategoria, status)
- Busca inteligente (nome, código, especificação)
- Ordenação flexível (nome, categoria, estoque, valor)
- Classificações técnicas (estéril, descartável, implantável)
- Gestão de fornecedores
- Relatórios detalhados por categoria
- Interface responsiva otimizada

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** com TypeScript
- **TailwindCSS 3.4.1** para estilização moderna
- **React Router 6.22.1** para navegação
- **React Icons** para ícones
- **Fetch API** para requisições HTTP

### Backend
- **Node.js 22.20.0** com Express.js 4.18.2
- **JSON** para persistência de dados
- **CORS** habilitado para integração
- **Nodemon** para desenvolvimento
- **PM2** para produção

### DevOps
- **Git** para versionamento
- **PM2** para gerenciamento de processos
- **Nginx** para proxy reverso (produção)
- **Deploy automatizado** via SSH

---

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

### 📋 Pré-requisitos
- **Node.js** versão 16 ou superior (recomendado: 18+)
- **npm** versão 8 ou superior
- **Git** para clonar o repositório

### 📥 1. Clone o repositório
```bash
git clone https://github.com/allanluz/gestao-hospitalar.git
cd gestao-hospitalar
```

### 🚀 2. Formas de Inicializar o Sistema

#### ⚡ **Opção 1: Inicialização Automática (Recomendado)**

##### 🖱️ **Windows - Clique Duplo:**
```
1. Clique duas vezes em: START-HOSPITAL.bat
2. Aguarde a inicialização automática
3. Sistema abre automaticamente no navegador
```

##### 💻 **Qualquer Sistema Operacional:**
```bash
# Primeira execução (instala dependências automaticamente)
npm start

# Ou usando o script direto
node start-system.js
```

#### **Opção 2: Instalação Rápida**
```bash
# Instala todas as dependências de uma vez
npm run setup

# Inicia o sistema completo
npm start
```

#### **Opção 3: VS Code Tasks**
1. Abra o projeto no VS Code
2. Use `Ctrl+Shift+P` e digite "Tasks: Run Task"
3. Selecione "Start Backend Server"
4. Repita o processo e selecione "Start Frontend Server"

#### **Opção 4: Manual (Tradicional)**

**Backend** (Terminal 1):
```bash
cd backend
npm install
npm run dev
# ou
npm start
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm start
```

### 🌐 3. Acesso ao Sistema

Após a inicialização, o sistema estará disponível em:

- **🎨 Frontend (Interface do Usuário):** http://localhost:3001
- **⚙️ Backend API:** http://localhost:5000
- **📊 Dashboard:** http://localhost:3001/ (página inicial)

### ✨ Recursos Disponíveis Imediatamente

- 📊 **Dashboard modernizado** com relógio em tempo real
- 💊 **Gestão de Medicamentos** completa (5 módulos)
- 🔬 **Catálogo com 260+ materiais** hospitalares
- 🏥 **Centro Cirúrgico** completo com 5 módulos
- 👥 **Gestão de pacientes** e funcionários
- 📦 **Controle de estoque** inteligente

---

## 🌐 Deploy em Produção

### ⚡ Deploy Rápido (Render + Vercel)

**Recomendado para deploy rápido e gratuito!**

```bash
# 1. Execute o script de configuração
.\setup-deploy.ps1

# 2. Crie repositório no GitHub e envie o código
git remote add origin https://github.com/SEU-USUARIO/gestao-hospitalar.git
git branch -M main
git push -u origin main
```

**📚 Guias de Deploy:**
- **[DEPLOY-RAPIDO.md](./DEPLOY-RAPIDO.md)** - Guia rápido (10 minutos)
- **[DEPLOY.md](./DEPLOY.md)** - Guia completo com detalhes

**Plataformas:**
- **Backend**: [Render](https://render.com) (Node.js)
- **Frontend**: [Vercel](https://vercel.com) (React)

---

### 📦 Deploy Automatizado (Linux VPS)

#### Pré-requisitos do Servidor
- Ubuntu 20.04+ ou Debian 10+
- Node.js 16+ instalado
- PM2 instalado globalmente: `npm install -g pm2`
- Acesso SSH configurado

#### Passo 1: Criar o Pacote
```bash
# No Windows/local, execute:
tar -czf gestao-hospitalar.tar.gz --exclude=node_modules --exclude=build --exclude=.git backend frontend deploy.sh README.md
```

#### Passo 2: Enviar para o Servidor
```bash
# Substitua USER e SERVER_IP pelos seus dados
scp gestao-hospitalar.tar.gz user@server_ip:/home/user/
```

#### Passo 3: Deploy no Servidor
```bash
# Conecte via SSH
ssh user@server_ip

# Descompacte e execute o deploy
tar -xzf gestao-hospitalar.tar.gz
cd gestao-hospitalar
chmod +x deploy.sh
./deploy.sh
```

### 🔧 Script de Deploy Automático

O script `deploy.sh` automatiza:
1. ✅ Verificação de dependências (Node.js, npm, PM2)
2. 📦 Instalação de dependências do backend
3. 📦 Instalação de dependências do frontend
4. 🏗️ Build de produção do frontend
5. 🚀 Inicialização do backend com PM2
6. 🚀 Inicialização do frontend com PM2
7. ✅ Verificação de status dos serviços

### 🔍 Verificar Status em Produção

```bash
# Ver processos PM2
pm2 list

# Ver logs em tempo real
pm2 logs

# Logs específicos
pm2 logs hospital-backend
pm2 logs hospital-frontend

# Reiniciar serviços
pm2 restart all

# Parar serviços
pm2 stop all

# Status detalhado
pm2 status
```

### 🌐 Configuração de Portas

**Ambiente de Desenvolvimento:**
- Frontend: http://localhost:3001
- Backend: http://localhost:5000

**Ambiente de Produção:**
- Frontend: http://server_ip:3001
- Backend: http://server_ip:5000

### 🔒 Configuração Nginx (Opcional)

```nginx
# /etc/nginx/sites-available/hospital-manager
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📡 API Endpoints

### 🔍 Sistema
- `GET /api/status` - Status da API e serviços
- `GET /api/dashboard` - Estatísticas gerais do sistema

### 👥 Pacientes
- `GET /api/pacientes` - Listar todos os pacientes
- `GET /api/pacientes/:id` - Buscar paciente por ID
- `POST /api/pacientes` - Criar novo paciente
- `PUT /api/pacientes/:id` - Atualizar paciente
- `DELETE /api/pacientes/:id` - Remover paciente

### 👨‍⚕️ Funcionários
- `GET /api/funcionarios` - Listar funcionários
- `GET /api/funcionarios?setor=:setor` - Filtrar por setor
- `POST /api/funcionarios` - Criar funcionário
- `PUT /api/funcionarios/:id` - Atualizar funcionário
- `DELETE /api/funcionarios/:id` - Remover funcionário

### 📦 Estoque
- `GET /api/estoque` - Listar itens do estoque
- `GET /api/estoque/baixo` - Itens com estoque baixo
- `GET /api/estoque/:id` - Buscar item por ID
- `POST /api/estoque` - Criar item
- `PUT /api/estoque/:id` - Atualizar item
- `POST /api/estoque/movimentar` - Registrar movimentação
- `DELETE /api/estoque/:id` - Remover item

### 🏥 UTI
- `GET /api/uti/movimentacoes` - Listar movimentações da UTI
- `POST /api/uti/consumo` - Registrar consumo de material
- `GET /api/uti/relatorio` - Relatório de consumo da UTI
- `GET /api/uti/relatorio?dataInicio=:data&dataFim=:data` - Relatório por período

### 🧰 Materiais
- `GET /api/materiais` - Listar todos os materiais
- `GET /api/materiais?categoria=:categoria` - Filtrar por categoria
- `GET /api/materiais?subcategoria=:subcategoria` - Filtrar por subcategoria
- `GET /api/materiais?search=:termo` - Buscar por termo
- `GET /api/materiais/categorias` - Listar categorias disponíveis
- `GET /api/materiais/estatisticas` - Estatísticas do catálogo
- `GET /api/materiais/:id` - Buscar material por ID
- `POST /api/materiais` - Criar novo material
- `PUT /api/materiais/:id` - Atualizar material
- `DELETE /api/materiais/:id` - Remover material

### 💊 Gestão de Medicamentos

#### Medicamentos
- `GET /api/medicamentos` - Listar medicamentos
- `GET /api/medicamentos/:id` - Buscar medicamento por ID
- `POST /api/medicamentos` - Cadastrar medicamento
- `PUT /api/medicamentos/:id` - Atualizar medicamento
- `DELETE /api/medicamentos/:id` - Remover medicamento

#### Prescrições
- `GET /api/prescricoes` - Listar prescrições
- `GET /api/prescricoes/:id` - Buscar prescrição por ID
- `POST /api/prescricoes` - Criar prescrição
- `PUT /api/prescricoes/:id` - Atualizar prescrição
- `DELETE /api/prescricoes/:id` - Cancelar prescrição

#### Movimentações
- `GET /api/movimentacoes` - Listar movimentações de medicamentos
- `POST /api/movimentacoes` - Registrar movimentação
- `GET /api/movimentacoes/relatorio` - Relatório de movimentações

#### Dispensações
- `GET /api/dispensacoes` - Listar dispensações
- `POST /api/dispensacoes` - Registrar dispensação
- `GET /api/dispensacoes/:id` - Buscar dispensação por ID
- `PUT /api/dispensacoes/:id` - Atualizar dispensação

#### Relatórios
- `GET /api/relatorios-gerenciais` - Relatórios gerenciais
- `GET /api/relatorios-gerenciais/consumo` - Consumo de medicamentos
- `GET /api/relatorios-gerenciais/estoque` - Análise de estoque

### 🏥 Centro Cirúrgico

#### Recepção do Centro Cirúrgico
- `GET /api/centro-cirurgico-recepcao` - Listar recepções
- `GET /api/centro-cirurgico-recepcao/:id` - Buscar recepção por ID
- `POST /api/centro-cirurgico-recepcao` - Criar registro de recepção
- `PUT /api/centro-cirurgico-recepcao/:id` - Atualizar recepção
- `DELETE /api/centro-cirurgico-recepcao/:id` - Remover recepção

#### Assistência Intra-Operatória
- `GET /api/assistencia-intra-operatoria` - Listar assistências
- `GET /api/assistencia-intra-operatoria/:id` - Buscar assistência por ID
- `POST /api/assistencia-intra-operatoria` - Criar nova assistência
- `PUT /api/assistencia-intra-operatoria/:id` - Atualizar assistência
- `DELETE /api/assistencia-intra-operatoria/:id` - Remover assistência

#### Recuperação Anestésica
- `GET /api/recuperacao-anestesica` - Listar recuperações
- `GET /api/recuperacao-anestesica/:id` - Buscar recuperação por ID
- `POST /api/recuperacao-anestesica` - Criar registro de recuperação
- `PUT /api/recuperacao-anestesica/:id` - Atualizar recuperação
- `DELETE /api/recuperacao-anestesica/:id` - Remover registro

#### Controle de Infecção Hospitalar (CCIH)
- `GET /api/controle-infeccao-hospitalar` - Listar controles
- `GET /api/controle-infeccao-hospitalar/:id` - Buscar controle por ID
- `POST /api/controle-infeccao-hospitalar` - Criar controle
- `PUT /api/controle-infeccao-hospitalar/:id` - Atualizar controle
- `DELETE /api/controle-infeccao-hospitalar/:id` - Remover controle

#### Custeio Cirúrgico
- `GET /api/custeio-cirurgico` - Listar custeios
- `GET /api/custeio-cirurgico/:id` - Buscar custeio por ID
- `POST /api/custeio-cirurgico` - Criar custeio
- `PUT /api/custeio-cirurgico/:id` - Atualizar custeio
- `DELETE /api/custeio-cirurgico/:id` - Remover custeio
- `GET /api/custeio-cirurgico/relatorio` - Relatório de custeio

---

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
- **260 materiais hospitalares especializados** organizados em 25+ categorias
- Histórico de movimentações da UTI e Centro Cirúrgico
- Dados completos de custeio cirúrgico com materiais integrados

## ✅ Funcionalidades Implementadas

### Módulos Básicos
- ✅ Dashboard com estatísticas em tempo real
- ✅ Cadastro completo de pacientes com CEP automático
- ✅ Gestão de funcionários por setor
- ✅ Controle de estoque com alertas
- ✅ **Gerenciamento de Materiais** - Catálogo completo com 260+ itens
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
🏥 **Versão**: 2.1.0 - Catálogo de Materiais Implementado  
📅 **Última Atualização**: Outubro 2025  
🚀 **Ambiente**: Produção Ready  
📦 **Materiais**: 260+ itens em 25+ categorias especializadas

