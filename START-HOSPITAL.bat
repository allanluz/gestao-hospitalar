@echo off
chcp 65001 >nul
title Sistema Hospitalar - Santa Casa de Tupã
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🏥 SISTEMA DE GERENCIAMENTO HOSPITALAR        ║
echo ║                   Santa Casa de Misericórdia de Tupã        ║
echo ║                           Versão 2.1.0                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
echo 🔍 Verificando requisitos do sistema...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js não foi encontrado!
    echo 📥 Você precisa instalar o Node.js para continuar.
    echo.
    echo 🌐 Deseja abrir a página de download do Node.js? (S/N)
    set /p download="Digite sua escolha: "
    if /i "%download%"=="S" (
        start https://nodejs.org/
    )
    echo.
    echo ⚠️  Instale o Node.js e execute este script novamente.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!

REM Verificar se as dependências estão instaladas
echo 📦 Verificando dependências...

if not exist "backend\node_modules\" (
    echo.
    echo 📦 Instalando dependências do Backend...
    cd backend
    echo    • Executando npm install...
    npm install --loglevel error
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências do backend!
        pause
        exit /b 1
    )
    echo ✅ Backend configurado!
    cd ..
)

if not exist "frontend\node_modules\" (
    echo.
    echo 📦 Instalando dependências do Frontend...
    cd frontend
    echo    • Executando npm install...
    npm install --loglevel error
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências do frontend!
        pause
        exit /b 1
    )
    echo ✅ Frontend configurado!
    cd ..
)

echo.
echo ✅ Todas as dependências verificadas!
echo.

echo 🚀 Iniciando Sistema Hospitalar...
echo.

REM Criar arquivo temporário para controlar os processos
echo. > .system_running

REM Iniciar Backend
echo 🔧 Iniciando Backend na porta 5000...
start "🏥 Backend - Sistema Hospitalar" /min cmd /k "cd backend && echo 🔧 Backend iniciando... && npm run dev"

REM Aguardar um pouco para o backend inicializar
echo    • Aguardando backend inicializar...
timeout /t 4 /nobreak >nul

REM Iniciar Frontend
echo ⚛️  Iniciando Frontend na porta 3000...
start "🌐 Frontend - Sistema Hospitalar" /min cmd /k "cd frontend && echo ⚛️ Frontend iniciando... && npm start"

REM Aguardar frontend inicializar
echo    • Aguardando frontend compilar...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 SISTEMA INICIADO COM SUCESSO! 🎉
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
echo   🔬 Catálogo de Materiais (260+ itens)
echo   🏥 Centro Cirúrgico Completo:
echo      • Recepção do Centro Cirúrgico
echo      • Assistência Intra-Operatória (Escala Ramsay)
echo      • Recuperação Anestésica (Índice Aldrete-Kroulik)
echo      • Controle de Infecção Hospitalar
echo      • Custeio Cirúrgico Detalhado
echo   🩺 UTI e Controle de Emergência
echo.
echo ═════════════════════════════════════════════════════════════
echo                📋 CATEGORIAS DE MATERIAIS
echo ═════════════════════════════════════════════════════════════
echo.
echo   🫀 Cardiologia  🧠 Neurologia   🎗️  Oncologia
echo   👁️  Oftalmologia 👶 Pediatria    🔬 Laboratório
echo   🩺 Emergência   🏥 UTI Móvel    🔥 Queimados
echo   🦴 Ortopedia    💊 Medicamentos 🧪 Microbiologia
echo   🩹 Dermatologia ⚕️  Nefrologia   👨‍⚕️ Psiquiatria
echo   👴 Geriatria    ❤️  Cuidados Paliativos
echo   ... e mais 10+ categorias especializadas!
echo.

REM Tentar abrir o navegador
echo 🌐 Abrindo navegador automaticamente...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ⚠️  INSTRUÇÕES IMPORTANTES:
echo    • Duas novas janelas foram abertas (Backend e Frontend)
echo    • NÃO FECHE estas janelas para manter o sistema funcionando
echo    • Para parar o sistema: feche as janelas do Backend e Frontend
echo    • O navegador abrirá automaticamente em alguns segundos
echo.
echo 📖 Documentação completa disponível no arquivo README.md
echo.
echo ═════════════════════════════════════════════════════════════
echo         Sistema pronto! Pressione qualquer tecla para sair
echo         (O sistema continuará executando em segundo plano)
echo ═════════════════════════════════════════════════════════════

pause >nul

REM Limpar arquivo temporário
if exist .system_running del .system_running

echo.
echo 👋 Obrigado por usar o Sistema Hospitalar!
echo    Santa Casa de Misericórdia de Tupã - v2.1.0
echo.