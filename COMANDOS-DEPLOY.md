# 🔧 Comandos Úteis - Deploy e Manutenção

Referência rápida de comandos para deploy e manutenção do sistema.

---

## 🐙 Git & GitHub

### Configuração Inicial

```bash
# Inicializar Git
git init

# Configurar usuário
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"

# Adicionar todos os arquivos
git add .

# Criar commit inicial
git commit -m "feat: configuração inicial do sistema"

# Conectar ao GitHub
git remote add origin https://github.com/SEU-USUARIO/gestao-hospitalar.git

# Renomear branch para main
git branch -M main

# Enviar para GitHub
git push -u origin main
```

### Fluxo de Trabalho Diário

```bash
# Ver status dos arquivos
git status

# Adicionar arquivos modificados
git add .

# Criar commit com mensagem
git commit -m "feat: adicionar nova funcionalidade"

# Enviar para GitHub (deploy automático!)
git push

# Ver histórico de commits
git log --oneline

# Ver diferenças antes de commitar
git diff
```

### Desfazer Alterações

```bash
# Desfazer alterações em arquivo específico
git checkout -- arquivo.js

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações)
git reset --hard HEAD~1

# Ver commits remotos
git log origin/main
```

---

## 💻 Desenvolvimento Local

### Backend

```bash
# Navegar para pasta backend
cd backend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em modo produção
npm start

# Verificar versão do Node
node --version
```

### Frontend

```bash
# Navegar para pasta frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Criar build de produção
npm run build

# Testar build localmente
npx serve -s build -p 3000
```

### Ambos (na raiz do projeto)

```bash
# Instalar dependências de ambos
npm run setup

# No Windows - usar script batch
START-HOSPITAL.bat
```

---

## 🖥️ Render (Backend)

### Via Dashboard

1. Acessar: https://dashboard.render.com
2. Selecionar serviço
3. Ações disponíveis:
   - **Manual Deploy**: Botão "Manual Deploy"
   - **Logs**: Aba "Logs"
   - **Environment**: Aba "Environment"
   - **Settings**: Aba "Settings"

### Render CLI (Opcional)

```bash
# Instalar Render CLI
npm install -g render-cli

# Login
render login

# Ver serviços
render services list

# Ver logs
render logs <service-id>

# Deploy manual
render deploy <service-id>
```

### Comandos Úteis

```bash
# Verificar se API está online
curl https://seu-app.onrender.com/api/status

# Testar endpoint específico
curl https://seu-app.onrender.com/api/pacientes

# Ver headers da resposta
curl -I https://seu-app.onrender.com/api/status
```

---

## 🌐 Vercel (Frontend)

### Via Dashboard

1. Acessar: https://vercel.com/dashboard
2. Selecionar projeto
3. Ações disponíveis:
   - **Deployments**: Ver histórico
   - **Settings**: Configurações
   - **Domains**: Gerenciar domínios
   - **Environment Variables**: Variáveis

### Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy manual (na pasta frontend)
cd frontend
vercel

# Deploy para produção
vercel --prod

# Ver lista de projetos
vercel list

# Ver logs de build
vercel logs <deployment-url>
```

### Comandos Úteis

```bash
# Testar se site está online
curl https://seu-app.vercel.app

# Ver headers
curl -I https://seu-app.vercel.app

# Testar performance
curl -w "@-" -o /dev/null -s https://seu-app.vercel.app <<EOF
    time_total:  %{time_total}s\n
EOF
```

---

## 🔍 Diagnóstico de Problemas

### Verificar Status dos Serviços

```bash
# Backend (Render)
curl https://seu-app.onrender.com/api/status

# Frontend (Vercel)
curl -I https://seu-app.vercel.app

# Testar CORS
curl -H "Origin: https://seu-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://seu-app.onrender.com/api/pacientes
```

### Verificar Variáveis de Ambiente

```bash
# Listar variáveis locais
# Windows PowerShell
Get-ChildItem Env:

# Ver variável específica
echo $env:REACT_APP_API_URL
```

### Limpar Cache

```bash
# Frontend - limpar cache do npm
cd frontend
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install

# Backend - limpar cache
cd backend
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📊 Monitoramento

### Logs em Tempo Real

**Render:**
```
Dashboard → Service → Logs → (auto-atualiza)
```

**Vercel:**
```
Dashboard → Project → Deployments → View Function Logs
```

### Verificar Uso de Recursos

**Render Free Tier:**
- 750 horas/mês de runtime
- Hiberna após 15 min de inatividade

**Vercel Free Tier:**
- 100 GB bandwidth/mês
- 100 deployments/dia

---

## 🔄 Atualização Rápida

### Fluxo Completo de Atualização

```bash
# 1. Fazer alterações no código
# 2. Testar localmente
npm run dev  # backend
npm start    # frontend

# 3. Commitar alterações
git add .
git commit -m "feat: descrição da alteração"

# 4. Enviar para GitHub
git push

# 5. Deploy automático!
# Render e Vercel detectam automaticamente e fazem deploy
```

### Verificar Deploy

```bash
# Aguardar 2-5 minutos e verificar:

# Backend
curl https://seu-app.onrender.com/api/status

# Frontend
curl https://seu-app.vercel.app
```

---

## 🔐 Variáveis de Ambiente

### Produção

**Backend (Render):**
```env
NODE_ENV=production
FRONTEND_URL=https://seu-app.vercel.app
```

**Frontend (Vercel):**
```env
REACT_APP_API_URL=https://seu-app.onrender.com
```

### Desenvolvimento

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 📝 Commits Semânticos

Padrão de mensagens de commit:

```bash
# Nova funcionalidade
git commit -m "feat: adicionar módulo de relatórios"

# Correção de bug
git commit -m "fix: corrigir erro no cadastro de pacientes"

# Documentação
git commit -m "docs: atualizar README com instruções"

# Estilo/formatação
git commit -m "style: formatar código com Prettier"

# Refatoração
git commit -m "refactor: otimizar consulta de medicamentos"

# Performance
git commit -m "perf: melhorar carregamento do dashboard"

# Testes
git commit -m "test: adicionar testes para API"

# Configuração
git commit -m "chore: atualizar dependências"
```

---

## 🆘 Comandos de Emergência

### Reverter Deploy

```bash
# Reverter último commit localmente
git reset --hard HEAD~1
git push --force

# Render e Vercel farão deploy da versão anterior
```

### Forçar Redeploy

**Render:**
- Dashboard → Manual Deploy → "Clear build cache & deploy"

**Vercel:**
```bash
vercel --force --prod
```

---

## 📞 Links Úteis

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/SEU-USUARIO/gestao-hospitalar
- **Documentação Render**: https://render.com/docs
- **Documentação Vercel**: https://vercel.com/docs

---

**💡 Dica:** Salve este arquivo como favorito para consulta rápida!
