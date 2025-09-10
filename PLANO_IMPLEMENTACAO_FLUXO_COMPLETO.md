# PLANO DE IMPLEMENTAÇÃO - FLUXO COMPLETO HOSPITALAR
## Sistema de Gerenciamento Hospitalar - Santa Casa de Misericórdia de Tupã

---

## 📋 RESUMO EXECUTIVO

Este plano detalha a implementação de um sistema completo baseado no fluxo operacional da Santa Casa de Misericórdia de Tupã, incorporando todos os formulários, escalas e controles presentes no documento de referência.

---

## 🏗️ ARQUITETURA DO SISTEMA

### Módulos Principais a serem Implementados:

1. **Módulo de Recepção Centro Cirúrgico**
2. **Módulo de Assistência Intra-Operatória**  
3. **Módulo de Recuperação Anestésica**
4. **Módulo de Controle de Esterilização**
5. **Módulo de Controle de Infecção Hospitalar (CCIH)**
6. **Módulo de Custeio Cirúrgico**
7. **Módulo de Escalas Médicas**
8. **Sistema de Monitorização**

---

## 📊 FASE 1: ESTRUTURA DE DADOS E BACKEND

### 1.1 Novas Entidades de Dados

#### Arquivo: `backend/src/data/centro-cirurgico-recepcao.json`
```json
{
  "recepcoes": [
    {
      "id": "uuid",
      "numeroInternacao": "string",
      "nome": "string", 
      "reservaUti": boolean,
      "reservaHemoderivados": {
        "necessita": boolean,
        "tipo": ["plasma", "concentrado_hemacias"]
      },
      "tipoSanguineo": "string",
      "medicacaoPreAnestesica": {
        "administrada": boolean,
        "medicamento": "string"
      },
      "alergias": {
        "possui": boolean,
        "descricao": "string"
      },
      "patologiasBase": "string",
      "medicacoesUso": "string",
      "anotacoesEnfermagem": "string",
      "responsavel": {
        "assinatura": "string",
        "coren": "string"
      },
      "dataHora": "datetime",
      "status": "ativo|concluido|cancelado"
    }
  ]
}
```

#### Arquivo: `backend/src/data/assistencia-intra-operatoria.json`
```json
{
  "assistencias": [
    {
      "id": "uuid",
      "numeroInternacao": "string",
      "cirurgiaProposta": "string",
      "so": "string",
      "horarios": {
        "entrada": "time",
        "inicio": "time",
        "fim": "time"
      },
      "sinaisVitais": {
        "pressaoArterial": "string",
        "frequenciaCardiaca": "number",
        "saturacaoO2": "number"
      },
      "equipe": {
        "primeiroAssistente": "string",
        "equipeCompleta": "array",
        "anestesiologista": "string",
        "circulantesSala": "array",
        "instrumentador": "string",
        "enfermeiro": "string"
      },
      "anestesia": {
        "tipo": "string",
        "canulaNasofaringea": boolean,
        "manobraValsalva": boolean,
        "sondaEndotraqueal": "string",
        "cateterNasal": boolean,
        "agulhaRaquianestesia": "string",
        "agulhaPeridural": "string"
      },
      "anestesicosAdministrados": {
        "xylocaina2SV": "number",
        "xylocaina2CV": "number", 
        "levobupivacaina": "number",
        "ropivacaina75": "number",
        "ropivacaina2": "number",
        "neocainaPesada": "number",
        "neocainaIsobarica": "number",
        "neotutocaina": "number",
        "isoflurano": "number",
        "sevoflurano": "number",
        "etomidato": "number"
      },
      "medicamentosAdministrados": "object",
      "posicionamentoCirurgico": {
        "tipo": "litotomia|dld|ddh|dle|dv|ginecologica",
        "usoCoxim": boolean,
        "outros": "string"
      },
      "garrotePneumatico": {
        "utilizado": boolean,
        "local": "string",
        "inicioHora": "time",
        "retiradaHora": "time"
      },
      "mantaTermica": {
        "utilizada": boolean,
        "tempo": "number"
      },
      "equipamentosSeguranca": {
        "travesseiros": boolean,
        "faixaSeguranca": boolean
      },
      "controleEsterilizacao": "array",
      "saidaHorario": "time",
      "setorDestino": "string",
      "responsavelSaida": {
        "assinatura": "string",
        "carimbo": "string"
      }
    }
  ]
}
```

#### Arquivo: `backend/src/data/recuperacao-anestesica.json`
```json
{
  "recuperacoes": [
    {
      "id": "uuid",
      "numeroInternacao": "string",
      "nome": "string",
      "idade": "number",
      "quartoLeito": "string",
      "cirurgiaRealizada": "string",
      "diagnosticoBase": "string",
      "tipoAnestesia": {
        "geralVenosa": boolean,
        "geralInalatoria": boolean,
        "geralCombinada": boolean,
        "peridural": boolean,
        "periduralCateter": boolean,
        "raqui": boolean,
        "bloqueio": boolean,
        "sedacao": boolean
      },
      "alergias": {
        "possui": boolean,
        "descricao": "string"
      },
      "anestesiologista": "string",
      "nebulizacao": boolean,
      "monitorizacao": {
        "multiparametrico": boolean,
        "ecg": boolean,
        "oximetroPulso": boolean,
        "pa": boolean,
        "pvc": boolean,
        "paInvasiva": boolean,
        "localPaInvasiva": "string"
      },
      "sinaisVitaisHorarios": [
        {
          "hora": "time",
          "pa": "string",
          "fc": "number",
          "fr": "number",
          "so2": "number",
          "temperatura": "number"
        }
      ],
      "escalaSedacaoRamsay": [
        {
          "horario": "time",
          "valor": "1|2|3|4|5|6"
        }
      ],
      "escalaPupilas": {
        "tamanho": "1-9",
        "tipo": "mioticas|midriaticias",
        "simetria": "isocoricas|anisocoricas",
        "fotorreacao": "fotorreagente|nao_fotorreagente"
      },
      "escalaDor": "0-10",
      "medicamentosMinistrados": [
        {
          "medicamento": "string",
          "hora": "time",
          "quantidade": "string"
        }
      ],
      "liquidosEliminados": [
        {
          "tipo": "sangue|urina|suco_gastrico|miccao_espontanea",
          "hora": "time", 
          "quantidade": "number"
        }
      ],
      "indiceAldreteKroulik": {
        "movimentacao": "0|1|2",
        "respiracao": "0|1|2", 
        "pressaoArterial": "0|1|2",
        "consciencia": "0|1|2",
        "saturacaoO2": "0|1|2",
        "total": "number"
      },
      "prescricaoMedica": {
        "altaHorario": "time",
        "medico": "string",
        "crm": "string"
      },
      "transferencia": {
        "destino": "string",
        "tecnicoEnfermagem": "string",
        "enfermeiro": "string"
      }
    }
  ]
}
```

#### Arquivo: `backend/src/data/controle-infeccao-hospitalar.json`
```json
{
  "controles": [
    {
      "id": "uuid",
      "dataCirurgia": "date",
      "nome": "string",
      "idade": "number",
      "classificacao": "sus|particular|scs|pacote|cassi",
      "sexo": "m|f",
      "unidadeInternacao": "string",
      "numeroInternacao": "string",
      "admissao": {
        "data": "date",
        "horario": "time"
      },
      "antecedentes": {
        "tabagista": boolean,
        "diabetico": boolean,
        "renalCronico": boolean,
        "obeso": boolean,
        "hipertenso": boolean
      },
      "tempoInternacao": {
        "unidade": "number",
        "uti": "number",
        "infeccaoPrevia": boolean
      },
      "preOperatorio": {
        "tricotomiaHoras": "number",
        "local": "string",
        "preparoSala": boolean,
        "antissepticos": {
          "clorexidinaDegermante": boolean,
          "pvpiDegermante": boolean,
          "clorexidinaAlcoolica": boolean,
          "pvpiTintura": boolean,
          "clorexidinaAquosa": boolean,
          "pvpiTopico": boolean
        }
      },
      "sondagens": {
        "vesicalDemora": boolean,
        "nasogastrica": boolean,
        "vesicalAlivio": boolean,
        "responsavel": "string"
      },
      "antibioticoProfilatico": "string",
      "transfusoes": {
        "sangue": boolean,
        "plasma": boolean,
        "quantidade": "string"
      },
      "cirurgia": {
        "periodo": "m|t|n",
        "reoperacao": boolean,
        "duracao": "number",
        "asa": "string",
        "cpc": "string",
        "realizada": "string",
        "cirurgiao": "string",
        "auxiliar": "string",
        "anestesia": "string",
        "anestesiologista": "string",
        "circulantes": "array"
      },
      "proteses": boolean,
      "drenos": {
        "succao": boolean,
        "penrose": boolean,
        "torax": boolean,
        "kheer": boolean,
        "outros": "string",
        "local": "string"
      },
      "intercorrencias": "string"
    }
  ]
}
```

#### Arquivo: `backend/src/data/custeio-cirurgico.json`
```json
{
  "custeios": [
    {
      "id": "uuid",
      "numeroInternacao": "string",
      "nomePaciente": "string",
      "idade": "number",
      "quarto": "string",
      "tipoCirurgia": "string",
      "horarios": {
        "inicio": "time",
        "fim": "time",
        "total": "number"
      },
      "equipe": {
        "cirurgiao": "string",
        "assistentes": "array",
        "instrumentadoras": "array",
        "anestesista": "string",
        "circulante": "string"
      },
      "porte": "0|1|2|3",
      "classificacao": "string",
      "data": "date",
      "materiaisUtilizados": [
        {
          "quantidade": "number",
          "material": "string",
          "valorCusto": "number",
          "valorVenda": "number"
        }
      ],
      "somaTotal": {
        "custo": "number",
        "venda": "number"
      },
      "assinaturas": {
        "cirurgiao": "string",
        "responsavel": "string"
      }
    }
  ]
}
```

### 1.2 Novos Controladores Backend

#### Arquivo: `backend/src/controllers/centroCircurgicoRecepcaoController.js`
```javascript
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/centro-cirurgico-recepcao.json');

// Implementar CRUD completo
const recepcaoController = {
  listarRecepcoes: (req, res) => {},
  criarRecepcao: (req, res) => {},
  obterRecepcao: (req, res) => {},
  atualizarRecepcao: (req, res) => {},
  excluirRecepcao: (req, res) => {}
};

module.exports = recepcaoController;
```

#### Arquivos similares para cada novo módulo:
- `assistenciaIntraOperatoriaController.js`
- `recuperacaoAnestesicaController.js`
- `controleInfeccaoController.js`
- `custeioController.js`

### 1.3 Novas Rotas

#### Arquivo: `backend/src/routes/centroCircurgicoRecepcao.js`
```javascript
const express = require('express');
const router = express.Router();
const recepcaoController = require('../controllers/centroCircurgicoRecepcaoController');

router.get('/', recepcaoController.listarRecepcoes);
router.post('/', recepcaoController.criarRecepcao);
router.get('/:id', recepcaoController.obterRecepcao);
router.put('/:id', recepcaoController.atualizarRecepcao);
router.delete('/:id', recepcaoController.excluirRecepcao);

module.exports = router;
```

---

## 🎨 FASE 2: FRONTEND - PÁGINAS E COMPONENTES

### 2.1 Estrutura de Páginas

#### Página: `frontend/src/pages/CentroCircurgicoRecepcao.tsx`
```typescript
interface RecepcaoData {
  numeroInternacao: string;
  nome: string;
  reservaUti: boolean;
  reservaHemoderivados: {
    necessita: boolean;
    tipo: string[];
  };
  tipoSanguineo: string;
  medicacaoPreAnestesica: {
    administrada: boolean;
    medicamento: string;
  };
  alergias: {
    possui: boolean;
    descricao: string;
  };
  patologiasBase: string;
  medicacoesUso: string;
  anotacoesEnfermagem: string;
}

const CentroCircurgicoRecepcao: React.FC = () => {
  // Implementação completa do formulário
};
```

#### Página: `frontend/src/pages/AssistenciaIntraOperatoria.tsx`
- Formulário completo para registro intra-operatório
- Seções organizadas: Equipe, Anestesia, Medicamentos, Posicionamento
- Controles de tempo (entrada, início, fim)

#### Página: `frontend/src/pages/RecuperacaoAnestesica.tsx`  
- Monitorização contínua
- Escalas de avaliação (Ramsay, Aldrete-Kroulik)
- Controle de sinais vitais por horário

#### Página: `frontend/src/pages/ControleInfeccaoHospitalar.tsx`
- Formulário CCIH completo
- Fatores de risco
- Controles de profilaxia

#### Página: `frontend/src/pages/CusteioCircurgico.tsx`
- Lista de materiais cirúrgicos
- Cálculos automáticos de custo/venda
- Relatórios de consumo por cirurgia

### 2.2 Componentes Especializados

#### Componente: `frontend/src/components/EscalaSedacaoRamsay.tsx`
```typescript
interface EscalaSedacaoProps {
  valor: number;
  horario: string;
  onChange: (valor: number, horario: string) => void;
}

const EscalaSedacaoRamsay: React.FC<EscalaSedacaoProps> = ({
  valor,
  horario,
  onChange
}) => {
  const escalas = [
    { valor: 1, descricao: "Acordado / Ansioso / Agitado" },
    { valor: 2, descricao: "Cooperativo / Orientado" },
    { valor: 3, descricao: "Responde a comando" },
    { valor: 4, descricao: "Adormecido / Resp. Ráp. a Estímulo" },
    { valor: 5, descricao: "Respiração lenta a estímulo" },
    { valor: 6, descricao: "Não responde" }
  ];

  return (
    // Interface para seleção da escala
  );
};
```

#### Componente: `frontend/src/components/IndiceAldreteKroulik.tsx`
- Interface para avaliação de alta da recuperação
- Cálculo automático do índice (0-10)
- Validação para alta (≥8 pontos)

#### Componente: `frontend/src/components/SinaisVitaisMonitor.tsx`
- Entrada de dados por horário
- Gráficos de tendência
- Alertas para valores anômalos

#### Componente: `frontend/src/components/ListaMateraisCirurgicos.tsx`
- Catálogo completo de materiais
- Busca e filtros
- Cálculo automático de custos

### 2.3 Formulários Especializados

#### Componente: `frontend/src/components/forms/FormularioAnestesia.tsx`
- Seleção de tipos de anestesia
- Controle de medicamentos anestésicos
- Registro de equipamentos utilizados

#### Componente: `frontend/src/components/forms/FormularioEquipeCirurgica.tsx`
- Seleção de profissionais por função
- Validação de habilitações (CRM, COREN)
- Horários de entrada/saída

---

## 📱 FASE 3: INTERFACE MOBILE E RESPONSIVA

### 3.1 Adaptações Mobile
- Formulários em etapas (wizard)
- Navegação por abas
- Entrada de dados otimizada para touch
- Modo offline para situações críticas

### 3.2 PWA (Progressive Web App)
- Service Workers para cache
- Instalação no dispositivo
- Notificações push
- Sincronização em background

---

## 📊 FASE 4: RELATÓRIOS E DASHBOARDS

### 4.1 Dashboard Centro Cirúrgico
- Ocupação das salas
- Cirurgias em andamento
- Tempo médio por procedimento
- Consumo de materiais em tempo real

### 4.2 Relatórios Especializados
- Relatório CCIH (mensal)
- Análise de custos por cirurgia
- Consumo de anestésicos por período
- Indicadores de recuperação pós-anestésica

### 4.3 Gráficos e Métricas
- Tempo de permanência na recuperação
- Taxa de complicações por tipo de cirurgia
- Eficiência da equipe cirúrgica
- Análise de custos vs. receita

---

## 🔐 FASE 5: SEGURANÇA E CONTROLE DE ACESSO

### 5.1 Autenticação e Autorização
- Login por função (médico, enfermeiro, administrativo)
- Controle de acesso granular por módulo
- Assinatura digital de formulários
- Auditoria de alterações

### 5.2 Conformidade Regulatória
- Logs de acesso detalhados
- Backup automático de dados críticos
- Criptografia de dados sensíveis
- Compliance com LGPD e normas hospitalares

---

## 🚀 FASE 6: INTEGRAÇÃO E INTEROPERABILIDADE

### 6.1 Integração com Equipamentos
- Monitor multiparamétrico
- Equipamentos de anestesia
- Sistemas de vídeo cirúrgico
- Bombas de infusão

### 6.2 Integração com Sistemas Hospitalares
- Sistema de Prontuário Eletrônico
- Sistema de Laboratório
- Sistema de Farmácia Hospitalar
- Sistema de Faturamento

---

## 📋 CRONOGRAMA DE IMPLEMENTAÇÃO

### Sprint 1 (Semanas 1-2): Backend Básico
- [ ] Criar estruturas de dados JSON
- [ ] Implementar controladores básicos
- [ ] Configurar rotas da API
- [ ] Testes unitários básicos

### Sprint 2 (Semanas 3-4): Recepção Centro Cirúrgico
- [ ] Página de recepção completa
- [ ] Validações de formulário
- [ ] Integração com backend
- [ ] Testes de integração

### Sprint 3 (Semanas 5-6): Assistência Intra-Operatória  
- [ ] Formulário completo de assistência
- [ ] Controle de equipe e medicamentos
- [ ] Posicionamento e equipamentos
- [ ] Validações especializadas

### Sprint 4 (Semanas 7-8): Recuperação Anestésica
- [ ] Monitorização de sinais vitais
- [ ] Escalas de avaliação
- [ ] Índice Aldrete-Kroulik
- [ ] Controle de alta

### Sprint 5 (Semanas 9-10): Controle de Infecção
- [ ] Formulário CCIH
- [ ] Fatores de risco
- [ ] Profilaxia cirúrgica
- [ ] Relatórios de controle

### Sprint 6 (Semanas 11-12): Custeio e Relatórios
- [ ] Sistema de custeio cirúrgico
- [ ] Catálogo de materiais
- [ ] Cálculos automáticos
- [ ] Relatórios gerenciais

### Sprint 7 (Semanas 13-14): Interface Mobile
- [ ] Responsividade completa
- [ ] Componentes mobile-first
- [ ] PWA básica
- [ ] Testes em dispositivos

### Sprint 8 (Semanas 15-16): Finalização
- [ ] Integração completa
- [ ] Testes end-to-end
- [ ] Documentação final
- [ ] Deploy e treinamento

---

## 🛠️ FERRAMENTAS E TECNOLOGIAS ADICIONAIS

### Frontend Adicional
- **React Hook Form**: Gerenciamento eficiente de formulários
- **React Query**: Cache e sincronização de dados
- **Chart.js**: Gráficos e dashboards
- **React-PDF**: Geração de relatórios PDF
- **Date-fns**: Manipulação de datas
- **Yup**: Validação de schemas

### Backend Adicional  
- **UUID**: Identificadores únicos
- **Joi**: Validação de dados
- **Winston**: Sistema de logs
- **Node-cron**: Tarefas agendadas
- **Multer**: Upload de arquivos
- **JWT**: Autenticação

### DevOps
- **Docker**: Containerização
- **Docker Compose**: Orquestração local
- **GitHub Actions**: CI/CD
- **Nginx**: Proxy reverso
- **PM2**: Gerenciamento de processos Node.js

---

## 📈 MÉTRICAS DE SUCESSO

### Métricas Técnicas
- Tempo de resposta < 2 segundos
- Uptime > 99.5%
- Taxa de erro < 0.1%
- Cobertura de testes > 80%

### Métricas de Negócio
- Redução de 50% no tempo de preenchimento de formulários
- 95% de precisão nos dados coletados
- 100% de conformidade regulatória
- ROI positivo em 12 meses

### Métricas de Usabilidade
- NPS > 8.0
- Tempo de treinamento < 4 horas
- Taxa de adoção > 90%
- Redução de erros humanos > 60%

---

## 🔄 MANUTENÇÃO E EVOLUÇÃO

### Atualizações Regulares
- Patches de segurança mensais
- Atualizações funcionais trimestrais
- Revisão anual da arquitetura
- Backup e disaster recovery

### Evolução Futura
- Inteligência artificial para predição de riscos
- Análise preditiva de complicações
- Otimização automática de recursos
- Integração com IoT médico

---

## 💰 ESTIMATIVA DE CUSTOS

### Desenvolvimento
- **Sprint 1-4**: 160 horas de desenvolvimento
- **Sprint 5-8**: 160 horas de desenvolvimento
- **Total**: 320 horas de desenvolvimento

### Infraestrutura (Anual)
- **Servidor**: R$ 200/mês
- **Backup**: R$ 50/mês  
- **Monitoramento**: R$ 30/mês
- **Total Anual**: R$ 3.360

### Manutenção (Anual)
- **Correções e melhorias**: 80 horas
- **Suporte técnico**: 40 horas
- **Atualizações**: 20 horas
- **Total**: 140 horas anuais

---

## 📞 SUPORTE E TREINAMENTO

### Documentação
- Manual do usuário completo
- Guia de administrador
- API documentation
- Vídeos tutoriais

### Treinamento
- Treinamento presencial (16h)
- E-learning personalizado
- Suporte técnico 24/7
- Comunidade de usuários

---

**Status do Documento**: ✅ Completo  
**Última Atualização**: 09/09/2025  
**Versão**: 1.0  
**Aprovação**: Pendente

---
