#!/bin/bash

# Script para configurar el repositorio TerminalTime en GitHub

echo "🚀 Configurando TerminalTime para GitHub..."

# Inicializar Git
echo "📦 Inicializando repositorio Git..."
git init

# Configurar usuario Git (opcional - descomenta si es necesario)
# git config user.name "Tu Nombre"
# git config user.email "tu@email.com"

# Agregar todos los archivos
echo "📁 Agregando archivos al repositorio..."
git add .

# Primer commit
echo "💾 Creando primer commit..."
git commit -m "🎉 Initial commit - TerminalTime: Historia de la programación en tu terminal"

# Configurar rama principal
echo "🌿 Configurando rama main..."
git branch -M main

# Agregar origen remoto
echo "🔗 Conectando con GitHub..."
git remote add origin https://github.com/imorlab/terminalTime.git

# Push inicial
echo "⬆️ Subiendo a GitHub..."
git push -u origin main

echo "✅ ¡TerminalTime configurado exitosamente en GitHub!"
echo "🌐 Repositorio: https://github.com/imorlab/terminalTime"
echo ""
echo "🔥 Próximos pasos:"
echo "   1. Configurar APIs en .env.local"
echo "   2. Desplegar en Vercel"
echo "   3. Configurar dominio terminaltime.dev"
