# ⚠️ IMPORTANTE: Use Docker no Render!

## ❌ Erro Comum

```
E: List directory /var/lib/apt/lists/partial is missing.
==> Build failed
```

## ✅ Solução Rápida

### Ao criar o serviço no Render:

```
┌─────────────────────────────────────────┐
│  New Web Service                        │
├─────────────────────────────────────────┤
│                                         │
│  Runtime:  [ Docker ▼ ]  ← ESCOLHA     │
│            ❌ NÃO escolha "Node"        │
│                                         │
│  Root Directory: backend                │
│  Docker Context: backend                │
│  Dockerfile:     ./Dockerfile           │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 Se já criou o serviço com Node

**Opção 1: Delete e recrie**
1. Delete o serviço atual
2. Crie novo com Docker

**Opção 2: Mude para Docker**
1. Settings → Runtime
2. Mude de "Node" para "Docker"
3. Configure Dockerfile paths
4. Manual Deploy

## 📁 Arquivos Necessários

- ✅ `backend/Dockerfile` (já criado)
- ✅ `backend/.dockerignore` (já criado)
- ✅ `render.yaml` (já criado)

## 🚀 Deploy Correto

```bash
git add .
git commit -m "fix: usar Docker para resolver dependências do canvas"
git push
```

Depois no Render:
1. **New Web Service** ou **Settings**
2. **Runtime**: `Docker`
3. **Manual Deploy**

✅ **Pronto! O build funcionará!**

---

📖 **Detalhes completos**: SOLUCAO-ERRO-CANVAS.md
