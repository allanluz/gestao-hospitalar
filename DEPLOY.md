# 🚀 Guia de Deploy - Sistema de Gestão Hospitalar

## 📋 Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Render](https://render.com) (backend)
- Conta no [Vercel](https://vercel.com) (frontend)
- Git instalado localmente

## 📦 1. Preparar o Repositório GitHub

### 1.1. Inicializar Git (se ainda não foi feito)

```bash
git init
git add .
git commit -m "feat: configuração inicial para deploy"
```

### 1.2. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com/new)
2. Crie um novo repositório chamado `gestao-hospitalar`
3. **NÃO** inicialize com README, .gitignore ou licença

### 1.3. Conectar e Enviar para GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/gestao-hospitalar.git
git branch -M main
git push -u origin main
```

---

## 🖥️ 2. Deploy do Backend no Render

### 2.1. Acessar Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**

### 2.2. Conectar Repositório

1. Conecte sua conta GitHub
2. Selecione o repositório `gestao-hospitalar`
3. Clique em **"Connect"**

### 2.3. Configurar o Serviço

Preencha os campos:

- **Name**: `gestao-hospitalar-api` (ou nome de sua preferência)
- **Region**: Escolha a região mais próxima
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 2.4. Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```
NODE_ENV=production
PORT=5000
```

### 2.5. Plano e Deploy

1. Escolha o plano **Free** (ou o de sua preferência)
2. Clique em **"Create Web Service"**
3. Aguarde o build e deploy (5-10 minutos)

### 2.6. Obter URL do Backend

Após o deploy, você receberá uma URL como:
```
https://gestao-hospitalar-api.onrender.com
```

⚠️ **Importante**: Copie esta URL, você precisará dela para configurar o frontend!

---

## 🌐 3. Deploy do Frontend na Vercel

### 3.1. Atualizar Variável de Ambiente

**ANTES de fazer o deploy**, atualize o arquivo `.env.production`:

```env
REACT_APP_API_URL=https://gestao-hospitalar-api.onrender.com
```

> ⚠️ Substitua pela URL real que você obteve do Render!

Commit esta alteração:

```bash
git add frontend/.env.production
git commit -m "chore: configurar URL da API para produção"
git push
```

### 3.2. Acessar Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em **"Add New..."** → **"Project"**

### 3.3. Importar Repositório

1. Clique em **"Import Git Repository"**
2. Selecione `gestao-hospitalar`
3. Clique em **"Import"**

### 3.4. Configurar o Projeto

Preencha os campos:

- **Project Name**: `gestao-hospitalar` (ou nome de sua preferência)
- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (detectado automaticamente)
- **Output Directory**: `build` (detectado automaticamente)

### 3.5. Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

- **Variable Name**: `REACT_APP_API_URL`
- **Value**: `https://gestao-hospitalar-api.onrender.com` (sua URL do Render)
- **Environment**: Todas (Production, Preview, Development)

### 3.6. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)

### 3.7. Obter URL do Frontend

Após o deploy, você receberá uma URL como:
```
https://gestao-hospitalar.vercel.app
```

---

## 🔧 4. Configurar CORS no Backend

### 4.1. Atualizar server.js

Após obter a URL da Vercel, você precisa configurar o CORS no backend:

1. Acesse o Render Dashboard
2. Vá em **Environment** → **Environment Variables**
3. Adicione:

```
FRONTEND_URL=https://gestao-hospitalar.vercel.app
```

4. Clique em **"Save Changes"**
5. O Render fará redeploy automático

### 4.2. Atualizar Código do Backend (Opcional)

Se quiser configurar CORS explicitamente, atualize `backend/server.js`:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## ✅ 5. Verificar Deploy

### 5.1. Testar Backend

Acesse no navegador:
```
https://gestao-hospitalar-api.onrender.com/api/pacientes
```

Deve retornar JSON com dados dos pacientes.

### 5.2. Testar Frontend

Acesse:
```
https://gestao-hospitalar.vercel.app
```

O sistema deve carregar normalmente e fazer requisições para o backend.

---

## 🔄 6. Atualizações Futuras

### Deploy Automático

Ambos os serviços estão configurados para deploy automático:

1. Faça alterações no código
2. Commit e push para GitHub:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push
   ```
3. **Render** e **Vercel** detectam automaticamente e fazem redeploy

### Logs e Monitoramento

- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Deployments → View Function Logs

---

## 🎯 7. URLs Finais

Após concluir o deploy, você terá:

| Serviço | URL |
|---------|-----|
| **Backend (API)** | `https://gestao-hospitalar-api.onrender.com` |
| **Frontend (Web)** | `https://gestao-hospitalar.vercel.app` |

---

## ⚠️ Observações Importantes

### Render Free Tier
- O serviço gratuito do Render **hiberna após 15 minutos de inatividade**
- A primeira requisição após hibernação pode demorar 30-60 segundos
- Para evitar isso, considere:
  - Upgrade para plano pago
  - Usar serviço de "ping" (UptimeRobot, cron-job.org)

### Vercel Free Tier
- Build time: até 6000 minutos/mês
- Bandwidth: 100 GB/mês
- Sem limite de deploys

---

## 🐛 Troubleshooting

### Erro de CORS
Se aparecer erro de CORS no console:
1. Verifique se `FRONTEND_URL` está configurado no Render
2. Verifique se o backend está aceitando requisições da URL da Vercel

### Erro 404 nas rotas do React
- Certifique-se que `vercel.json` está configurado corretamente
- Todas as rotas devem redirecionar para `index.html`

### API não responde
- Verifique logs no Render Dashboard
- Confirme que `REACT_APP_API_URL` está correto no Vercel
- Teste a URL da API diretamente no navegador

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Render e Vercel
2. Teste as URLs individualmente
3. Confirme todas as variáveis de ambiente

---

**✨ Deploy concluído com sucesso!**
