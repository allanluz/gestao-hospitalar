# 🚀 Deploy Rápido - Sistema de Gestão Hospitalar

Este guia fornece instruções rápidas para fazer o deploy da aplicação.

## ⚡ Configuração Rápida

### 1️⃣ Execute o script de configuração

```powershell
.\setup-deploy.ps1
```

Este script irá:
- ✅ Inicializar Git
- ✅ Criar arquivos .env
- ✅ Fazer commit inicial
- ✅ Preparar tudo para o push

### 2️⃣ Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `gestao-hospitalar`
3. **NÃO** marque nenhuma opção de inicialização
4. Clique em "Create repository"

### 3️⃣ Conectar e enviar código

```bash
git remote add origin https://github.com/SEU-USUARIO/gestao-hospitalar.git
git branch -M main
git push -u origin main
```

> ⚠️ Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub

---

## 🖥️ Deploy Backend (Render)

### Configuração Rápida

1. **Acesse**: https://dashboard.render.com
2. **New +** → **Web Service**
3. **Conecte** o repositório GitHub
4. **Configure**:
   - Name: `gestao-hospitalar-api`
   - **Runtime**: `Docker` ⚠️ (NÃO escolha Node!)
   - Root Directory: `backend`
   - Docker Build Context Path: `backend`
   - Dockerfile Path: `./Dockerfile`
5. **Environment**:
   ```
   NODE_ENV=production
   ```
6. **Create Web Service**

✅ **Copie a URL**: `https://seu-app.onrender.com`

---

## 🌐 Deploy Frontend (Vercel)

### Antes de fazer deploy

**Atualize** `frontend/.env.production` com a URL do Render:

```env
REACT_APP_API_URL=https://seu-app.onrender.com
```

**Commit e push**:

```bash
git add frontend/.env.production
git commit -m "chore: configurar URL da API"
git push
```

### Configuração Rápida

1. **Acesse**: https://vercel.com
2. **Add New...** → **Project**
3. **Import** o repositório
4. **Configure**:
   - Root Directory: `frontend`
   - Framework: Create React App
5. **Environment Variables**:
   - `REACT_APP_API_URL` = `https://seu-app.onrender.com`
6. **Deploy**

✅ **Seu site**: `https://seu-app.vercel.app`

---

## 🔧 Configurar CORS

No **Render Dashboard**:

1. Vá em **Environment**
2. Adicione:
   ```
   FRONTEND_URL=https://seu-app.vercel.app
   ```
3. **Save Changes** (redeploy automático)

---

## ✅ Verificar

### Backend
Acesse: `https://seu-app.onrender.com/api/status`

Deve retornar:
```json
{
  "message": "Sistema de Gerenciamento Hospitalar - API funcionando!",
  "timestamp": "..."
}
```

### Frontend
Acesse: `https://seu-app.vercel.app`

O sistema deve carregar normalmente!

---

## 📚 Documentação Completa

Para instruções detalhadas, consulte: **[DEPLOY.md](./DEPLOY.md)**

---

## 🆘 Problemas Comuns

### ❌ Erro de CORS
- Verifique `FRONTEND_URL` no Render
- Confirme que está usando a URL correta da Vercel

### ❌ 404 nas rotas do React
- Verifique se `vercel.json` está no lugar certo
- Todas as rotas devem redirecionar para `index.html`

### ❌ API não responde
- Aguarde 30-60s na primeira requisição (cold start do Render)
- Verifique logs no Render Dashboard
- Teste a URL da API diretamente

---

## 🎉 Pronto!

Sua aplicação está online e pronta para uso!

- **Frontend**: `https://seu-app.vercel.app`
- **Backend**: `https://seu-app.onrender.com`

Deploy automático configurado! ✨
