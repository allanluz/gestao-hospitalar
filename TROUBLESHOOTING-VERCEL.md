# 🔧 Troubleshooting: Vercel não atualiza variável de ambiente

## ❌ Problema

O console continua mostrando:
```
[API] Usando REACT_APP_API_URL: https://gestao-hospitalar.onrender.com
```

Deveria mostrar:
```
[API] Usando REACT_APP_API_URL: https://gestao-hospitalar.onrender.com/api
```

## 🎯 Causa

A Vercel está usando um **build em cache** com a variável antiga ou sem a variável configurada.

## ✅ Solução Passo a Passo

### 1️⃣ Configurar Variável na Vercel

1. Acesse: https://vercel.com
2. Clique no projeto **gestao-hospitalar**
3. Vá em **Settings** → **Environment Variables**
4. **Verifique** se existe:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://gestao-hospitalar.onrender.com/api`
   - **Environments**: Production, Preview, Development (todos marcados)

5. **Se não existir ou estiver errado**:
   - Clique em **Add New** (ou Edit)
   - Name: `REACT_APP_API_URL`
   - Value: `https://gestao-hospitalar.onrender.com/api` ⚠️ **COM /api no final!**
   - Marque: ☑️ Production ☑️ Preview ☑️ Development
   - Clique em **Save**

### 2️⃣ Forçar Redeploy SEM Cache

**IMPORTANTE**: Não use o cache antigo!

1. Vá em **Deployments**
2. Encontre o deployment mais recente
3. Clique nos **3 pontinhos** (⋯)
4. Clique em **Redeploy**
5. ⚠️ **DESMARQUE** a opção **"Use existing Build Cache"**
6. Clique em **Redeploy** novamente
7. Aguarde 2-3 minutos o novo build

### 3️⃣ Limpar Cache do Navegador

Após o redeploy concluir:

**Opção 1: Aba Anônima (Recomendado)**
- Pressione `Ctrl + Shift + N` (Chrome/Edge)
- Acesse a URL do site
- Verifique se funciona

**Opção 2: Limpar Cache**
- Pressione `Ctrl + Shift + Delete`
- Selecione "Imagens e arquivos em cache"
- Clique em "Limpar dados"
- Recarregue a página (`Ctrl + F5`)

**Opção 3: Hard Refresh**
- Pressione `Ctrl + F5` várias vezes
- Ou `Ctrl + Shift + R`

### 4️⃣ Verificar no Console

Abra o **DevTools** (F12) e digite no console:

```javascript
console.log(process.env.REACT_APP_API_URL)
```

**Deve mostrar**: `undefined` (variáveis de ambiente não são acessíveis no cliente)

Mas o log da aplicação deve mostrar:
```
[API] Usando REACT_APP_API_URL: https://gestao-hospitalar.onrender.com/api
```

### 5️⃣ Verificar as Requisições

No console, verifique as URLs das requisições:

✅ **Correto**:
```
GET https://gestao-hospitalar.onrender.com/api/dashboard
GET https://gestao-hospitalar.onrender.com/api/pacientes
```

❌ **Errado**:
```
GET https://gestao-hospitalar.onrender.com/dashboard
GET https://gestao-hospitalar.onrender.com/pacientes
```

## 🔍 Diagnóstico Adicional

### Verificar Deployment Atual

1. Vá em **Deployments** na Vercel
2. Clique no deployment **mais recente**
3. Vá em **Environment Variables**
4. Verifique se `REACT_APP_API_URL` aparece lá

### Verificar Build Logs

1. No deployment, clique em **View Build Logs**
2. Procure por erros relacionados a variáveis de ambiente
3. Verifique se o build foi concluído com sucesso

## ⚠️ Problemas Comuns

### 1. Variável não aparece no deployment

**Causa**: Variável foi adicionada DEPOIS do deployment

**Solução**: Fazer novo redeploy (passo 2️⃣)

### 2. Build usa cache antigo

**Causa**: Opção "Use existing Build Cache" marcada

**Solução**: Redeploy SEM cache (passo 2️⃣, item 5)

### 3. Navegador mostra versão antiga

**Causa**: Service Worker ou cache do navegador

**Solução**: Aba anônima ou limpar cache (passo 3️⃣)

### 4. URL ainda sem /api

**Causa**: `.env.production` no repo está sem `/api`

**Solução**: 
```bash
# Editar frontend/.env.production
REACT_APP_API_URL=https://gestao-hospitalar.onrender.com/api

git add frontend/.env.production
git commit -m "fix: adicionar /api no .env.production"
git push
```

## ✅ Checklist Final

Antes de testar novamente, confirme:

- [ ] Variável configurada na Vercel Dashboard
- [ ] Todos os ambientes marcados (Production, Preview, Development)
- [ ] Redeploy feito SEM cache
- [ ] Build concluído com sucesso (verde)
- [ ] Cache do navegador limpo ou usando aba anônima
- [ ] URL da Vercel é a mais recente (verifica no Deployments)

## 🆘 Se ainda não funcionar

1. **Delete a variável** na Vercel
2. **Crie novamente** do zero:
   - Name: `REACT_APP_API_URL`
   - Value: `https://gestao-hospitalar.onrender.com/api`
   - Todos os ambientes marcados
3. **Delete o deployment** atual
4. **Force push** no GitHub:
   ```bash
   git commit --allow-empty -m "force: rebuild Vercel"
   git push
   ```
5. Aguarde novo deployment
6. Teste em aba anônima

## 💡 Alternativa: Usar Production URL da Vercel

Se tiver configurado domínio customizado ou URL de produção:

1. Vá em **Deployments**
2. Encontre o deployment com badge **"Production"**
3. Use essa URL, não a de preview (`-q3pwfoosk-`)

---

**Última atualização**: 28/11/2025
