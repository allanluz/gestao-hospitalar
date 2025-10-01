#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema Hospitalar - Santa Casa de Misericórdia de Tupã
Script de inicialização alternativo em Python
"""

import os
import sys
import subprocess
import time
import webbrowser
import platform
import urllib.request
import zipfile
import shutil
from pathlib import Path

# Cores para terminal
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header():
    print(f"""
{Colors.CYAN}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                🏥 SISTEMA DE GERENCIAMENTO HOSPITALAR        ║
║                   Santa Casa de Misericórdia de Tupã        ║
║                        Versão 2.1.0 Python                 ║
╚══════════════════════════════════════════════════════════════╝
{Colors.END}""")

def check_nodejs():
    """Verificar se Node.js está instalado"""
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"{Colors.GREEN}✅ Node.js encontrado: {result.stdout.strip()}{Colors.END}")
            return True
    except FileNotFoundError:
        pass
    
    # Verificar Node.js portátil
    if platform.system() == 'Windows':
        portable_node = Path('nodejs-portable/node.exe')
    else:
        portable_node = Path('nodejs-portable/bin/node')
    
    if portable_node.exists():
        print(f"{Colors.GREEN}✅ Node.js portátil encontrado!{Colors.END}")
        return True
    
    return False

def download_nodejs():
    """Baixar Node.js portátil"""
    print(f"{Colors.YELLOW}📥 Baixando Node.js portátil...{Colors.END}")
    
    system = platform.system()
    if system == 'Windows':
        url = 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-win-x64.zip'
        filename = 'nodejs.zip'
    elif system == 'Linux':
        url = 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-linux-x64.tar.xz'
        filename = 'nodejs.tar.xz'
    elif system == 'Darwin':  # macOS
        url = 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-darwin-x64.tar.gz'
        filename = 'nodejs.tar.gz'
    else:
        print(f"{Colors.RED}❌ Sistema operacional não suportado: {system}{Colors.END}")
        return False
    
    try:
        # Criar diretório temporário
        temp_dir = Path('temp')
        temp_dir.mkdir(exist_ok=True)
        
        file_path = temp_dir / filename
        
        print(f"   • Baixando de: {url}")
        urllib.request.urlretrieve(url, file_path)
        
        print(f"{Colors.BLUE}📦 Extraindo Node.js...{Colors.END}")
        
        if system == 'Windows':
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
            
            extracted_dir = temp_dir / 'node-v18.17.0-win-x64'
            target_dir = Path('nodejs-portable')
            
            if extracted_dir.exists():
                shutil.move(str(extracted_dir), str(target_dir))
        else:
            # Para Linux/macOS
            import tarfile
            with tarfile.open(file_path, 'r:*') as tar:
                tar.extractall(temp_dir)
            
            if system == 'Linux':
                extracted_dir = temp_dir / 'node-v18.17.0-linux-x64'
            else:
                extracted_dir = temp_dir / 'node-v18.17.0-darwin-x64'
            
            target_dir = Path('nodejs-portable')
            shutil.move(str(extracted_dir), str(target_dir))
        
        # Limpar arquivos temporários
        shutil.rmtree(temp_dir)
        
        print(f"{Colors.GREEN}✅ Node.js portátil instalado com sucesso!{Colors.END}")
        return True
        
    except Exception as e:
        print(f"{Colors.RED}❌ Erro ao baixar Node.js: {e}{Colors.END}")
        return False

def get_node_command():
    """Obter comando do Node.js (global ou portátil)"""
    try:
        subprocess.run(['node', '--version'], capture_output=True)
        return 'node', 'npm'
    except FileNotFoundError:
        if platform.system() == 'Windows':
            return 'nodejs-portable/node.exe', 'nodejs-portable/npm.cmd'
        else:
            return 'nodejs-portable/bin/node', 'nodejs-portable/bin/npm'

def install_dependencies():
    """Instalar dependências do projeto"""
    node_cmd, npm_cmd = get_node_command()
    
    print(f"{Colors.YELLOW}📦 Verificando dependências...{Colors.END}")
    
    # Backend
    if not Path('backend/node_modules').exists():
        print(f"{Colors.BLUE}   • Instalando dependências do Backend...{Colors.END}")
        try:
            subprocess.run([npm_cmd, 'install'], 
                         cwd='backend', 
                         check=True, 
                         capture_output=True)
            print(f"{Colors.GREEN}   ✅ Backend configurado!{Colors.END}")
        except subprocess.CalledProcessError as e:
            print(f"{Colors.RED}   ❌ Erro no backend: {e}{Colors.END}")
            return False
    
    # Frontend
    if not Path('frontend/node_modules').exists():
        print(f"{Colors.BLUE}   • Instalando dependências do Frontend...{Colors.END}")
        try:
            subprocess.run([npm_cmd, 'install'], 
                         cwd='frontend', 
                         check=True, 
                         capture_output=True)
            print(f"{Colors.GREEN}   ✅ Frontend configurado!{Colors.END}")
        except subprocess.CalledProcessError as e:
            print(f"{Colors.RED}   ❌ Erro no frontend: {e}{Colors.END}")
            return False
    
    print(f"{Colors.GREEN}✅ Todas as dependências verificadas!{Colors.END}")
    return True

def start_servers():
    """Iniciar servidores backend e frontend"""
    node_cmd, npm_cmd = get_node_command()
    
    print(f"{Colors.MAGENTA}🔧 Iniciando Backend (porta 5000)...{Colors.END}")
    
    # Iniciar backend
    backend_process = subprocess.Popen(
        [npm_cmd, 'run', 'dev'],
        cwd='backend',
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    time.sleep(3)
    
    print(f"{Colors.CYAN}⚛️  Iniciando Frontend (porta 3000)...{Colors.END}")
    
    # Iniciar frontend
    frontend_process = subprocess.Popen(
        [npm_cmd, 'start'],
        cwd='frontend',
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    time.sleep(5)
    
    return backend_process, frontend_process

def print_success():
    """Imprimir informações de sucesso"""
    print(f"""
{Colors.GREEN}{Colors.BOLD}🎉 SISTEMA HOSPITALAR INICIADO COM SUCESSO! 🎉{Colors.END}

{Colors.BOLD}📊 Acesso ao Sistema:{Colors.END}
   • Dashboard Principal: {Colors.CYAN}http://localhost:3000{Colors.END}
   • Backend API:        {Colors.MAGENTA}http://localhost:5000{Colors.END}

{Colors.BOLD}✨ Módulos Disponíveis:{Colors.END}
   🏥 Dashboard com estatísticas em tempo real
   👥 Cadastro de Pacientes e Funcionários
   📦 Controle de Estoque Inteligente
   🔬 Catálogo de Materiais (260+ itens especializados)
   🏥 Centro Cirúrgico Completo
   🩺 UTI e Controle de Emergência

{Colors.BOLD}📋 Categorias de Materiais:{Colors.END}
   🫀 Cardiologia  🧠 Neurologia   🎗️  Oncologia
   👁️  Oftalmologia 👶 Pediatria    🔬 Laboratório
   🩺 Emergência   🏥 UTI Móvel    🔥 Queimados
   E mais 15+ categorias especializadas!

{Colors.YELLOW}⚠️  Para parar: Pressione Ctrl+C{Colors.END}
""")

def main():
    """Função principal"""
    try:
        print_header()
        
        print(f"{Colors.YELLOW}🔍 Verificando requisitos do sistema...{Colors.END}")
        
        # Verificar/instalar Node.js
        if not check_nodejs():
            print(f"{Colors.YELLOW}📥 Node.js não encontrado. Instalando versão portátil...{Colors.END}")
            if not download_nodejs():
                print(f"{Colors.RED}❌ Falha ao instalar Node.js{Colors.END}")
                sys.exit(1)
        
        # Instalar dependências
        if not install_dependencies():
            print(f"{Colors.RED}❌ Falha ao instalar dependências{Colors.END}")
            sys.exit(1)
        
        # Iniciar servidores
        print(f"{Colors.BLUE}🚀 Iniciando Sistema Hospitalar...{Colors.END}")
        backend_proc, frontend_proc = start_servers()
        
        # Mostrar informações de sucesso
        print_success()
        
        # Abrir navegador
        time.sleep(2)
        try:
            webbrowser.open('http://localhost:3000')
            print(f"{Colors.GREEN}🌐 Navegador aberto automaticamente!{Colors.END}")
        except:
            pass
        
        # Aguardar interrupção
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n{Colors.YELLOW}🛑 Encerrando Sistema Hospitalar...{Colors.END}")
            backend_proc.terminate()
            frontend_proc.terminate()
            print(f"{Colors.GREEN}✅ Sistema encerrado com sucesso!{Colors.END}")
            
    except Exception as e:
        print(f"{Colors.RED}❌ Erro inesperado: {e}{Colors.END}")
        sys.exit(1)

if __name__ == "__main__":
    main()