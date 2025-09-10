const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/controle-infeccao-hospitalar.json');

const controleInfeccaoController = {
  listar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({
        success: true,
        data: data.controles,
        total: data.controles.length
      });
    } catch (error) {
      console.error('Erro ao listar controles CCIH:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  obter: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const controle = data.controles.find(c => c.id === id);
      
      if (!controle) {
        return res.status(404).json({ 
          success: false, 
          error: 'Controle CCIH não encontrado' 
        });
      }
      
      res.json({
        success: true,
        data: controle
      });
    } catch (error) {
      console.error('Erro ao obter controle CCIH:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  criar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const novoControle = {
        id: uuidv4(),
        ...req.body,
        dataRegistro: new Date().toISOString()
      };

      // Validações
      if (!novoControle.numeroInternacao || !novoControle.nome) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios não informados'
        });
      }
      
      data.controles.push(novoControle);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.status(201).json({
        success: true,
        data: novoControle,
        message: 'Controle CCIH registrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar controle CCIH:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  atualizar: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.controles.findIndex(c => c.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Controle CCIH não encontrado' 
        });
      }
      
      data.controles[index] = {
        ...data.controles[index],
        ...req.body,
        id: id,
        dataAtualizacao: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: data.controles[index],
        message: 'Controle CCIH atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar controle CCIH:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  calcularRiscoInfeccao: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const controle = data.controles.find(c => c.id === id);
      
      if (!controle) {
        return res.status(404).json({ 
          success: false, 
          error: 'Controle CCIH não encontrado' 
        });
      }

      let pontuacaoRisco = 0;
      let fatoresRisco = [];

      // Fatores de risco - pontuação
      if (controle.antecedentes?.diabetico) {
        pontuacaoRisco += 2;
        fatoresRisco.push('Diabetes Mellitus');
      }
      
      if (controle.antecedentes?.obeso) {
        pontuacaoRisco += 1;
        fatoresRisco.push('Obesidade');
      }
      
      if (controle.tempoInternacao?.unidade > 168) { // > 7 dias
        pontuacaoRisco += 2;
        fatoresRisco.push('Internação prolongada (>7 dias)');
      }
      
      if (controle.tempoInternacao?.uti > 72) { // > 3 dias
        pontuacaoRisco += 3;
        fatoresRisco.push('UTI prolongada (>3 dias)');
      }
      
      if (controle.cirurgia?.duracao > 180) { // > 3 horas
        pontuacaoRisco += 2;
        fatoresRisco.push('Cirurgia prolongada (>3h)');
      }
      
      if (controle.cirurgia?.reoperacao) {
        pontuacaoRisco += 3;
        fatoresRisco.push('Reoperação');
      }

      // Classificação do risco
      let classificacaoRisco;
      if (pontuacaoRisco <= 2) {
        classificacaoRisco = 'BAIXO';
      } else if (pontuacaoRisco <= 5) {
        classificacaoRisco = 'MODERADO';
      } else {
        classificacaoRisco = 'ALTO';
      }

      res.json({
        success: true,
        data: {
          pontuacaoRisco,
          classificacaoRisco,
          fatoresRisco,
          recomendacoes: gerarRecomendacoes(classificacaoRisco)
        }
      });
    } catch (error) {
      console.error('Erro ao calcular risco de infecção:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  relatorioMensal: (req, res) => {
    try {
      const { mes, ano } = req.query;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      let controles = data.controles;
      
      if (mes && ano) {
        controles = controles.filter(c => {
          const dataCirurgia = new Date(c.dataCirurgia);
          return dataCirurgia.getMonth() + 1 == mes && dataCirurgia.getFullYear() == ano;
        });
      }

      // Estatísticas
      const totalCirurgias = controles.length;
      const comAntibioticoprofilatico = controles.filter(c => c.antibioticoProfilatico).length;
      const reoperacoes = controles.filter(c => c.cirurgia?.reoperacao).length;
      const porteAlto = controles.filter(c => c.porte === '3').length;

      res.json({
        success: true,
        data: {
          controles,
          estatisticas: {
            totalCirurgias,
            comAntibioticoprofilatico,
            percentualProfilaxia: ((comAntibioticoprofilatico / totalCirurgias) * 100).toFixed(2),
            reoperacoes,
            percentualReoperacao: ((reoperacoes / totalCirurgias) * 100).toFixed(2),
            porteAlto,
            percentualPorteAlto: ((porteAlto / totalCirurgias) * 100).toFixed(2)
          }
        },
        periodo: { mes, ano }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório mensal CCIH:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

function gerarRecomendacoes(classificacaoRisco) {
  const recomendacoes = {
    'BAIXO': [
      'Manter cuidados padrão de prevenção',
      'Monitoramento rotineiro pós-operatório',
      'Higienização das mãos rigorosa'
    ],
    'MODERADO': [
      'Intensificar vigilância pós-operatória',
      'Considerar profilaxia antibiótica prolongada',
      'Avaliação diária pelo CCIH',
      'Curativos com técnica estéril'
    ],
    'ALTO': [
      'Vigilância ativa intensiva',
      'Profilaxia antibiótica prolongada obrigatória',
      'Isolamento de contato se necessário',
      'Culturas de vigilância',
      'Revisão diária pelo infectologista'
    ]
  };
  
  return recomendacoes[classificacaoRisco] || [];
}

module.exports = controleInfeccaoController;
