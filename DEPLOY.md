# 🚀 Инструкция по деплою IKEYA Frontend

Краткая инструкция-памятка по деплою и настройке приложения.

## 📋 Быстрый старт

### 1. Первоначальная настройка сервера (один раз)

```bash
# На локальной машине
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

Этот скрипт:
- Создаст директорию `/home/deploy/apps/ikea_front`
- Проверит наличие Node.js, npm, PM2
- Установит PM2 если отсутствует

### 2. Настройка Nginx

```bash
# На сервере
ssh deploy@45.135.234.22

# Копирование конфигурации (если еще не скопирована)
sudo cp /home/deploy/apps/ikea_front/nginx/ikea_front.conf /etc/nginx/sites-available/

# Создание симлинка
sudo ln -s /etc/nginx/sites-available/ikea_front.conf /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезагрузка Nginx
sudo systemctl reload nginx
```

### 3. Настройка GitHub Secrets

В настройках репозитория GitHub → Settings → Secrets and variables → Actions:

1. `DEPLOY_HOST` = `45.135.234.22`
2. `DEPLOY_USER` = `deploy`
3. `DEPLOY_SSH_KEY` = приватный SSH ключ (содержимое файла `~/.ssh/id_rsa` или `~/.ssh/id_ed25519`)

**Генерация SSH ключа** (если нет):
```bash
ssh-keygen -t ed25519 -C "github-actions"
# Скопировать публичный ключ на сервер
ssh-copy-id deploy@45.135.234.22
# Приватный ключ добавить в GitHub Secrets
cat ~/.ssh/id_ed25519
```

### 4. Первый деплой

#### Автоматический (через GitHub Actions)

Просто сделайте push в ветку `main` или `master`:
```bash
git push origin main
```

#### Ручной деплой

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🔄 Обычный рабочий процесс

### Разработка

1. Создайте ветку для фичи
2. Внесите изменения
3. Протестируйте локально: `npm run dev`
4. Сделайте commit и push

### Деплой

**Автоматический**: Push в `main` → GitHub Actions автоматически задеплоит

**Ручной**: 
```bash
./scripts/deploy.sh
```

## 🛠️ Управление на сервере

### PM2 команды

```bash
ssh deploy@45.135.234.22
cd /home/deploy/apps/ikea_front

# Статус
pm2 status

# Перезапуск
pm2 restart ikea_front

# Остановка
pm2 stop ikea_front

# Логи
pm2 logs ikea_front

# Мониторинг
pm2 monit
```

### Обновление кода вручную

```bash
ssh deploy@45.135.234.22
cd /home/deploy/apps/ikea_front

# Обновление из репозитория
git pull origin main

# Установка зависимостей
npm ci --production

# Сборка
export BASE_PATH=/ikea_front
export NODE_ENV=production
npm run build

# Перезапуск
pm2 restart ikea_front
```

## 🔍 Проверка работоспособности

### Проверка приложения

```bash
# На сервере
curl http://localhost:3000/ikea_front

# Или через браузер
http://45.135.234.22/ikea_front
```

### Проверка логов

```bash
# Логи приложения
pm2 logs ikea_front

# Логи Nginx
sudo tail -f /var/log/nginx/ikea_front_error.log
sudo tail -f /var/log/nginx/ikea_front_access.log
```

### Проверка процессов

```bash
# Процессы Node.js
ps aux | grep node

# PM2 процессы
pm2 list

# Порт 3000
netstat -tulpn | grep 3000
```

## 🚨 Устранение проблем

### Приложение не запускается

1. Проверить логи: `pm2 logs ikea_front`
2. Проверить порт: `netstat -tulpn | grep 3000`
3. Проверить права: `ls -la /home/deploy/apps/ikea_front`

### Nginx не работает

1. Проверить конфигурацию: `sudo nginx -t`
2. Проверить логи: `sudo tail -f /var/log/nginx/ikea_front_error.log`
3. Проверить, что приложение запущено: `pm2 status`

### Проблемы с деплоем

1. Проверить SSH доступ: `ssh deploy@45.135.234.22`
2. Проверить GitHub Secrets
3. Проверить логи GitHub Actions в репозитории

## 📝 Чеклист деплоя

- [ ] Сервер настроен (`setup-server.sh` выполнен)
- [ ] Nginx конфигурация установлена
- [ ] GitHub Secrets настроены
- [ ] SSH ключ добавлен на сервер
- [ ] Первый деплой выполнен
- [ ] Приложение доступно по адресу http://45.135.234.22/ikea_front
- [ ] PM2 процесс запущен
- [ ] Логи проверены

## 🔗 Полезные ссылки

- **Production URL**: http://45.135.234.22/ikea_front
- **API документация**: http://45.135.234.22/api-docs/index.html
- **Парсер**: http://45.135.234.22/ikea_parser/
- **Подробная документация**: [INFRASTRUCTURE.md](./INFRASTRUCTURE.md)

---

**Последнее обновление**: 2024

