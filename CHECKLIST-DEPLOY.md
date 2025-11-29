# ✅ Checklist de Deploy - Sistema de Gestão Hospitalar

Use este checklist para garantir que todos os passos foram executados corretamente.

## 📋 Pré-Deploy

### Preparação do Código

- [ ] Código está funcionando localmente
- [ ] Backend executa sem erros (`npm run dev` no backend)
- [ ] Frontend executa sem erros (`npm start` no frontend)
- [ ] Todas as rotas da API estão funcionando
- [ ] Console do navegador não mostra erros críticos

### Configuração de Arquivos

- [ ] `.gitignore` criado na raiz
- [ ] `backend/.gitignore` criado
- [ ] `backend/.env.example` criado
- [ ] `frontend/.env.example` criado
- [ ] `frontend/.env.production` criado
- [ ] `vercel.json` criado na raiz
- [ ] `frontend/vercel.json` criado
- [ ] `DEPLOY.md` criado
- [ ] `DEPLOY-RAPIDO.md` criado

---

## 🐙 GitHub

### Repositório

- [ ] Executou `.\setup-deploy.ps1` (ou configurou Git manualmente)
- [ ] Criou repositório no GitHub
- [ ] Conectou repositório local ao GitHub
- [ ] Fez push do código (`git push -u origin main`)
- [ ] Verificou que todos os arquivos estão no GitHub
- [ ] Arquivo `.env` **NÃO** está no GitHub (deve estar no .gitignore)

---

## 🖥️ Backend - Render

### Configuração Inicial

- [ ] Criou conta no Render (https://render.com)
- [ ] Clicou em "New +" → "Web Service"
- [ ] Conectou conta GitHub ao Render
- [ ] Selecionou o repositório `gestao-hospitalar`

### Configurações do Serviço

- [ ] **Name**: definido (ex: `gestao-hospitalar-api`)
- [ ] **Region**: escolhida
- [ ] **Branch**: `main`
- [ ] **Root Directory**: `backend`
- [ ] **Runtime**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `node server.js`

### Variáveis de Ambiente

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000` (opcional, Render define automaticamente)

### Deploy e Verificação

- [ ] Clicou em "Create Web Service"
- [ ] Aguardou build completar (5-10 minutos)
- [ ] Status mostra "Live" (verde)
- [ ] **Copiou a URL do backend** (ex: `https://gestao-hospitalar-api.onrender.com`)
- [ ] Testou no navegador: `https://SEU-APP.onrender.com/api/status`
- [ ] Resposta JSON recebida com sucesso

---

## 🌐 Frontend - Vercel

### Atualização da URL da API

- [ ] Abriu `frontend/.env.production`
- [ ] Substituiu URL pela URL real do Render
- [ ] Commitou a alteração:
  ```bash
  git add frontend/.env.production
  git commit -m "chore: configurar URL da API"
  git push
  ```

### Configuração Inicial

- [ ] Criou conta no Vercel (https://vercel.com)
- [ ] Clicou em "Add New..." → "Project"
- [ ] Conectou conta GitHub ao Vercel
- [ ] Importou o repositório `gestao-hospitalar`

### Configurações do Projeto

- [ ] **Project Name**: definido (ex: `gestao-hospitalar`)
- [ ] **Framework Preset**: `Create React App`
- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm run build` (auto-detectado)
- [ ] **Output Directory**: `build` (auto-detectado)

### Variáveis de Ambiente

- [ ] **Name**: `REACT_APP_API_URL`
- [ ] **Value**: URL do Render (ex: `https://gestao-hospitalar-api.onrender.com`)
- [ ] **Environment**: Todas marcadas (Production, Preview, Development)

### Deploy e Verificação

- [ ] Clicou em "Deploy"
- [ ] Aguardou build completar (3-5 minutos)
- [ ] Status mostra "Ready" (verde)
- [ ] **Copiou a URL do frontend** (ex: `https://gestao-hospitalar.vercel.app`)
- [ ] Testou no navegador: acessou a URL
- [ ] Sistema carregou corretamente
- [ ] Dashboard mostra dados
- [ ] Console do navegador sem erros de CORS

---

## 🔧 Configuração Final - CORS

### Atualizar Backend com URL do Frontend

- [ ] Acessou Render Dashboard
- [ ] Selecionou o serviço backend
- [ ] Clicou em "Environment"
- [ ] Adicionou variável:
  - **Name**: `FRONTEND_URL`
  - **Value**: URL da Vercel (ex: `https://gestao-hospitalar.vercel.app`)
- [ ] Clicou em "Save Changes"
- [ ] Aguardou redeploy automático
- [ ] Verificou que o status voltou para "Live"

---

## ✅ Testes Finais

### Backend

- [ ] `https://SEU-APP.onrender.com/` → Retorna informações da API
- [ ] `https://SEU-APP.onrender.com/api/status` → Retorna status
- [ ] `https://SEU-APP.onrender.com/api/pacientes` → Retorna lista de pacientes
- [ ] Nenhum erro 500 ou 404

### Frontend

- [ ] Página inicial carrega
- [ ] Dashboard mostra estatísticas
- [ ] Navegação entre páginas funciona
- [ ] Dados são carregados do backend
- [ ] Formulários funcionam
- [ ] Console sem erros de CORS
- [ ] Console sem erros de API

### Integração

- [ ] Frontend consegue buscar dados do backend
- [ ] Não há erros de CORS no console
- [ ] Requisições POST/PUT/DELETE funcionam
- [ ] Notificações aparecem corretamente

---

## 📱 Testes em Dispositivos

- [ ] Desktop (Chrome)
- [ ] Desktop (Firefox)
- [ ] Desktop (Edge)
- [ ] Mobile (Chrome)
- [ ] Tablet (Safari - se disponível)

---

## 📊 Monitoramento

### Render

- [ ] Configurou alertas de deploy (opcional)
- [ ] Verificou logs: nenhum erro crítico
- [ ] Anotou URL final do backend

### Vercel

- [ ] Configurou alertas de deploy (opcional)
- [ ] Verificou logs: nenhum erro de build
- [ ] Anotou URL final do frontend

---

## 📝 Documentação

- [ ] URLs finais anotadas:
  - Backend: `____________________________`
  - Frontend: `____________________________`
- [ ] Credenciais seguras guardadas
- [ ] Variáveis de ambiente documentadas
- [ ] README.md atualizado (se necessário)

---

## 🎉 Deploy Concluído!

Se todos os itens estão marcados, seu deploy está completo e funcional!

### 🔄 Deploy Automático Configurado

Agora, toda vez que você fizer:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push
```

**Render** e **Vercel** farão deploy automático! 🚀

---

## 🆘 Problemas?

Consulte a seção de Troubleshooting em:
- **[DEPLOY.md](./DEPLOY.md)** - Seção "Troubleshooting"
- **Render Logs**: Dashboard → Service → Logs
- **Vercel Logs**: Dashboard → Project → Deployments → Function Logs

---

**Data do Deploy**: _______________  
**Versão**: v1.0.0  
**Status**: ✅ Concluído
