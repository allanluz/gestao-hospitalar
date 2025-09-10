const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/centro-cirurgico-recepcao.json');

const recepcaoController = {
  listar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({
        success: true,
        data: data.recepcoes,
        total: data.recepcoes.length
      });
    } catch (error) {
      console.error('Erro ao listar recepções:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor',
        message: 'Não foi possível carregar os dados de recepção' 
      });
    }
  },

  obter: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const recepcao = data.recepcoes.find(r => r.id === id);
      
      if (!recepcao) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recepção não encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: recepcao
      });
    } catch (error) {
      console.error('Erro ao obter recepção:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
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

      // Validações básicas
      if (!novaRecepcao.numeroInternacao || !novaRecepcao.nome) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios não informados',
          message: 'Número da internação e nome são obrigatórios'
        });
      }
      
      data.recepcoes.push(novaRecepcao);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.status(201).json({
        success: true,
        data: novaRecepcao,
        message: 'Recepção criada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar recepção:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor',
        message: 'Não foi possível criar a recepção' 
      });
    }
  },

  atualizar: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.recepcoes.findIndex(r => r.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recepção não encontrada' 
        });
      }
      
      data.recepcoes[index] = {
        ...data.recepcoes[index],
        ...req.body,
        id: id, // Mantém o ID original
        dataAtualizacao: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: data.recepcoes[index],
        message: 'Recepção atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar recepção:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  excluir: (req, res) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.recepcoes.findIndex(r => r.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Recepção não encontrada' 
        });
      }
      
      const recepcaoRemovida = data.recepcoes.splice(index, 1)[0];
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: recepcaoRemovida,
        message: 'Recepção excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir recepção:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  buscarPorInternacao: (req, res) => {
    try {
      const { numeroInternacao } = req.params;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const recepcoes = data.recepcoes.filter(r => 
        r.numeroInternacao.includes(numeroInternacao)
      );
      
      res.json({
        success: true,
        data: recepcoes,
        total: recepcoes.length
      });
    } catch (error) {
      console.error('Erro ao buscar por internação:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

module.exports = recepcaoController;
