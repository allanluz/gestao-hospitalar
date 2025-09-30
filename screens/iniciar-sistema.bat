@echo off
echo ========================================
echo   SISTEMA HOSPITALAR - INICIALIZACAO
echo ========================================
echo.
echo Iniciando serviços do sistema...
echo.

echo [1/3] Verificando dependencias...
cd /d "d:\TEMP\Allan\Codes\gestao-hospitalar\backend"
if not exist "node_modules" (
    echo Instalando dependencias do backend...
    npm install
)

cd /d "d:\TEMP\Allan\Codes\gestao-hospitalar\frontend"
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    npm install
)

echo.
echo [2/3] Iniciando Backend (Porta 5000)...
start "Backend Server" cmd /k "cd /d d:\TEMP\Allan\Codes\gestao-hospitalar\backend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo [3/3] Iniciando Frontend (Porta 3001)...
start "Frontend Server" cmd /k "cd /d d:\TEMP\Allan\Codes\gestao-hospitalar\frontend && npm start"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   SISTEMA PRONTO PARA CAPTURAS!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3001
echo.
echo Aguarde alguns segundos para carregamento completo...
echo Pressione qualquer tecla para abrir o sistema...
pause > nul

start "" "http://localhost:3001"

echo.
echo Sistema aberto! Pronto para capturas de tela.
echo.
pause