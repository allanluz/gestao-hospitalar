const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                🏥 SISTEMA DE GERENCIAMENTO HOSPITALAR        ║
║                   Santa Casa de Misericórdia de Tupã        ║
║                           Versão 2.1.0                      ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

console.log(`${colors.yellow}📋 Inicializando Sistema Hospitalar...${colors.reset}\n`);

let backendProcess = null;
let frontendProcess = null;
let isShuttingDown = false;

// Verificar se Node.js está instalado
function checkNodeJS() {
  try {
    const { execSync } = require('child_process');
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✅ Node.js encontrado: ${nodeVersion}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Node.js não encontrado! Instale em: https://nodejs.org${colors.reset}`);
    return false;
  }
}

// Verificar se as dependências estão instaladas
function checkDependencies() {
  const backendModules = path.join(__dirname, 'backend', 'node_modules');
  const frontendModules = path.join(__dirname, 'frontend', 'node_modules');
  
  let needsInstall = [];
  
  if (!fs.existsSync(backendModules)) {
    needsInstall.push('backend');
  }
  
  if (!fs.existsSync(frontendModules)) {
    needsInstall.push('frontend');
  }
  
  return needsInstall;
}

// Instalar dependências
function installDependencies(modules) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.yellow}📦 Instalando dependências...${colors.reset}`);
    
    const installPromises = modules.map(module => {
      return new Promise((res, rej) => {
        console.log(`${colors.blue}   • Instalando ${module}...${colors.reset}`);
        const npmInstall = spawn('npm', ['install'], {
          cwd: path.join(__dirname, module),
          stdio: 'pipe',
          shell: true
        });
        
        npmInstall.on('close', (code) => {
          if (code === 0) {
            console.log(`${colors.green}   ✅ ${module} instalado com sucesso!${colors.reset}`);
            res();
          } else {
            console.error(`${colors.red}   ❌ Erro ao instalar ${module}${colors.reset}`);
            rej(new Error(`Falha na instalação do ${module}`));
          }
        });
      });
    });
    
    Promise.all(installPromises)
      .then(() => {
        console.log(`${colors.green}✅ Todas as dependências instaladas!${colors.reset}\n`);
        resolve();
      })
      .catch(reject);
  });
}

// Função para executar comandos com logs coloridos
function runCommand(command, args, cwd, name, color) {
  const process = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: true
  });

  process.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`${color}[${name}]${colors.reset} ${output}`);
    }
  });

  process.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('webpack compiled') && !output.includes('Local:')) {
      console.log(`${color}[${name}]${colors.reset} ${output}`);
    }
  });

  process.on('error', (error) => {
    if (!isShuttingDown) {
      console.error(`${colors.red}[${name}] Erro: ${error.message}${colors.reset}`);
    }
  });

  return process;
}

// Função para aguardar um tempo específico
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função principal para iniciar o sistema
async function startSystem() {
  try {
    // 1. Verificar Node.js
    if (!checkNodeJS()) {
      process.exit(1);
    }
    
    // 2. Verificar dependências
    const missingDeps = checkDependencies();
    if (missingDeps.length > 0) {
      await installDependencies(missingDeps);
    } else {
      console.log(`${colors.green}✅ Dependências verificadas!${colors.reset}\n`);
    }
    
    // 3. Iniciar Backend
    console.log(`${colors.magenta}🔧 Iniciando Backend (porta 5000)...${colors.reset}`);
    backendProcess = runCommand('npm', ['run', 'dev'], 
      path.join(__dirname, 'backend'), 'BACKEND', colors.magenta);
    
    // 4. Aguardar backend inicializar
    await delay(3000);
    
    // 5. Iniciar Frontend
    console.log(`${colors.cyan}⚛️  Iniciando Frontend (porta 3000)...${colors.reset}`);
    frontendProcess = runCommand('npm', ['start'], 
      path.join(__dirname, 'frontend'), 'FRONTEND', colors.cyan);
    
    // 6. Aguardar frontend inicializar
    await delay(5000);
    
    // 7. Mostrar informações de sucesso
    console.log(`
${colors.green}${colors.bright}🎉 SISTEMA INICIADO COM SUCESSO! 🎉${colors.reset}

${colors.bright}📊 Acesso ao Sistema:${colors.reset}
   • Dashboard Principal: ${colors.cyan}http://localhost:3000${colors.reset}
   • Backend API:        ${colors.magenta}http://localhost:5000${colors.reset}

${colors.bright}✨ Módulos Disponíveis:${colors.reset}
   🏥 Dashboard com estatísticas em tempo real
   👥 Cadastro de Pacientes e Funcionários
   📦 Controle de Estoque Inteligente
   🔬 Catálogo de Materiais (260+ itens especializados)
   🏥 Centro Cirúrgico Completo:
      • Recepção do Centro Cirúrgico
      • Assistência Intra-Operatória
      • Recuperação Anestésica
      • Controle de Infecção Hospitalar
      • Custeio Cirúrgico
   🩺 UTI e Controle de Emergência

${colors.bright}📋 Categorias de Materiais:${colors.reset}
   • Cardiologia, Neurologia, Oncologia
   • Oftalmologia, Pediatria, Dermatologia
   • Laboratório, Microbiologia, Patologia
   • Emergência, UTI Móvel, Queimados
   • E mais 15+ categorias especializadas!

${colors.yellow}⚠️  Para parar o sistema: Pressione Ctrl+C${colors.reset}
${colors.blue}📖 Documentação completa disponível no README.md${colors.reset}
`);
    
    // 8. Tentar abrir o navegador automaticamente
    setTimeout(() => {
      const { exec } = require('child_process');
      const command = process.platform === 'win32' ? 'start' : 
                     process.platform === 'darwin' ? 'open' : 'xdg-open';
      
      exec(`${command} http://localhost:3000`, (error) => {
        if (!error) {
          console.log(`${colors.green}🌐 Navegador aberto automaticamente!${colors.reset}`);
        }
      });
    }, 2000);
    
  } catch (error) {
    console.error(`${colors.red}❌ Erro ao iniciar o sistema: ${error.message}${colors.reset}`);
    cleanup();
    process.exit(1);
  }
}

// Função para limpeza ao encerrar
function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n${colors.yellow}🛑 Encerrando Sistema de Gerenciamento Hospitalar...${colors.reset}`);
  
  if (backendProcess) {
    console.log(`${colors.magenta}   • Parando Backend...${colors.reset}`);
    backendProcess.kill('SIGTERM');
  }
  
  if (frontendProcess) {
    console.log(`${colors.cyan}   • Parando Frontend...${colors.reset}`);
    frontendProcess.kill('SIGTERM');
  }
  
  console.log(`${colors.green}✅ Sistema encerrado com sucesso!${colors.reset}`);
  console.log(`${colors.blue}👋 Obrigado por usar o Sistema Hospitalar da Santa Casa de Tupã!${colors.reset}\n`);
}

// Gerenciar encerramento gracioso
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error(`${colors.red}❌ Erro não tratado: ${error.message}${colors.reset}`);
  cleanup();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`${colors.red}❌ Promise rejeitada: ${reason}${colors.reset}`);
  cleanup();
  process.exit(1);
});

// Iniciar o sistema
startSystem();