#!/bin/bash

# Скрипт для ручного деплоя на сервер
# Использование: ./scripts/deploy.sh

set -e

echo "🚀 Начинаем деплой IKEYA Frontend..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Переменные
SERVER_HOST="45.135.234.22"
SERVER_USER="deploy"
APP_DIR="/home/deploy/apps/ikea_front"
REMOTE_DIR="${SERVER_USER}@${SERVER_HOST}:${APP_DIR}"

# Проверка наличия необходимых команд
command -v rsync >/dev/null 2>&1 || { echo "❌ rsync не установлен. Установите его для продолжения."; exit 1; }

echo -e "${YELLOW}📦 Сборка проекта...${NC}"
export BASE_PATH=/ikea_front
export NODE_ENV=production
npm run build

echo -e "${YELLOW}📤 Копирование файлов на сервер...${NC}"
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude '.github' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  ./ ${REMOTE_DIR}/

echo -e "${YELLOW}📥 Установка зависимостей и сборка на сервере...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
  cd /home/deploy/apps/ikea_front
  export BASE_PATH=/ikea_front
  export NODE_ENV=production
  npm ci --production
  npm run build
  pm2 restart ikea_front || pm2 start ecosystem.config.js
  pm2 save
ENDSSH

echo -e "${GREEN}✅ Деплой завершен успешно!${NC}"
echo -e "${GREEN}🌐 Приложение доступно по адресу: http://45.135.234.22/ikea_front${NC}"

