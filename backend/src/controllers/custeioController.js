const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/custeio-cirurgico.json');

const custeioController = {
  listar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({
        success: true,
        data: data.custeios,
        total: data.custeios.length
      });
    } catch (error) {
      console.error('Erro ao listar custeios:', error);
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
      const custeio = data.custeios.find(c => c.id === id);
      
      if (!custeio) {
        return res.status(404).json({ 
          success: false, 
          error: 'Custeio não encontrado' 
        });
      }
      
      res.json({
        success: true,
        data: custeio
      });
    } catch (error) {
      console.error('Erro ao obter custeio:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  criar: (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Calcular totais automaticamente
      const materiaisUtilizados = req.body.materiaisUtilizados || [];
      const somaTotal = materiaisUtilizados.reduce((acc, material) => {
        const custoTotal = material.quantidade * material.valorCusto;
        const vendaTotal = material.quantidade * material.valorVenda;
        return {
          custo: acc.custo + custoTotal,
          venda: acc.venda + vendaTotal
        };
      }, { custo: 0, venda: 0 });
      
      const novoCusteio = {
        id: uuidv4(),
        ...req.body,
        somaTotal,
        dataRegistro: new Date().toISOString()
      };

      // Validações
      if (!novoCusteio.numeroInternacao || !novoCusteio.tipoCirurgia) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios não informados'
        });
      }
      
      data.custeios.push(novoCusteio);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.status(201).json({
        success: true,
        data: novoCusteio,
        message: 'Custeio cirúrgico registrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar custeio:', error);
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
      const index = data.custeios.findIndex(c => c.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Custeio não encontrado' 
        });
      }

      // Recalcular totais se materiais foram alterados
      const materiaisUtilizados = req.body.materiaisUtilizados || data.custeios[index].materiaisUtilizados;
      const somaTotal = materiaisUtilizados.reduce((acc, material) => {
        const custoTotal = material.quantidade * material.valorCusto;
        const vendaTotal = material.quantidade * material.valorVenda;
        return {
          custo: acc.custo + custoTotal,
          venda: acc.venda + vendaTotal
        };
      }, { custo: 0, venda: 0 });
      
      data.custeios[index] = {
        ...data.custeios[index],
        ...req.body,
        somaTotal,
        id: id,
        dataAtualizacao: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: data.custeios[index],
        message: 'Custeio atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar custeio:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  adicionarMaterial: (req, res) => {
    try {
      const { id } = req.params;
      const { material } = req.body;
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.custeios.findIndex(c => c.id === id);
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Custeio não encontrado' 
        });
      }
      
      if (!data.custeios[index].materiaisUtilizados) {
        data.custeios[index].materiaisUtilizados = [];
      }
      
      data.custeios[index].materiaisUtilizados.push(material);
      
      // Recalcular totais
      const somaTotal = data.custeios[index].materiaisUtilizados.reduce((acc, mat) => {
        const custoTotal = mat.quantidade * mat.valorCusto;
        const vendaTotal = mat.quantidade * mat.valorVenda;
        return {
          custo: acc.custo + custoTotal,
          venda: acc.venda + vendaTotal
        };
      }, { custo: 0, venda: 0 });
      
      data.custeios[index].somaTotal = somaTotal;
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      res.json({
        success: true,
        data: data.custeios[index],
        message: 'Material adicionado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  relatorioFinanceiro: (req, res) => {
    try {
      const { dataInicio, dataFim, tipoCirurgia } = req.query;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      let custeios = data.custeios;
      
      // Filtros
      if (dataInicio && dataFim) {
        custeios = custeios.filter(c => {
          const dataCusteio = new Date(c.data);
          return dataCusteio >= new Date(dataInicio) && dataCusteio <= new Date(dataFim);
        });
      }
      
      if (tipoCirurgia) {
        custeios = custeios.filter(c => 
          c.tipoCirurgia.toLowerCase().includes(tipoCirurgia.toLowerCase())
        );
      }

      // Cálculos financeiros
      const totalCustos = custeios.reduce((sum, c) => sum + c.somaTotal.custo, 0);
      const totalVendas = custeios.reduce((sum, c) => sum + c.somaTotal.venda, 0);
      const margem = totalVendas - totalCustos;
      const percentualMargem = totalCustos > 0 ? ((margem / totalVendas) * 100).toFixed(2) : 0;

      // Análise por tipo de cirurgia
      const analisePortipo = {};
      custeios.forEach(custeio => {
        if (!analisePortipo[custeio.tipoCirurgia]) {
          analisePortipo[custeio.tipoCirurgia] = {
            quantidade: 0,
            custoTotal: 0,
            vendaTotal: 0,
            tempoTotal: 0
          };
        }
        
        analisePortipo[custeio.tipoCirurgia].quantidade++;
        analisePortipo[custeio.tipoCirurgia].custoTotal += custeio.somaTotal.custo;
        analisePortipo[custeio.tipoCirurgia].vendaTotal += custeio.somaTotal.venda;
        analisePortipo[custeio.tipoCirurgia].tempoTotal += custeio.horarios.total || 0;
      });

      // Materiais mais utilizados
      const materiaisFrequencia = {};
      custeios.forEach(custeio => {
        custeio.materiaisUtilizados?.forEach(material => {
          if (!materiaisFrequencia[material.material]) {
            materiaisFrequencia[material.material] = {
              quantidadeTotal: 0,
              custoTotal: 0,
              vezesUtilizado: 0
            };
          }
          
          materiaisFrequencia[material.material].quantidadeTotal += material.quantidade;
          materiaisFrequencia[material.material].custoTotal += (material.quantidade * material.valorCusto);
          materiaisFrequencia[material.material].vezesUtilizado++;
        });
      });

      res.json({
        success: true,
        data: {
          resumoFinanceiro: {
            totalCirurgias: custeios.length,
            totalCustos: totalCustos.toFixed(2),
            totalVendas: totalVendas.toFixed(2),
            margem: margem.toFixed(2),
            percentualMargem
          },
          analisePortipo,
          materiaisFrequencia,
          custeios
        },
        periodo: { dataInicio, dataFim },
        filtros: { tipoCirurgia }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório financeiro:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  materiaisDisponiveis: (req, res) => {
    try {
      // Lista de materiais padrão do hospital
      const materiaisPadrao = [
        { nome: "Kit Laparoscopia", valorCusto: 280.50, valorVenda: 420.75, unidade: "un" },
        { nome: "Fio Vicryl 2-0", valorCusto: 35.80, valorVenda: 53.70, unidade: "un" },
        { nome: "Fio Vicryl 3-0", valorCusto: 32.50, valorVenda: 48.75, unidade: "un" },
        { nome: "Clipe Metálico", valorCusto: 45.20, valorVenda: 67.80, unidade: "un" },
        { nome: "Compressa Cirúrgica", valorCusto: 8.50, valorVenda: 12.75, unidade: "un" },
        { nome: "Lâmina Bisturi Nº 15", valorCusto: 2.30, valorVenda: 3.45, unidade: "un" },
        { nome: "Lâmina Bisturi Nº 11", valorCusto: 2.30, valorVenda: 3.45, unidade: "un" },
        { nome: "Soro Fisiológico 0,9%", valorCusto: 0.02, valorVenda: 0.03, unidade: "ml" },
        { nome: "Dreno Penrose", valorCusto: 12.80, valorVenda: 19.20, unidade: "un" },
        { nome: "Propofol 200mg", valorCusto: 18.70, valorVenda: 28.05, unidade: "ampola" },
        { nome: "Fentanil 0,5mg", valorCusto: 8.90, valorVenda: 13.35, unidade: "ampola" },
        { nome: "Tracrium 25mg", valorCusto: 22.40, valorVenda: 33.60, unidade: "ampola" },
        { nome: "Midazolam 15mg", valorCusto: 15.60, valorVenda: 23.40, unidade: "ampola" },
        { nome: "Atropina 0,25mg", valorCusto: 3.20, valorVenda: 4.80, unidade: "ampola" },
        { nome: "Cefazolina 1g", valorCusto: 8.90, valorVenda: 13.35, unidade: "frasco" }
      ];

      res.json({
        success: true,
        data: materiaisPadrao,
        total: materiaisPadrao.length
      });
    } catch (error) {
      console.error('Erro ao listar materiais disponíveis:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

module.exports = custeioController;
