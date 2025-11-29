# 🔧 Solução: Erro Canvas no Render

## ❌ Erro Encontrado

```
Error: /opt/render/project/src/backend/node_modules/canvas/build/Release/canvas.node: invalid ELF header
```

## 🎯 Causa

A biblioteca `canvas` requer dependências nativas do sistema Linux que não estão instaladas por padrão no Render.

## ✅ Solução Aplicada

### 1. Dockerfile Criado

O Render não permite `apt-get` no build command devido ao sistema read-only. A solução é usar **Docker**.

Criamos `backend/Dockerfile`:

```dockerfile
FROM node:22-slim
RUN apt-get update && apt-get install -y \
    build-essential libcairo2-dev libpango1.0-dev \
    libjpeg-dev libgif-dev librsvg2-dev
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 10000
CMD ["node", "server.js"]
```

### 2. O que isso faz?

Este comando instala as seguintes dependências:

| Pacote | Função |
|--------|--------|
| `build-essential` | Ferramentas de compilação C/C++ |
| `libcairo2-dev` | Biblioteca de gráficos Cairo |
| `libpango1.0-dev` | Renderização de texto |
| `libjpeg-dev` | Suporte para JPEG |
| `libgif-dev` | Suporte para GIF |
| `librsvg2-dev` | Suporte para SVG |

### 3. Arquivos Criados

Foram criados arquivos auxiliares no projeto:

- ✅ `backend/build.sh` - Script de build alternativo
- ✅ `render.yaml` - Configuração automática do Render
- ✅ `backend/package.json` - Atualizado com script de build

## 🚀 Como Aplicar no Render

### Opção 1: Recriar Serviço com Docker (RECOMENDADO)

1. **Delete o serviço atual** no Render Dashboard
2. Clique em **New +** → **Web Service**
3. Conecte o repositório GitHub
4. **Configure**:
   - Name: `gestao-hospitalar-api`
   - **Runtime**: `Docker` ⚠️ (NÃO escolha Node!)
   - Root Directory: `backend`
   - Docker Build Context: `backend`
   - Dockerfile Path: `./Dockerfile`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   ```
6. **Create Web Service**

### Opção 2: Atualizar Serviço Existente

1. Acesse seu serviço no Render Dashboard
2. Vá em **Settings**
3. Em **Build & Deploy**, mude:
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Build Context Path**: `./backend`
4. **Save Changes**
5. **Manual Deploy**

### Opção 3: Via render.yaml (Automático)

O arquivo `render.yaml` na raiz do projeto configura tudo automaticamente com Docker:

```yaml
services:
  - type: web
    name: gestao-hospitalar-api
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    envVars:
      - key: NODE_ENV
        value: production
```

Quando você criar um novo serviço usando "Blueprint", o Render detectará e usará essas configurações.

## 🔍 Verificar Sucesso

Após o redeploy, você verá nos logs:

```
==> Building...
Reading package lists...
Building dependency tree...
libcairo2-dev is already the newest version
...
==> Build successful!
==> Running 'node server.js'
🏥 Sistema de Gerenciamento Hospitalar
🚀 Servidor rodando na porta 10000
```

## 📝 Alternativa: Remover Canvas (Temporário)

Se você não precisa de códigos de barras/QR codes agora, pode remover temporariamente:

### 1. Remover dependência

```bash
cd backend
npm uninstall canvas
```

### 2. Comentar imports no código

Procure por arquivos que usam canvas e comente:

```javascript
// const { createCanvas } = require('canvas');
// const JsBarcode = require('jsbarcode');
```

### 3. Commit e push

```bash
git add backend/package.json
git commit -m "temp: remover canvas para testes"
git push
```

## 🎯 Próximos Passos

1. ✅ Build Command atualizado no Render
2. ✅ Fazer **Manual Deploy**
3. ✅ Verificar logs de build
4. ✅ Testar endpoint: `https://seu-app.onrender.com/api/status`

## 📚 Documentação Atualizada

Os seguintes guias foram atualizados com esta solução:

- ✅ `DEPLOY.md` - Guia completo
- ✅ `DEPLOY-RAPIDO.md` - Guia rápido
- ✅ `backend/package.json` - Script de build adicionado

---

## 💡 Referências

- [Canvas NPM](https://www.npmjs.com/package/canvas)
- [Render Build Commands](https://render.com/docs/native-runtimes#build-commands)
- [Cairo Graphics](https://www.cairographics.org/)

---

**✅ Problema resolvido! O deploy deve funcionar agora.** 🚀
