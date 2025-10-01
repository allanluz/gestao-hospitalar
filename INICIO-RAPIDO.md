# 🚀 INÍCIO RÁPIDO - Sistema Hospitalar

## ⚡ Formas de Iniciar (Escolha a Melhor)

### 🖱️ **Opção 1: Windows - Clique Duplo**
```
COM Node.js instalado:
1. Clique duas vezes em: START-HOSPITAL.bat

SEM Node.js instalado:
1. Clique duas vezes em: START-HOSPITAL-PORTABLE.bat
   (Baixa Node.js automaticamente - 30MB)
```

### 🐍 **Opção 2: Python (Qualquer Sistema)**
```bash
# Funciona em Windows, Linux, macOS
python start-hospital.py

# Ou Python 3
python3 start-hospital.py
```

### 💻 **Opção 3: Linha de Comando (Node.js)**
```bash
# Instalar dependências (primeira vez)
npm run setup

# Iniciar sistema
npm start
```

### 🔧 **Opção 4: Manual Tradicional**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

## 🏥 **Sistema Pronto!**

- **Dashboard:** http://localhost:3000
- **API:** http://localhost:5000

## ✨ **Principais Recursos**

- 📊 **Dashboard** em tempo real
- 👥 **Pacientes** e funcionários
- 📦 **Estoque** inteligente  
- 🔬 **260+ Materiais** catalogados
- 🏥 **Centro Cirúrgico** completo
- 🩺 **UTI** e emergência

## 📋 **Categorias de Materiais**

- 🫀 Cardiologia - 🧠 Neurologia - 🎗️ Oncologia
- 👁️ Oftalmologia - 👶 Pediatria - 🔬 Laboratório  
- 🩺 Emergência - 🏥 UTI Móvel - 🔥 Queimados
- E mais 15+ categorias especializadas!

## 🆘 **Problemas Comuns**

### **❌ Node.js não encontrado?**
```
✅ Use: START-HOSPITAL-PORTABLE.bat (Windows)
✅ Ou: python start-hospital.py (Qualquer sistema)
✅ Ou instale: https://nodejs.org/
```

### **❌ Porta ocupada?**
```
✅ Backend: Mude porta no backend/server.js (linha ~40)
✅ Frontend: Mude porta no frontend/package.json
✅ Ou mate processos: taskkill /f /im node.exe (Windows)
```

### **❌ Dependências corrompidas?**
```
✅ Execute: npm run clean
✅ Depois: npm run setup
✅ Ou delete: backend/node_modules e frontend/node_modules
```

### **❌ Python não encontrado?**
```
✅ Instale Python: https://python.org/
✅ Ou use scripts .bat no Windows
```

### **❌ Erro de rede/firewall?**
```
✅ Verifique antivírus/firewall
✅ Tente executar como administrador
✅ Libere portas 3000 e 5000
```

## 📖 **Documentação Completa**

Veja o arquivo **README.md** para documentação completa.

---
🏥 **Santa Casa de Misericórdia de Tupã** - v2.1.0