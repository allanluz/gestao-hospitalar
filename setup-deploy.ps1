# Script para configurar Git e preparar deploy
# Execute: .\setup-deploy.ps1

Write-Host "🚀 Configurando repositório para deploy..." -ForegroundColor Cyan

# Verificar se Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não está instalado. Por favor, instale o Git primeiro." -ForegroundColor Red
    exit 1
}

# Inicializar repositório Git (se necessário)
if (-not (Test-Path .git)) {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
}

# Criar .env de desenvolvimento se não existir
if (-not (Test-Path "frontend\.env")) {
    Write-Host "📝 Criando arquivo .env de desenvolvimento..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
}

if (-not (Test-Path "backend\.env")) {
    Write-Host "📝 Criando arquivo .env do backend..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Arquivo .env do backend criado" -ForegroundColor Green
}

# Adicionar todos os arquivos
Write-Host "📋 Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .

# Criar commit
Write-Host "💾 Criando commit..." -ForegroundColor Yellow
git commit -m "feat: configuração inicial para deploy no Render e Vercel"

Write-Host ""
Write-Host "✅ Repositório configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um repositório no GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Execute os comandos abaixo (substitua SEU-USUARIO):" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/SEU-USUARIO/gestao-hospitalar.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Siga as instruções em DEPLOY.md para deploy no Render e Vercel" -ForegroundColor White
Write-Host ""
