#!/bin/bash

# Script de build para Render.com
# Instala dependências necessárias para o canvas

echo "🔧 Instalando dependências do sistema para canvas..."

# Instalar dependências do canvas no Ubuntu/Debian
apt-get update
apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

echo "📦 Instalando dependências do Node.js..."
npm install

echo "✅ Build concluído!"
