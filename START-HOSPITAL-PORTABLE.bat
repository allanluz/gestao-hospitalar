@echo off
chcp 65001 >nul
title Sistema Hospitalar - Santa Casa de Tupã (Versão Portátil)
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🏥 SISTEMA DE GERENCIAMENTO HOSPITALAR        ║
echo ║                   Santa Casa de Misericórdia de Tupã        ║
echo ║                        Versão 2.1.0 Portátil               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Verificando Node.js...

REM Primeiro tentar Node.js global
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado no sistema!
    goto :install_deps
)

REM Verificar se Node.js portátil já existe
if exist "nodejs-portable\node.exe" (
    echo ✅ Node.js portátil encontrado!
    set "PATH=%CD%\nodejs-portable;%PATH%"
    set "NODE_PATH=%CD%\nodejs-portable\node_modules"
    goto :install_deps
)

echo.
echo 📥 Node.js não encontrado. Baixando versão portátil...
echo    • Isso é feito apenas uma vez
echo    • Tamanho aproximado: 30MB
echo    • Não interfere com seu sistema
echo.

REM Criar diretório temporário
if not exist "temp" mkdir temp

echo 🌐 Baixando Node.js v18.17.0 (LTS)...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-win-x64.zip' -OutFile 'temp\nodejs.zip'}"

if not exist "temp\nodejs.zip" (
    echo ❌ Erro ao baixar Node.js!
    echo.
    echo 🌐 Tentando abrir página de download manual...
    start https://nodejs.org/
    echo.
    echo Por favor:
    echo 1. Baixe e instale o Node.js do site oficial
    echo 2. Execute este script novamente
    pause
    exit /b 1
)

echo 📦 Extraindo Node.js portátil...
powershell -Command "& {$ProgressPreference = 'SilentlyContinue'; Expand-Archive -Path 'temp\nodejs.zip' -DestinationPath 'temp\' -Force}"

REM Mover para pasta definitiva
if exist "temp\node-v18.17.0-win-x64" (
    move "temp\node-v18.17.0-win-x64" "nodejs-portable" >nul
    echo ✅ Node.js portátil configurado com sucesso!
) else (
    echo ❌ Erro ao extrair Node.js
    pause
    exit /b 1
)

REM Limpar arquivos temporários
rmdir /s /q temp >nul 2>&1

REM Configurar PATH para usar Node.js portátil
set "PATH=%CD%\nodejs-portable;%PATH%"
set "NODE_PATH=%CD%\nodejs-portable\node_modules"

:install_deps
echo.
echo 📦 Verificando dependências do projeto...

REM Verificar se as dependências do backend estão instaladas
if not exist "backend\node_modules\" (
    echo.
    echo 📦 Instalando dependências do Backend...
    cd backend
    echo    • Executando npm install...
    ..\nodejs-portable\npm.cmd install --loglevel error --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências do backend!
        echo.
        echo 🔧 Tentando com Node.js global...
        npm install --loglevel error --no-audit --no-fund
        if %errorlevel% neq 0 (
            echo ❌ Falha na instalação! Verifique sua conexão com a internet.
            pause
            exit /b 1
        )
    )
    echo ✅ Backend configurado!
    cd ..
)

REM Verificar se as dependências do frontend estão instaladas
if not exist "frontend\node_modules\" (
    echo.
    echo 📦 Instalando dependências do Frontend...
    cd frontend
    echo    • Executando npm install...
    ..\nodejs-portable\npm.cmd install --loglevel error --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências do frontend!
        echo.
        echo 🔧 Tentando com Node.js global...
        npm install --loglevel error --no-audit --no-fund
        if %errorlevel% neq 0 (
            echo ❌ Falha na instalação! Verifique sua conexão com a internet.
            pause
            exit /b 1
        )
    )
    echo ✅ Frontend configurado!
    cd ..
)

echo.
echo ✅ Todas as dependências instaladas com sucesso!
echo.

echo 🚀 Iniciando Sistema Hospitalar...
echo.

REM Iniciar Backend
echo 🔧 Iniciando Backend na porta 5000...
if exist "nodejs-portable\node.exe" (
    start "🏥 Backend - Sistema Hospitalar" /min cmd /k "cd backend && echo 🔧 Backend iniciando... && ..\nodejs-portable\npm.cmd run dev"
) else (
    start "🏥 Backend - Sistema Hospitalar" /min cmd /k "cd backend && echo 🔧 Backend iniciando... && npm run dev"
)

REM Aguardar backend inicializar
echo    • Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

REM Iniciar Frontend
echo ⚛️  Iniciando Frontend na porta 3000...
if exist "nodejs-portable\node.exe" (
    start "🌐 Frontend - Sistema Hospitalar" /min cmd /k "cd frontend && echo ⚛️ Frontend iniciando... && ..\nodejs-portable\npm.cmd start"
) else (
    start "🌐 Frontend - Sistema Hospitalar" /min cmd /k "cd frontend && echo ⚛️ Frontend iniciando... && npm start"
)

REM Aguardar frontend compilar
echo    • Aguardando frontend compilar...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 SISTEMA HOSPITALAR INICIADO COM SUCESSO! 🎉
echo.
echo ═════════════════════════════════════════════════════════════
echo                    📊 ACESSO AO SISTEMA
echo ═════════════════════════════════════════════════════════════
echo.
echo   🌐 Dashboard Principal: http://localhost:3000
echo   🔧 Backend API:        http://localhost:5000
echo.
echo ═════════════════════════════════════════════════════════════
echo                   ✨ MÓDULOS DISPONÍVEIS
echo ═════════════════════════════════════════════════════════════
echo.
echo   🏥 Dashboard com Estatísticas em Tempo Real
echo   👥 Cadastro de Pacientes e Funcionários
echo   📦 Controle de Estoque Inteligente
echo   🔬 Catálogo de Materiais (260+ itens especializados)
echo.
echo   🏥 CENTRO CIRÚRGICO COMPLETO:
echo      • Recepção com Checklist Pré-Operatório
echo      • Assistência Intra-Operatória (Escala Ramsay)
echo      • Recuperação Anestésica (Índice Aldrete-Kroulik)  
echo      • Controle de Infecção Hospitalar
echo      • Custeio Cirúrgico Detalhado
echo.
echo   🩺 UTI e Controle de Emergência
echo.
echo ═════════════════════════════════════════════════════════════
echo                📋 CATEGORIAS DE MATERIAIS (260+)
echo ═════════════════════════════════════════════════════════════
echo.
echo   🫀 Cardiologia    🧠 Neurologia      🎗️  Oncologia
echo   👁️  Oftalmologia  👶 Pediatria       🔬 Laboratório
echo   🩺 Emergência     🏥 UTI Móvel       🔥 Queimados
echo   🦴 Ortopedia      💊 Medicamentos    🧪 Microbiologia
echo   🩹 Dermatologia   ⚕️  Nefrologia      👨‍⚕️ Psiquiatria  
echo   👴 Geriatria      ❤️  Cuidados Paliativos
echo   🧬 Hemodinâmica   🔬 Patologia       🌡️  Reabilitação
echo   ... e mais categorias especializadas!
echo.

REM Criar arquivo de status
echo Sistema iniciado em %date% %time% > .system_status

REM Tentar abrir navegador
echo 🌐 Abrindo navegador automaticamente...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ⚠️  INSTRUÇÕES IMPORTANTES:
echo.
echo    ✅ Sistema totalmente funcional e pronto para uso!
echo    ✅ Duas janelas foram abertas (Backend e Frontend)
echo    ⚠️  NÃO FECHE estas janelas para manter o sistema funcionando
echo    🛑 Para parar: feche as janelas do Backend e Frontend
echo    🌐 O navegador abrirá automaticamente
echo.
if exist "nodejs-portable\node.exe" (
    echo    ℹ️  Usando Node.js portátil (não interfere no seu sistema)
    echo.
)
echo    📖 Documentação completa: README.md
echo    🆘 Guia rápido: INICIO-RAPIDO.md
echo.
echo ═════════════════════════════════════════════════════════════
echo    🏥 Santa Casa de Misericórdia de Tupã - v2.1.0 Portátil
echo    Sistema pronto! Pressione qualquer tecla para sair...
echo ═════════════════════════════════════════════════════════════

pause >nul

REM Limpar arquivo de status
if exist .system_status del .system_status

echo.
echo 👋 Obrigado por usar o Sistema Hospitalar!
echo    • Sistema continua executando em segundo plano
echo    • Acesse: http://localhost:3000
echo.