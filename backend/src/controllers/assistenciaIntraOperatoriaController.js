const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/assistencia-intra-operatoria.json');

const assistenciaController = {
  listar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({
        success: true,
        data: data.assistencias,
        total: data.assistencias.length
      });
    } catch (error) {
      console.error('Erro ao listar assist�ncias:', error);
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
      const assistencia = data.assistencias.find(a => a.id === id);
      
      if (!assistencia) {
        return res.status(404).json({ 
          success: false, 
          error: 'Assist�ncia n�o encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: assistencia
      });
    } catch (error) {
      console.error('Erro ao obter assist�ncia:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  criar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const novaAssistencia = {
        id: uuidv4(),
        ...req.body,
        dataHora: new Date().toISOString()
      };

      // Valida��es
      if (!novaAssistencia.numeroInternacao || !novaAssistencia.cirurgiaProposta) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigat�rios n�o informados'
        });
      }
      
      data.assistencias.push(novaAssistencia);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.status(201).json({
        success: true,
        data: novaAssistencia,
        message: 'Assist�ncia intra-operat�ria registrada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar assist�ncia:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  atualizar: (req, res) => {
    try {
      const { id } = req.params;
      console.log('Atualizando assistência ID:', id);
      console.log('Dados recebidos:', req.body);
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.assistencias.findIndex(a => a.id === id);
      
      if (index === -1) {
        console.log('Assistência não encontrada:', id);
        return res.status(404).json({ 
          success: false, 
          error: 'Assistência não encontrada' 
        });
      }
      
      data.assistencias[index] = {
        ...data.assistencias[index],
        ...req.body,
        id: id,
        dataAtualizacao: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      console.log('Assistência atualizada com sucesso');
      
      res.json({
        success: true,
        data: data.assistencias[index],
        message: 'Assistência atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar assistência:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  },

  excluir: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.assistencias.findIndex(a => a.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Assist�ncia n�o encontrada' 
        });
      }
      
      const assistenciaRemovida = data.assistencias.splice(index, 1)[0];
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: assistenciaRemovida,
        message: 'Assist�ncia exclu�da com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir assist�ncia:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  relatorioPorPeriodo: (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      let assistencias = data.assistencias;
      
      if (dataInicio && dataFim) {
        assistencias = assistencias.filter(a => {
          const dataAssist = new Date(a.dataHora);
          return dataAssist >= new Date(dataInicio) && dataAssist <= new Date(dataFim);
        });
      }
      
      res.json({
        success: true,
        data: assistencias,
        total: assistencias.length,
        periodo: { dataInicio, dataFim }
      });
    } catch (error) {
      console.error('Erro ao gerar relat�rio:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

module.exports = assistenciaController;
