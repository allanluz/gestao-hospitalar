# 🚀 COMECE AQUI - Deploy da Aplicação

## ⚡ Início Rápido (3 comandos)

### 1. Configure o Git automaticamente
```powershell
.\setup-deploy.ps1
```

### 2. Crie o repositório no GitHub
- Acesse: https://github.com/new
- Nome: `gestao-hospitalar`
- Deixe **vazio** (não marque nenhuma opção)
- Clique em "Create repository"

### 3. Envie o código para o GitHub
```bash
git remote add origin https://github.com/SEU-USUARIO/gestao-hospitalar.git
git branch -M main
git push -u origin main
```

> ⚠️ **Substitua `SEU-USUARIO`** pelo seu nome de usuário do GitHub!

---

## 📚 Escolha seu Guia

Depois de enviar para o GitHub, escolha um dos guias:

| Guia | Tempo | Quando Usar |
|------|-------|-------------|
| **[DEPLOY-RAPIDO.md](./DEPLOY-RAPIDO.md)** | 10 min | Primeiro deploy, quer algo rápido |
| **[DEPLOY.md](./DEPLOY.md)** | 20 min | Quer entender todos os detalhes |
| **[CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md)** | - | Verificar se fez tudo certo |

---

## 🎯 Resumo do Processo

```
1. .\setup-deploy.ps1          ← Você está aqui!
   ↓
2. GitHub (criar repo)
   ↓
3. git push
   ↓
4. Deploy Backend (Render)
   ↓
5. Deploy Frontend (Vercel)
   ↓
6. 🎉 Aplicação online!
```

---

## ❓ Precisa de Ajuda?

- **Comandos úteis**: [COMANDOS-DEPLOY.md](./COMANDOS-DEPLOY.md)
- **Resumo completo**: [RESUMO-DEPLOY.md](./RESUMO-DEPLOY.md)
- **Guia completo**: [DEPLOY.md](./DEPLOY.md)

---

## 🔗 Links Importantes

- **GitHub**: https://github.com/new
- **Render** (backend): https://dashboard.render.com
- **Vercel** (frontend): https://vercel.com

---

**💡 Dica**: Siga os passos em ordem e consulte o **CHECKLIST-DEPLOY.md** para não esquecer nada!
