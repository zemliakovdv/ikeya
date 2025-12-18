#!/bin/bash

# Скрипт для первоначальной настройки сервера
# Использование: ./scripts/setup-server.sh

set -e

echo "🔧 Настройка сервера для IKEYA Frontend..."

SERVER_HOST="45.135.234.22"
SERVER_USER="deploy"
APP_DIR="/home/deploy/apps/ikea_front"

ssh ${SERVER_USER}@${SERVER_HOST} << ENDSSH
  set -e
  
  echo "📁 Создание директории приложения..."
  mkdir -p ${APP_DIR}
  
  echo "📦 Проверка Node.js..."
  if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+"
    exit 1
  fi
  
  node_version=\$(node -v)
  echo "✅ Node.js версия: \$node_version"
  
  echo "📦 Проверка npm..."
  if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
  fi
  
  npm_version=\$(npm -v)
  echo "✅ npm версия: \$npm_version"
  
  echo "📦 Проверка PM2..."
  if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 не установлен. Устанавливаем..."
    npm install -g pm2
  fi
  
  pm2_version=\$(pm2 -v)
  echo "✅ PM2 версия: \$pm2_version"
  
  echo "✅ Настройка сервера завершена!"
  echo "📁 Директория приложения: ${APP_DIR}"
ENDSSH

echo "✅ Настройка завершена. Теперь можно выполнить деплой."

