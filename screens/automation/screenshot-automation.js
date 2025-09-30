const { chromium } = require('playwright');
const fs = require('fs-extra');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..');
const VIEWPORT = { width: 1920, height: 1080 };

// Definição das capturas por módulo
const SCREENSHOTS_CONFIG = {
  '01-dashboard': {
    name: 'Dashboard Principal',
    screenshots: [
      { file: 'dashboard-overview.png', url: '/', description: 'Visão geral completa' },
      { file: 'dashboard-sidebar-expanded.png', url: '/', action: 'expand-sidebar', description: 'Menu lateral expandido' },
      { file: 'dashboard-notificacoes.png', url: '/', action: 'open-notifications', description: 'Header com notificações ativas' },
      { file: 'dashboard-stats.png', url: '/', action: 'show-stats', description: 'Cards de estatísticas' }
    ]
  },
  '02-pacientes': {
    name: 'Gestão de Pacientes',
    screenshots: [
      { file: 'pacientes-listagem.png', url: '/pacientes', description: 'Lista completa de pacientes' },
      { file: 'pacientes-busca.png', url: '/pacientes', action: 'search', searchTerm: 'Maria', description: 'Campo de busca em ação' },
      { file: 'pacientes-scroll.png', url: '/pacientes', action: 'scroll-down', description: 'Lista com rolagem para ver mais pacientes' },
      { file: 'pacientes-formulario-novo.png', url: '/pacientes', action: 'new-patient', description: 'Formulário de novo paciente' },
      { file: 'pacientes-detalhes.png', url: '/pacientes', action: 'click-first-item', description: 'Detalhes de um paciente específico' }
    ]
  },
  '03-funcionarios': {
    name: 'Gestão de Funcionários',
    screenshots: [
      { file: 'funcionarios-listagem.png', url: '/funcionarios', description: 'Lista de funcionários' },
      { file: 'funcionarios-busca.png', url: '/funcionarios', action: 'search', searchTerm: 'João', description: 'Sistema de busca ativo' },
      { file: 'funcionarios-scroll.png', url: '/funcionarios', action: 'scroll-down', description: 'Lista com rolagem' },
      { file: 'funcionarios-formulario.png', url: '/funcionarios', action: 'new-employee', description: 'Formulário de cadastro' },
      { file: 'funcionarios-detalhes.png', url: '/funcionarios', action: 'click-first-item', description: 'Detalhes de funcionário' }
    ]
  },
  '04-estoque': {
    name: 'Controle de Estoque',
    screenshots: [
      { file: 'estoque-dashboard.png', url: '/estoque', description: 'Dashboard principal' },
      { file: 'estoque-alertas.png', url: '/estoque', action: 'show-alerts', description: 'Alertas de estoque baixo' },
      { file: 'estoque-movimentacao.png', url: '/estoque', action: 'show-movements', description: 'Histórico de movimentação' },
      { file: 'estoque-relatorios.png', url: '/estoque', action: 'show-reports', description: 'Relatórios de estoque' }
    ]
  },
  '05-uti': {
    name: 'UTI',
    screenshots: [
      { file: 'uti-dashboard.png', url: '/uti', description: 'Visão geral da UTI' },
      { file: 'uti-leitos-ocupados.png', url: '/uti', action: 'filter-occupied', description: 'Status leitos ocupados' },
      { file: 'uti-leitos-disponiveis.png', url: '/uti', action: 'filter-available', description: 'Status leitos disponíveis' },
      { file: 'uti-pacientes-criticos.png', url: '/uti', action: 'filter-critical', description: 'Pacientes em estado crítico' },
      { file: 'uti-equipamentos.png', url: '/uti', action: 'show-equipment', description: 'Status dos equipamentos' }
    ]
  },
  '06-centro-cirurgico': {
    name: 'Centro Cirúrgico',
    screenshots: [
      { file: 'cc-agenda-diaria.png', url: '/centro-cirurgico', description: 'Agenda do dia' },
      { file: 'cc-agenda-semanal.png', url: '/centro-cirurgico', action: 'weekly-view', description: 'Agenda semanal' },
      { file: 'cc-salas-status.png', url: '/centro-cirurgico', action: 'rooms-status', description: 'Status das salas cirúrgicas' },
      { file: 'cc-equipamentos.png', url: '/centro-cirurgico', action: 'equipment-status', description: 'Equipamentos disponíveis' }
    ]
  },
  '07-recepcao-centro-cirurgico': {
    name: 'Recepção CC',
    screenshots: [
      { file: 'recepcao-dashboard.png', url: '/centro-cirurgico-recepcao', description: 'Dashboard com estatísticas' },
      { file: 'recepcao-formulario-entrada.png', url: '/centro-cirurgico-recepcao', action: 'new-entry', description: 'Formulário de entrada' },
      { file: 'recepcao-scroll-registros.png', url: '/centro-cirurgico-recepcao', action: 'scroll-down', description: 'Lista de registros' },
      { file: 'recepcao-busca.png', url: '/centro-cirurgico-recepcao', action: 'search', searchTerm: 'João', description: 'Sistema de busca ativo' },
      { file: 'recepcao-modo-cards.png', url: '/centro-cirurgico-recepcao', action: 'card-view', description: 'Visualização em cards' },
      { file: 'recepcao-modo-tabela.png', url: '/centro-cirurgico-recepcao', action: 'table-view', description: 'Visualização em tabela' },
      { file: 'recepcao-detalhes.png', url: '/centro-cirurgico-recepcao', action: 'click-first-item', description: 'Detalhes de registro' }
    ]
  },
  '08-assistencia-intra-operatoria': {
    name: 'Assistência Intra-Operatória',
    screenshots: [
      { file: 'assistencia-formulario-principal.png', url: '/assistencia-intra-operatoria', description: 'Formulário completo' },
      { file: 'assistencia-formulario-preenchido.png', url: '/assistencia-intra-operatoria', action: 'show-form-filled', description: 'Formulário com dados preenchidos' },
      { file: 'assistencia-scroll-meio.png', url: '/assistencia-intra-operatoria', action: 'scroll-form', description: 'Seção central do formulário' },
      { file: 'assistencia-intercorrencias.png', url: '/assistencia-intra-operatoria', action: 'intercorrencias-tab', description: 'Aba de intercorrências' },
      { file: 'assistencia-scroll-final.png', url: '/assistencia-intra-operatoria', action: 'scroll-down', description: 'Final do formulário' },
      { file: 'assistencia-listagem.png', url: '/assistencia-intra-operatoria', action: 'scroll-down', description: 'Registros salvos' }
    ]
  },
  '09-recuperacao-anestesica': {
    name: 'Recuperação Anestésica',
    screenshots: [
      { file: 'recuperacao-dashboard.png', url: '/recuperacao-anestesica', description: 'Dashboard de recuperação' },
      { file: 'recuperacao-pacientes-ativos.png', url: '/recuperacao-anestesica', action: 'active-patients', description: 'Pacientes em recuperação' },
      { file: 'recuperacao-sinais-vitais.png', url: '/recuperacao-anestesica', action: 'vital-signs', description: 'Monitoramento sinais vitais' },
      { file: 'recuperacao-aldrete-kroulik.png', url: '/recuperacao-anestesica', action: 'aldrete-scale', description: 'Escala de Aldrete-Kroulik' },
      { file: 'recuperacao-formulario-completo.png', url: '/recuperacao-anestesica', action: 'full-form', description: 'Formulário de registro' },
      { file: 'recuperacao-analise-tendencias.png', url: '/recuperacao-anestesica', action: 'trends-analysis', description: 'Análise de tendências' }
    ]
  },
  '10-controle-infeccao': {
    name: 'Controle de Infecção',
    screenshots: [
      { file: 'infeccao-formulario-controle.png', url: '/controle-infeccao', description: 'Formulário principal' },
      { file: 'infeccao-busca-paciente.png', url: '/controle-infeccao', action: 'patient-search', description: 'Sistema de busca de pacientes' },
      { file: 'infeccao-dados-cirurgia.png', url: '/controle-infeccao', action: 'surgery-data', description: 'Integração com dados cirúrgicos' },
      { file: 'infeccao-validacao-dados.png', url: '/controle-infeccao', action: 'data-validation', description: 'Sistema de validação' },
      { file: 'infeccao-listagem-controles.png', url: '/controle-infeccao', action: 'controls-list', description: 'Lista de controles' },
      { file: 'infeccao-relatorio-ccih.png', url: '/controle-infeccao', action: 'ccih-report', description: 'Relatório para CCIH' }
    ]
  },
  '11-custeio-cirurgico': {
    name: 'Custeio Cirúrgico',
    screenshots: [
      { file: 'custeio-formulario-principal.png', url: '/custeio-cirurgico', description: 'Formulário de custeio' },
      { file: 'custeio-formulario-preenchido.png', url: '/custeio-cirurgico', action: 'show-form-filled', description: 'Formulário preenchido' },
      { file: 'custeio-scroll-materiais.png', url: '/custeio-cirurgico', action: 'scroll-form', description: 'Seção de seleção de materiais' },
      { file: 'custeio-filtros-materiais.png', url: '/custeio-cirurgico', action: 'material-filters', description: 'Filtros de materiais aplicados' },
      { file: 'custeio-ordenacao-alfabetica.png', url: '/custeio-cirurgico', action: 'alphabetical-sort', description: 'Ordenação A-Z dos materiais' },
      { file: 'custeio-scroll-final.png', url: '/custeio-cirurgico', action: 'scroll-down', description: 'Final do formulário com totais' },
      { file: 'custeio-listagem-registros.png', url: '/custeio-cirurgico', action: 'scroll-down', description: 'Lista de registros salvos' }
    ]
  },
  '12-gerenciamento-materiais': {
    name: 'Gerenciamento Materiais',
    screenshots: [
      { file: 'materiais-listagem-completa.png', url: '/gerenciamento-materiais', description: 'Lista dos 352 materiais' },
      { file: 'materiais-scroll-meio.png', url: '/gerenciamento-materiais', action: 'scroll-form', description: 'Materiais na seção central da lista' },
      { file: 'materiais-busca-textual.png', url: '/gerenciamento-materiais', action: 'text-search', searchTerm: 'bisturi', description: 'Sistema de busca ativo' },
      { file: 'materiais-scroll-final.png', url: '/gerenciamento-materiais', action: 'scroll-down', description: 'Final da lista de materiais' },
      { file: 'materiais-detalhes-item.png', url: '/gerenciamento-materiais', action: 'click-first-item', description: 'Detalhes de um material' },
      { file: 'materiais-filtro-categoria.png', url: '/gerenciamento-materiais', action: 'material-filters', description: 'Filtros por categoria aplicados' }
    ]
  },
  '13-notificacoes': {
    name: 'Sistema de Notificações',
    screenshots: [
      { file: 'notificacoes-icone-header.png', url: '/', action: 'notification-icon', description: 'Ícone no header' },
      { file: 'notificacoes-badge-contador.png', url: '/', action: 'notification-badge', description: 'Badge com contador' },
      { file: 'notificacoes-painel-aberto.png', url: '/', action: 'open-panel', description: 'Painel de notificações' },
      { file: 'notificacoes-filtro-todas.png', url: '/', action: 'filter-all', description: 'Filtro "Todas"' },
      { file: 'notificacoes-filtro-nao-lidas.png', url: '/', action: 'filter-unread', description: 'Filtro "Não lidas"' },
      { file: 'notificacoes-categorias.png', url: '/', action: 'show-categories', description: 'Notificações por categoria' },
      { file: 'notificacoes-urgentes.png', url: '/', action: 'urgent-notifications', description: 'Notificações urgentes' },
      { file: 'notificacoes-acoes.png', url: '/', action: 'notification-actions', description: 'Ações disponíveis' }
    ]
  }
};

// Função para aguardar um elemento aparecer na página
async function waitForSelector(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.log(`⚠️  Elemento não encontrado: ${selector}`);
    return false;
  }
}

// Função para aguardar carregamento da página
async function waitForPageLoad(page, timeout = 10000) {
  try {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForTimeout(2000); // Aguarda componentes React carregarem
    return true;
  } catch (error) {
    console.log('⚠️  Timeout no carregamento da página');
    return false;
  }
}

// Função para executar ações específicas na página
async function executeAction(page, action, searchTerm = '') {
  console.log(`    🔄 Executando ação: ${action}`);
  
  try {
    switch (action) {
      case 'collapse-sidebar':
        // Tenta encontrar e clicar no botão do menu/hamburger
        const sidebarToggle = page.locator('button').filter({ hasText: /☰|≡/ }).first();
        if (await sidebarToggle.count() > 0) {
          await sidebarToggle.click();
          await page.waitForTimeout(1000);
        } else {
          // Tenta outros seletores
          await page.evaluate(() => {
            const buttons = document.querySelectorAll('button, .menu-toggle, .sidebar-toggle');
            for (let btn of buttons) {
              if (btn.textContent.includes('☰') || btn.classList.contains('hamburger') || btn.getAttribute('aria-label')?.includes('menu')) {
                btn.click();
                break;
              }
            }
          });
        }
        break;

      case 'expand-sidebar':
        // Força expansão da sidebar
        await page.evaluate(() => {
          const sidebar = document.querySelector('.sidebar, [class*="sidebar"], nav');
          if (sidebar) {
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.width = '280px';
            sidebar.classList.remove('collapsed');
          }
        });
        await page.waitForTimeout(500);
        break;

      case 'open-notifications':
        // Procura pelo ícone de sino/notificação
        const notificationSelectors = [
          'button[title*="notific"]',
          'button[aria-label*="notific"]', 
          '[class*="notification"]',
          'button:has-text("🔔")',
          '.bell, .notification-bell'
        ];
        
        for (const selector of notificationSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1500);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'search':
        // Procura por campos de busca e preenche
        const searchSelectors = [
          'input[type="search"]',
          'input[placeholder*="busca"]',
          'input[placeholder*="pesquis"]',
          'input[placeholder*="procurar"]',
          '.search-input',
          '[data-testid*="search"]'
        ];
        
        for (const selector of searchSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.fill(selector, searchTerm);
              await page.press(selector, 'Enter');
              await page.waitForTimeout(1500);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'filter':
        // Procura por botões de filtro
        const filterSelectors = [
          'button:has-text("Filtro")',
          'button:has-text("Filter")', 
          '[class*="filter"]',
          'button[aria-label*="filtro"]',
          '.filter-button'
        ];
        
        for (const selector of filterSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'new-patient':
      case 'new-employee':
      case 'new-entry':
        // Procura por botões de adicionar/novo
        const addSelectors = [
          'button:has-text("Adicionar")',
          'button:has-text("Novo")',
          'button:has-text("Cadastrar")',
          'button:has-text("+")',
          '.btn-primary',
          '[class*="add"]',
          'button[title*="novo"]'
        ];
        
        for (const selector of addSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(2000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'intercorrencias-tab':
        // Procura pela aba Intercorrências
        const tabSelectors = [
          'button:has-text("Intercorrências")',
          '[role="tab"]:has-text("Intercorrências")',
          '.tab:has-text("Intercorrências")'
        ];
        
        for (const selector of tabSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'vital-signs':
        // Foca na seção de sinais vitais e rola até ela
        await page.evaluate(() => {
          const element = document.querySelector('[class*="vital"], [class*="sinais"], h3:has-text("Sinais Vitais"), h2:has-text("Sinais Vitais")');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        await page.waitForTimeout(1500);
        break;

      case 'scroll-down':
        // Rola a página para baixo
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(1000);
        break;

      case 'scroll-form':
        // Rola para mostrar mais do formulário
        await page.evaluate(() => window.scrollTo(0, 600));
        await page.waitForTimeout(1000);
        break;

      case 'alphabetical-sort':
        // Procura por botões de ordenação
        const sortSelectors = [
          'button:has-text("A-Z")',
          'button:has-text("Alfabética")',
          '[title*="alfabética"]',
          '[class*="sort"]'
        ];
        
        for (const selector of sortSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'material-filters':
        // Procura por filtros específicos de materiais
        const materialFilterSelectors = [
          'select[name*="categoria"]',
          'select[name*="material"]',
          '.material-filter',
          'button:has-text("Categoria")'
        ];
        
        for (const selector of materialFilterSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              if (selector.includes('select')) {
                await page.selectOption(selector, { index: 1 });
              } else {
                await page.click(selector);
              }
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'text-search':
        // Busca textual avançada
        const textSearchSelectors = [
          'input[type="text"]',
          'input[name*="search"]',
          'input[placeholder*="busca"]',
          '.search-field'
        ];
        
        for (const selector of textSearchSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.fill(selector, searchTerm);
              await page.press(selector, 'Enter');
              await page.waitForTimeout(1500);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'card-view':
        // Muda para visualização em cards
        const cardViewSelectors = [
          'button[title*="card"]',
          'button:has-text("Cards")',
          '.view-toggle button:first-child',
          '[aria-label*="card"]'
        ];
        
        for (const selector of cardViewSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'table-view':
        // Muda para visualização em tabela
        const tableViewSelectors = [
          'button[title*="tabela"]',
          'button:has-text("Tabela")',
          '.view-toggle button:last-child',
          '[aria-label*="tabela"]'
        ];
        
        for (const selector of tableViewSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'show-stats':
        // Mostra estatísticas ou cards informativos
        await page.evaluate(() => {
          const statsSection = document.querySelector('[class*="stats"], [class*="card"], .dashboard-cards');
          if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        await page.waitForTimeout(1000);
        break;

      case 'show-form-filled':
        // Preenche formulário com dados de exemplo
        await page.evaluate(() => {
          const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
          const sampleData = ['João Silva', 'joao@email.com', 'Observações importantes', '123456789'];
          inputs.forEach((input, index) => {
            if (sampleData[index] && !input.value) {
              input.value = sampleData[index];
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
        });
        await page.waitForTimeout(1000);
        break;

      case 'click-first-item':
        // Clica no primeiro item da lista para mostrar detalhes
        const firstItemSelectors = [
          '.list-item:first-child',
          'tbody tr:first-child',
          '.card:first-child',
          '[data-testid*="item"]:first-child'
        ];
        
        for (const selector of firstItemSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1500);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      case 'show-menu-expanded':
        // Expande menus dropdown
        const menuSelectors = [
          '.dropdown-toggle',
          'button[aria-expanded="false"]',
          '.menu-trigger'
        ];
        
        for (const selector of menuSelectors) {
          try {
            if (await waitForSelector(page, selector, 2000)) {
              await page.click(selector);
              await page.waitForTimeout(1000);
              break;
            }
          } catch (e) { continue; }
        }
        break;

      default:
        console.log(`    ⚠️  Ação não implementada: ${action}`);
        // Ação genérica: rola a página para mostrar mais conteúdo
        await page.evaluate(() => window.scrollTo(0, 400));
        await page.waitForTimeout(500);
        break;
    }
  } catch (error) {
    console.log(`    ❌ Erro ao executar ação ${action}: ${error.message}`);
  }
}

// Função para capturar screenshot
async function captureScreenshot(page, filePath, description) {
  try {
    console.log(`    📸 Capturando: ${description}`);
    
    // Aguarda elementos carregarem
    await page.waitForTimeout(2000);
    
    // Faz scroll para o topo
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Captura a screenshot
    await page.screenshot({ 
      path: filePath, 
      fullPage: false,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height }
    });
    
    console.log(`    ✅ Screenshot salvo: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.log(`    ❌ Erro ao capturar screenshot: ${error.message}`);
    return false;
  }
}

// Função principal
async function runScreenshotAutomation() {
  console.log('🚀 Iniciando automação de capturas de tela...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Mostra o browser para acompanhar o progresso
    defaultViewport: VIEWPORT,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  let totalScreenshots = 0;
  let successfulScreenshots = 0;
  
  try {
    // Testa conectividade
    console.log('🔄 Testando conectividade...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await waitForPageLoad(page);
    console.log('✅ Sistema acessível!\n');
    
    // Processa cada módulo
    for (const [moduleDir, moduleConfig] of Object.entries(SCREENSHOTS_CONFIG)) {
      console.log(`📂 Módulo: ${moduleConfig.name} (${moduleDir})`);
      
      // Cria diretório se não existir
      const modulePath = path.join(SCREENSHOT_DIR, moduleDir);
      await fs.ensureDir(modulePath);
      
      // Processa cada screenshot do módulo
      for (const screenshot of moduleConfig.screenshots) {
        totalScreenshots++;
        
        try {
          console.log(`  🔄 ${screenshot.description}...`);
          
          // Navega para a URL
          const fullUrl = BASE_URL + screenshot.url;
          await page.goto(fullUrl, { waitUntil: 'networkidle' });
          await waitForPageLoad(page);
          
          // Executa ação se especificada
          if (screenshot.action) {
            await executeAction(page, screenshot.action, screenshot.searchTerm || '');
          }
          
          // Captura screenshot
          const screenshotPath = path.join(modulePath, screenshot.file);
          const success = await captureScreenshot(page, screenshotPath, screenshot.description);
          
          if (success) {
            successfulScreenshots++;
          }
          
          // Pequena pausa entre capturas
          await page.waitForTimeout(1000);
          
        } catch (error) {
          console.log(`  ❌ Erro na captura ${screenshot.file}: ${error.message}`);
        }
      }
      
      console.log(`✅ Módulo ${moduleConfig.name} concluído!\n`);
    }
    
  } catch (error) {
    console.log(`❌ Erro geral: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Relatório final
  console.log('📊 RELATÓRIO FINAL');
  console.log('=' .repeat(50));
  console.log(`Total de capturas planejadas: ${totalScreenshots}`);
  console.log(`Capturas realizadas com sucesso: ${successfulScreenshots}`);
  console.log(`Taxa de sucesso: ${((successfulScreenshots / totalScreenshots) * 100).toFixed(1)}%`);
  console.log(`Diretório de saída: ${SCREENSHOT_DIR}`);
  
  if (successfulScreenshots === totalScreenshots) {
    console.log('🎉 TODAS AS CAPTURAS FORAM REALIZADAS COM SUCESSO!');
  } else {
    console.log('⚠️  Algumas capturas falharam. Verifique os logs acima.');
  }
}

// Executa a automação
if (require.main === module) {
  runScreenshotAutomation()
    .then(() => {
      console.log('\n✨ Automação concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { runScreenshotAutomation };