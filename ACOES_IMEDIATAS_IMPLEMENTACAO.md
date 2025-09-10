# 🚀 AÇÕES IMEDIATAS - IMPLEMENTAÇÃO DO FLUXO HOSPITALAR

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Etapa 1: Preparação do Ambiente (Semana 1)

#### Backend - Estruturas de Dados
- [ ] Criar `backend/src/data/centro-cirurgico-recepcao.json`
- [ ] Criar `backend/src/data/assistencia-intra-operatoria.json`  
- [ ] Criar `backend/src/data/recuperacao-anestesica.json`
- [ ] Criar `backend/src/data/controle-infeccao-hospitalar.json`
- [ ] Criar `backend/src/data/custeio-cirurgico.json`

#### Backend - Controladores
- [ ] Criar `backend/src/controllers/centroCircurgicoRecepcaoController.js`
- [ ] Criar `backend/src/controllers/assistenciaIntraOperatoriaController.js`
- [ ] Criar `backend/src/controllers/recuperacaoAnestesicaController.js`
- [ ] Criar `backend/src/controllers/controleInfeccaoController.js`
- [ ] Criar `backend/src/controllers/custeioController.js`

#### Backend - Rotas
- [ ] Criar `backend/src/routes/centroCircurgicoRecepcao.js`
- [ ] Criar `backend/src/routes/assistenciaIntraOperatoria.js`
- [ ] Criar `backend/src/routes/recuperacaoAnestesica.js`
- [ ] Criar `backend/src/routes/controleInfeccao.js`
- [ ] Criar `backend/src/routes/custeio.js`

### Etapa 2: Frontend - Páginas Principais (Semana 2)

#### Páginas
- [ ] Criar `frontend/src/pages/centro-cirurgico/RecepcaoCentroCircurgico.tsx`
- [ ] Criar `frontend/src/pages/centro-cirurgico/AssistenciaIntraOperatoria.tsx`
- [ ] Criar `frontend/src/pages/centro-cirurgico/RecuperacaoAnestesica.tsx`
- [ ] Criar `frontend/src/pages/centro-cirurgico/ControleInfeccaoHospitalar.tsx`
- [ ] Criar `frontend/src/pages/centro-cirurgico/CusteioCircurgico.tsx`

#### Componentes Especializados
- [ ] Criar `frontend/src/components/escalas-medicas/EscalaSedacaoRamsay.tsx`
- [ ] Criar `frontend/src/components/escalas-medicas/IndiceAldreteKroulik.tsx`
- [ ] Criar `frontend/src/components/monitorização/SinaisVitaisMonitor.tsx`
- [ ] Criar `frontend/src/components/materiais/ListaMateraisCirurgicos.tsx`

### Etapa 3: Integração com Sistema Atual (Semana 3)

#### Atualizações no Sistema Existente
- [ ] Atualizar `frontend/src/components/Navbar.tsx` (adicionar novos menus)
- [ ] Atualizar `backend/server.js` (adicionar novas rotas)
- [ ] Criar `frontend/src/types/centro-cirurgico.ts` (tipos TypeScript)
- [ ] Atualizar `frontend/src/services/api.ts` (novos endpoints)

## 🔧 COMANDOS PARA EXECUTAR

### Configuração Inicial
```bash
# Navegar para o projeto
cd c:\Workspace\gestao-hospitalar

# Instalar dependências adicionais (se necessário)
cd backend
npm install uuid joi winston multer

cd ../frontend  
npm install react-hook-form yup react-query chart.js date-fns
```

### Estrutura de Diretórios
```bash
# Criar diretórios no backend
mkdir backend\src\data\centro-cirurgico
mkdir backend\src\controllers\centro-cirurgico
mkdir backend\src\routes\centro-cirurgico

# Criar diretórios no frontend
mkdir frontend\src\pages\centro-cirurgico
mkdir frontend\src\components\escalas-medicas
mkdir frontend\src\components\monitorização
mkdir frontend\src\components\materiais
mkdir frontend\src\types\centro-cirurgico
```

## 📋 TEMPLATES INICIAIS

### Modelo de Controlador
```javascript
// backend/src/controllers/centroCircurgicoRecepcaoController.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/centro-cirurgico-recepcao.json');

const recepcaoController = {
  listar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json(data.recepcoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao carregar dados' });
    }
  },

  criar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const novaRecepcao = {
        id: uuidv4(),
        ...req.body,
        dataHora: new Date().toISOString(),
        status: 'ativo'
      };
      
      data.recepcoes.push(novaRecepcao);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.status(201).json(novaRecepcao);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar recepção' });
    }
  }
};

module.exports = recepcaoController;
```

### Modelo de Página React
```tsx
// frontend/src/pages/centro-cirurgico/RecepcaoCentroCircurgico.tsx
import React, { useState } from 'react';

interface RecepcaoData {
  numeroInternacao: string;
  nome: string;
  reservaUti: boolean;
  reservaHemoderivados: {
    necessita: boolean;
    tipo: string[];
  };
  tipoSanguineo: string;
  alergias: {
    possui: boolean;
    descricao: string;
  };
}

const RecepcaoCentroCircurgico: React.FC = () => {
  const [formData, setFormData] = useState<RecepcaoData>({
    numeroInternacao: '',
    nome: '',
    reservaUti: false,
    reservaHemoderivados: { necessita: false, tipo: [] },
    tipoSanguineo: '',
    alergias: { possui: false, descricao: '' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envio
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Recepção - Centro Cirúrgico
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos do formulário */}
      </form>
    </div>
  );
};

export default RecepcaoCentroCircurgico;
```

## 🎯 PRIORIDADES DE IMPLEMENTAÇÃO

### ALTA PRIORIDADE (Semana 1-2)
1. **Recepção Centro Cirúrgico** - Base para todo o fluxo
2. **Estruturas de dados** - Fundação do sistema
3. **API básica** - Comunicação frontend/backend

### MÉDIA PRIORIDADE (Semana 3-4)  
1. **Assistência Intra-Operatória** - Registro do procedimento
2. **Escalas médicas básicas** - Ramsay e Aldrete
3. **Interface responsiva** - Usabilidade mobile

### BAIXA PRIORIDADE (Semana 5-8)
1. **Relatórios avançados** - Dashboards e gráficos
2. **Controle de custeio** - Análise financeira
3. **Integrações externas** - Sistemas terceiros

## ⚠️ PONTOS DE ATENÇÃO

### Segurança
- Validar todos os dados de entrada
- Implementar logs de auditoria desde o início
- Proteger dados sensíveis (LGPD compliance)

### Performance
- Otimizar consultas de dados grandes
- Implementar cache para listas estáticas
- Considerar paginação em listagens

### Usabilidade
- Testar em dispositivos móveis/tablets
- Validações em tempo real
- Feedback visual para usuário

## 📞 PRÓXIMOS PASSOS

1. **Aprovação técnica** deste plano
2. **Setup do ambiente** de desenvolvimento
3. **Início da implementação** do módulo de recepção
4. **Testes iniciais** com dados mockados
5. **Feedback da equipe** médica e de enfermagem

---

**Status**: 🟡 Aguardando aprovação para início  
**Prazo estimado**: 16 semanas (4 meses)  
**Próxima revisão**: 16/09/2025
