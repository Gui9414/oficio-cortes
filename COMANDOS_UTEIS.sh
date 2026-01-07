#!/bin/bash
# COMANDOS ÚTEIS - OFÍCIO CORTES

# ===================================
# 🚀 DESENVOLVIMENTO
# ===================================

# Instalar dependências
npm install

# Popular banco de dados (requer MongoDB rodando)
npm run seed

# Iniciar backend (desenvolvimento com auto-reload)
npm run server:dev

# Iniciar frontend (desenvolvimento)
npm run dev

# Iniciar ambos simultaneamente (requer 2 terminais)
# Terminal 1: npm run server:dev
# Terminal 2: npm run dev

# ===================================
# 🏗️ PRODUÇÃO
# ===================================

# Build do frontend
npm run build

# Preview do build
npm run preview

# Iniciar backend (produção)
npm run server

# ===================================
# 🗄️ BANCO DE DADOS
# ===================================

# Executar seed (popular dados)
npm run seed

# Conectar ao MongoDB local
mongosh

# Ver databases
show dbs

# Usar database oficio-cortes
use oficio-cortes

# Ver collections
show collections

# Ver usuários
db.usuarios.find().pretty()

# Ver barbeiros
db.barbeiros.find().pretty()

# Ver produtos
db.produtos.find().pretty()

# Ver agendamentos
db.agendamentos.find().pretty()

# Limpar collection específica
db.usuarios.deleteMany({})

# Limpar todas as collections e recriar
npm run seed

# ===================================
# 🧹 LIMPEZA
# ===================================

# Remover node_modules
rm -rf node_modules

# Remover arquivos de build
rm -rf dist

# Reinstalar dependências
npm install

# ===================================
# 🔍 DEBUG
# ===================================

# Ver logs do backend em tempo real
# (já habilitado ao usar npm run server:dev)

# Verificar porta em uso (Windows)
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Matar processo na porta (Windows - substitua PID)
taskkill /PID [número_do_pid] /F

# ===================================
# 📦 GIT
# ===================================

# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit"

# Adicionar remote
git remote add origin [url-do-repositorio]

# Push
git push -u origin main

# ===================================
# 🧪 TESTES ÚTEIS
# ===================================

# Testar API de health check
curl http://localhost:5000/api/health

# Testar login (Windows PowerShell)
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method POST -Body (@{email="admin@oficiocortes.com"; password="admin123"} | ConvertTo-Json) -ContentType "application/json"

# Listar produtos
curl http://localhost:5000/api/produtos

# Listar barbeiros
curl http://localhost:5000/api/barbeiros

# ===================================
# 🔐 VARIÁVEIS DE AMBIENTE
# ===================================

# Ver conteúdo do .env
cat .env

# Editar .env
notepad .env

# ===================================
# 📱 MOBILE/REDE LOCAL
# ===================================

# Descobrir seu IP local (Windows)
ipconfig

# Descobrir seu IP local (Linux/Mac)
ifconfig

# Acessar do celular (substitua pelo seu IP)
# http://192.168.1.X:5173

# ===================================
# 🐳 DOCKER (OPCIONAL)
# ===================================

# MongoDB com Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ver containers rodando
docker ps

# Parar container
docker stop mongodb

# Iniciar container
docker start mongodb

# Remover container
docker rm mongodb

# ===================================
# 📊 INFORMAÇÕES DO SISTEMA
# ===================================

# Versão do Node
node --version

# Versão do npm
npm --version

# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências (cuidado!)
npm update

# ===================================
# 🚨 TROUBLESHOOTING
# ===================================

# Problema: "Cannot find module"
# Solução:
rm -rf node_modules package-lock.json
npm install

# Problema: "Port already in use"
# Solução: Mude a porta no .env ou mate o processo

# Problema: "Cannot connect to MongoDB"
# Solução: Verifique se MongoDB está rodando
# Windows: Verifique serviços do Windows
# Ou use MongoDB Atlas

# Problema: "Seed failed"
# Solução: 
# 1. Verifique MongoDB
# 2. Verifique .env
# 3. Execute novamente: npm run seed

# ===================================
# 📚 DOCUMENTAÇÃO
# ===================================

# Ler documentação principal
# README.md - Visão geral
# GUIA_DE_USO.md - Como usar
# SETUP_COMPLETO.md - Instalação
# MONGODB_SETUP.md - Configurar DB
# CHECKLIST.md - Roadmap
# RESUMO_DESENVOLVIMENTO.md - Resumo técnico

# ===================================
# 🎯 WORKFLOW RECOMENDADO
# ===================================

# 1. Primeira vez:
npm install
# Configure MongoDB (veja MONGODB_SETUP.md)
npm run seed

# 2. Desenvolvimento diário:
# Terminal 1:
npm run server:dev

# Terminal 2:
npm run dev

# 3. Antes de deploy:
npm run build
npm run server

# ===================================
# 💡 DICAS
# ===================================

# - Sempre execute seed após configurar MongoDB
# - Use nodemon para auto-reload no backend
# - Use MongoDB Atlas para evitar problemas locais
# - Consulte GUIA_DE_USO.md para mais informações
# - Mantenha o .env sempre configurado

# ===================================
# 🏆 ATALHOS ÚTEIS
# ===================================

# Limpar terminal (Windows)
cls

# Limpar terminal (Linux/Mac)
clear

# Navegar para pasta do projeto
cd c:\Users\Guilherme\oficio-cortes

# Ver estrutura de pastas
tree /F

# Ver arquivos da pasta atual
dir     # Windows
ls -la  # Linux/Mac
