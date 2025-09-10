const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/recuperacao-anestesica.json');

const recuperacaoController = {
  listar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({
        success: true,
        data: data.recuperacoes,
        total: data.recuperacoes.length
      });
    } catch (error) {
      console.error('Erro ao listar recuperações:', error);
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
      const recuperacao = data.recuperacoes.find(r => r.id === id);
      
      if (!recuperacao) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recuperação não encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: recuperacao
      });
    } catch (error) {
      console.error('Erro ao obter recuperação:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  criar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const novaRecuperacao = {
        id: uuidv4(),
        ...req.body,
        dataHora: new Date().toISOString()
      };

      // Validações
      if (!novaRecuperacao.numeroInternacao || !novaRecuperacao.nome) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios não informados'
        });
      }
      
      data.recuperacoes.push(novaRecuperacao);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.status(201).json({
        success: true,
        data: novaRecuperacao,
        message: 'Recuperação anestésica registrada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar recuperação:', error);
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
      const index = data.recuperacoes.findIndex(r => r.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recuperação não encontrada' 
        });
      }
      
      data.recuperacoes[index] = {
        ...data.recuperacoes[index],
        ...req.body,
        id: id,
        dataAtualizacao: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: data.recuperacoes[index],
        message: 'Recuperação atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar recuperação:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  adicionarSinaisVitais: (req, res) => {
    try {
      const { id } = req.params;
      const { sinaisVitais } = req.body;
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.recuperacoes.findIndex(r => r.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recuperação não encontrada' 
        });
      }
      
      if (!data.recuperacoes[index].sinaisVitaisHorarios) {
        data.recuperacoes[index].sinaisVitaisHorarios = [];
      }
      
      data.recuperacoes[index].sinaisVitaisHorarios.push({
        ...sinaisVitais,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: data.recuperacoes[index],
        message: 'Sinais vitais adicionados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao adicionar sinais vitais:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  calcularAldreteKroulik: (req, res) => {
    try {
      const { id } = req.params;
      const { criterios } = req.body;
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.recuperacoes.findIndex(r => r.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recuperação não encontrada' 
        });
      }
      
      const total = Object.values(criterios).reduce((sum, valor) => sum + valor, 0);
      const aptoParaAlta = total >= 8;
      
      data.recuperacoes[index].indiceAldreteKroulik = {
        ...criterios,
        total: total,
        aptoParaAlta: aptoParaAlta,
        dataAvaliacao: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: {
          indice: data.recuperacoes[index].indiceAldreteKroulik,
          aptoParaAlta: aptoParaAlta
        },
        message: `Índice Aldrete-Kroulik: ${total}/10. ${aptoParaAlta ? 'Paciente APTO para alta' : 'Paciente NÃO apto para alta'}`
      });
    } catch (error) {
      console.error('Erro ao calcular Aldrete-Kroulik:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  pacientesEmRecuperacao: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const pacientesAtivos = data.recuperacoes.filter(r => 
        !r.prescricaoMedica || !r.prescricaoMedica.altaHorario
      );
      
      res.json({
        success: true,
        data: pacientesAtivos,
        total: pacientesAtivos.length
      });
    } catch (error) {
      console.error('Erro ao listar pacientes em recuperação:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

module.exports = recuperacaoController;
