const { chromium } = require('playwright');
const fs = require('fs-extra');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..');
const VIEWPORT = { width: 1920, height: 1080 };

// Lista simplificada de páginas e capturas
const PAGES_CONFIG = {
  '01-dashboard': [
    { url: '/', file: 'dashboard-overview.png', description: 'Dashboard - Visão geral' },
    { url: '/', file: 'dashboard-scroll.png', description: 'Dashboard - Rolagem', scroll: 400 },
    { url: '/', file: 'dashboard-sidebar.png', description: 'Dashboard - Sidebar visível' },
    { url: '/', file: 'dashboard-cards.png', description: 'Dashboard - Cards de estatísticas', scroll: 800 }
  ],
  '02-pacientes': [
    { url: '/pacientes', file: 'pacientes-listagem.png', description: 'Pacientes - Lista completa' },
    { url: '/pacientes', file: 'pacientes-scroll-meio.png', description: 'Pacientes - Meio da lista', scroll: 600 },
    { url: '/pacientes', file: 'pacientes-scroll-final.png', description: 'Pacientes - Final da lista', scroll: 1200 },
    { url: '/pacientes', file: 'pacientes-busca.png', description: 'Pacientes - Campo de busca', fillSearch: 'Maria' },
    { url: '/pacientes', file: 'pacientes-cards.png', description: 'Pacientes - Cards de informação', scroll: 300 }
  ],
  '03-funcionarios': [
    { url: '/funcionarios', file: 'funcionarios-listagem.png', description: 'Funcionários - Lista completa' },
    { url: '/funcionarios', file: 'funcionarios-scroll-meio.png', description: 'Funcionários - Meio da lista', scroll: 600 },
    { url: '/funcionarios', file: 'funcionarios-busca.png', description: 'Funcionários - Campo de busca', fillSearch: 'João' },
    { url: '/funcionarios', file: 'funcionarios-scroll-final.png', description: 'Funcionários - Final da lista', scroll: 1200 },
    { url: '/funcionarios', file: 'funcionarios-detalhes.png', description: 'Funcionários - Área de detalhes', scroll: 400 }
  ],
  '04-estoque': [
    { url: '/estoque', file: 'estoque-dashboard.png', description: 'Estoque - Dashboard principal' },
    { url: '/estoque', file: 'estoque-cards.png', description: 'Estoque - Cards informativos', scroll: 400 },
    { url: '/estoque', file: 'estoque-tabela.png', description: 'Estoque - Tabela de itens', scroll: 800 },
    { url: '/estoque', file: 'estoque-scroll-final.png', description: 'Estoque - Parte inferior', scroll: 1200 }
  ],
  '05-uti': [
    { url: '/uti', file: 'uti-dashboard.png', description: 'UTI - Dashboard principal' },
    { url: '/uti', file: 'uti-leitos.png', description: 'UTI - Status dos leitos', scroll: 400 },
    { url: '/uti', file: 'uti-equipamentos.png', description: 'UTI - Status dos equipamentos', scroll: 800 },
    { url: '/uti', file: 'uti-pacientes.png', description: 'UTI - Lista de pacientes', scroll: 600 },
    { url: '/uti', file: 'uti-scroll-final.png', description: 'UTI - Parte inferior', scroll: 1200 }
  ],
  '06-centro-cirurgico': [
    { url: '/centro-cirurgico', file: 'cc-agenda-diaria.png', description: 'Centro Cirúrgico - Agenda' },
    { url: '/centro-cirurgico', file: 'cc-salas.png', description: 'Centro Cirúrgico - Status das salas', scroll: 400 },
    { url: '/centro-cirurgico', file: 'cc-equipamentos.png', description: 'Centro Cirúrgico - Equipamentos', scroll: 800 },
    { url: '/centro-cirurgico', file: 'cc-scroll-final.png', description: 'Centro Cirúrgico - Parte inferior', scroll: 1200 }
  ],
  '07-recepcao-centro-cirurgico': [
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-dashboard.png', description: 'Recepção CC - Dashboard' },
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-formulario.png', description: 'Recepção CC - Formulário', scroll: 400 },
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-listagem.png', description: 'Recepção CC - Listagem', scroll: 800 },
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-busca.png', description: 'Recepção CC - Busca', fillSearch: 'João' },
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-cards.png', description: 'Recepção CC - Visualização cards', scroll: 600 },
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-tabela.png', description: 'Recepção CC - Visualização tabela', scroll: 1000 },
    { url: '/centro-cirurgico-recepcao', file: 'recepcao-scroll-final.png', description: 'Recepção CC - Final', scroll: 1400 }
  ],
  '08-assistencia-intra-operatoria': [
    { url: '/assistencia-intra-operatoria', file: 'assistencia-formulario-topo.png', description: 'Assistência - Topo do formulário' },
    { url: '/assistencia-intra-operatoria', file: 'assistencia-dados-paciente.png', description: 'Assistência - Dados do paciente', scroll: 300 },
    { url: '/assistencia-intra-operatoria', file: 'assistencia-equipe-medica.png', description: 'Assistência - Equipe médica', scroll: 600 },
    { url: '/assistencia-intra-operatoria', file: 'assistencia-materiais.png', description: 'Assistência - Materiais utilizados', scroll: 900 },
    { url: '/assistencia-intra-operatoria', file: 'assistencia-intercorrencias.png', description: 'Assistência - Intercorrências', clickTab: 'Intercorrências' },
    { url: '/assistencia-intra-operatoria', file: 'assistencia-scroll-final.png', description: 'Assistência - Final do formulário', scroll: 1200 }
  ],
  '09-recuperacao-anestesica': [
    { url: '/recuperacao-anestesica', file: 'recuperacao-dashboard.png', description: 'Recuperação - Dashboard' },
    { url: '/recuperacao-anestesica', file: 'recuperacao-formulario.png', description: 'Recuperação - Formulário principal', scroll: 300 },
    { url: '/recuperacao-anestesica', file: 'recuperacao-sinais-vitais.png', description: 'Recuperação - Sinais vitais', scroll: 600 },
    { url: '/recuperacao-anestesica', file: 'recuperacao-aldrete.png', description: 'Recuperação - Escala Aldrete', scroll: 900 },
    { url: '/recuperacao-anestesica', file: 'recuperacao-registros.png', description: 'Recuperação - Registros anteriores', scroll: 1200 },
    { url: '/recuperacao-anestesica', file: 'recuperacao-scroll-final.png', description: 'Recuperação - Final da página', scroll: 1500 }
  ],
  '10-controle-infeccao': [
    { url: '/controle-infeccao', file: 'infeccao-formulario-topo.png', description: 'Controle Infecção - Topo' },
    { url: '/controle-infeccao', file: 'infeccao-busca-paciente.png', description: 'Controle Infecção - Busca paciente', scroll: 300 },
    { url: '/controle-infeccao', file: 'infeccao-dados-cirurgia.png', description: 'Controle Infecção - Dados cirúrgicos', scroll: 600 },
    { url: '/controle-infeccao', file: 'infeccao-fatores-risco.png', description: 'Controle Infecção - Fatores de risco', scroll: 900 },
    { url: '/controle-infeccao', file: 'infeccao-listagem.png', description: 'Controle Infecção - Lista de controles', scroll: 1200 },
    { url: '/controle-infeccao', file: 'infeccao-scroll-final.png', description: 'Controle Infecção - Final', scroll: 1500 }
  ],
  '11-custeio-cirurgico': [
    { url: '/custeio-cirurgico', file: 'custeio-formulario-topo.png', description: 'Custeio - Topo do formulário' },
    { url: '/custeio-cirurgico', file: 'custeio-dados-basicos.png', description: 'Custeio - Dados básicos', scroll: 300 },
    { url: '/custeio-cirurgico', file: 'custeio-selecao-materiais.png', description: 'Custeio - Seleção materiais', scroll: 600 },
    { url: '/custeio-cirurgico', file: 'custeio-lista-materiais.png', description: 'Custeio - Lista de materiais', scroll: 900 },
    { url: '/custeio-cirurgico', file: 'custeio-totalizacao.png', description: 'Custeio - Totalização custos', scroll: 1200 },
    { url: '/custeio-cirurgico', file: 'custeio-registros.png', description: 'Custeio - Registros salvos', scroll: 1500 },
    { url: '/custeio-cirurgico', file: 'custeio-scroll-final.png', description: 'Custeio - Final da página', scroll: 1800 }
  ],
  '12-gerenciamento-materiais': [
    { url: '/gerenciamento-materiais', file: 'materiais-listagem-topo.png', description: 'Materiais - Topo da lista' },
    { url: '/gerenciamento-materiais', file: 'materiais-busca.png', description: 'Materiais - Campo de busca', fillSearch: 'bisturi' },
    { url: '/gerenciamento-materiais', file: 'materiais-categoria-a.png', description: 'Materiais - Categoria A', scroll: 400 },
    { url: '/gerenciamento-materiais', file: 'materiais-categoria-b.png', description: 'Materiais - Categoria B', scroll: 800 },
    { url: '/gerenciamento-materiais', file: 'materiais-categoria-c.png', description: 'Materiais - Categoria C', scroll: 1200 },
    { url: '/gerenciamento-materiais', file: 'materiais-scroll-final.png', description: 'Materiais - Final da lista', scroll: 1600 }
  ],
  '13-notificacoes': [
    { url: '/', file: 'notificacoes-icone-header.png', description: 'Notificações - Ícone no header' },
    { url: '/', file: 'notificacoes-painel.png', description: 'Notificações - Painel', clickNotifications: true },
    { url: '/', file: 'notificacoes-lista.png', description: 'Notificações - Lista completa', clickNotifications: true, scroll: 300 },
    { url: '/', file: 'notificacoes-filtros.png', description: 'Notificações - Filtros', clickNotifications: true, scroll: 200 },
    { url: '/', file: 'notificacoes-urgentes.png', description: 'Notificações - Urgentes', clickNotifications: true },
    { url: '/', file: 'notificacoes-categorias.png', description: 'Notificações - Por categoria', clickNotifications: true, scroll: 400 },
    { url: '/', file: 'notificacoes-acoes.png', description: 'Notificações - Ações disponíveis', clickNotifications: true, scroll: 500 },
    { url: '/', file: 'notificacoes-badge.png', description: 'Notificações - Badge contador' }
  ]
};

// Função para aguardar carregamento
async function waitForPageLoad(page, timeout = 10000) {
  try {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForTimeout(3000); // Aguarda React carregar
    return true;
  } catch (error) {
    console.log('⚠️  Timeout no carregamento da página');
    return false;
  }
}

// Função para executar ações específicas
async function executePageAction(page, config) {
  try {
    // Scroll da página
    if (config.scroll) {
      await page.evaluate((scrollY) => {
        window.scrollTo(0, scrollY);
      }, config.scroll);
      await page.waitForTimeout(1000);
    }

    // Preenche campo de busca
    if (config.fillSearch) {
      const searchFields = await page.locator('input[type="text"], input[type="search"], input[placeholder*="busca"], input[placeholder*="pesquis"]');
      if (await searchFields.count() > 0) {
        await searchFields.first().fill(config.fillSearch);
        await page.waitForTimeout(1500);
      }
    }

    // Clica em abas
    if (config.clickTab) {
      const tabs = await page.locator(`button:has-text("${config.clickTab}"), [role="tab"]:has-text("${config.clickTab}")`);
      if (await tabs.count() > 0) {
        await tabs.first().click();
        await page.waitForTimeout(1000);
      }
    }

    // Clica em notificações
    if (config.clickNotifications) {
      // Procura por elementos relacionados a notificações
      const notificationElements = await page.locator('button, [class*="notification"], [class*="bell"], svg').all();
      
      for (let element of notificationElements) {
        try {
          const text = await element.textContent();
          const className = await element.getAttribute('class');
          
          if (className && className.includes('notification') || text === '🔔') {
            await element.click();
            await page.waitForTimeout(1500);
            break;
          }
        } catch (e) {
          // Continua tentando outros elementos
        }
      }
    }

  } catch (error) {
    console.log(`    ⚠️  Erro na ação: ${error.message}`);
  }
}

// Função para capturar screenshot
async function captureScreenshot(page, filePath, description) {
  try {
    console.log(`    📸 Capturando: ${description}`);
    
    // Aguarda um pouco para elementos estabilizarem
    await page.waitForTimeout(1500);
    
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
  console.log('🚀 Iniciando automação melhorada de capturas...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    defaultViewport: VIEWPORT,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
    for (const [moduleDir, screenshots] of Object.entries(PAGES_CONFIG)) {
      console.log(`📂 Módulo: ${moduleDir}`);
      
      // Cria diretório se não existir
      const modulePath = path.join(SCREENSHOT_DIR, moduleDir);
      await fs.ensureDir(modulePath);
      
      // Processa cada screenshot
      for (const screenshotConfig of screenshots) {
        totalScreenshots++;
        
        try {
          console.log(`  🔄 ${screenshotConfig.description}...`);
          
          // Navega para a URL
          const fullUrl = BASE_URL + screenshotConfig.url;
          await page.goto(fullUrl, { waitUntil: 'networkidle' });
          await waitForPageLoad(page);
          
          // Executa ações específicas da captura
          await executePageAction(page, screenshotConfig);
          
          // Captura screenshot
          const screenshotPath = path.join(modulePath, screenshotConfig.file);
          const success = await captureScreenshot(page, screenshotPath, screenshotConfig.description);
          
          if (success) {
            successfulScreenshots++;
          }
          
          // Reset da página para próxima captura
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(500);
          
        } catch (error) {
          console.log(`  ❌ Erro na captura ${screenshotConfig.file}: ${error.message}`);
        }
      }
      
      console.log(`✅ Módulo ${moduleDir} concluído!\n`);
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