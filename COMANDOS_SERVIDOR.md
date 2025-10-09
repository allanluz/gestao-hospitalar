# 🔧 Comandos para Executar no Servidor

## Você está conectado ao servidor! Agora execute:

### Passo 1: Verificar se o arquivo ZIP está lá
```bash
ls -lh gestao-hospitalar.zip
```

### Passo 2: Descompactar o arquivo
```bash
unzip -o gestao-hospitalar.zip
```

### Passo 3: Verificar se foi descompactado
```bash
ls -la
```

### Passo 4: Entrar no diretório
```bash
cd gestao-hospitalar
```

### Passo 5: Dar permissão de execução
```bash
chmod +x deploy.sh
```

### Passo 6: Executar o deploy
```bash
./deploy.sh
```

---

## Se o arquivo ZIP não estiver lá:

Execute no seu Windows (PowerShell):
```powershell
scp gestao-hospitalar.zip allan@10.67.23.102:/home/allan/
```

Senha: Luz@2025

---

## Comando Único (Tudo de uma vez):

Depois que o ZIP estiver lá:
```bash
unzip -o gestao-hospitalar.zip && cd gestao-hospitalar && chmod +x deploy.sh && ./deploy.sh
```

---

## Para verificar se o ZIP está no servidor:

```bash
pwd           # Ver onde você está
ls -lh *.zip  # Listar arquivos ZIP
```
