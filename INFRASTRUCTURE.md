# 🏗️ Инфраструктура сервера IKEYA

Документация по инфраструктуре и деплою приложений на сервере `45.135.234.22`.

## 📋 Общая информация

- **Сервер**: `45.135.234.22`
- **Пользователь**: `deploy`
- **Домашняя директория**: `/home/deploy`
- **Приложения**: `/home/deploy/apps/`

## 🗂️ Структура приложений

```
/home/deploy/apps/
├── ikea_parser/          # Парсер IKEA (старое приложение)
├── ikea_api/             # API IKEA (Docker/Kamal)
└── ikea_front/            # Frontend IKEA (Next.js)
```

## 🌐 Доступные приложения

| Приложение | URL | Описание |
|------------|-----|----------|
| **ikea_parser** | http://45.135.234.22/ikea_parser/ | Парсер данных IKEA |
| **ikea_api** | http://45.135.234.22/api-docs/index.html | API документация (Swagger) |
| **ikea_front** | http://45.135.234.22/ikea_front | Frontend приложение (Next.js) |

## 🔐 Доступ к серверу

### SSH подключение

```bash
ssh deploy@45.135.234.22
```

### Настройка SSH ключей (для CI/CD)

1. Сгенерируйте SSH ключ (если нет):
```bash
ssh-keygen -t ed25519 -C "github-actions"
```

2. Скопируйте публичный ключ на сервер:
```bash
ssh-copy-id deploy@45.135.234.22
```

3. Добавьте приватный ключ в GitHub Secrets как `DEPLOY_SSH_KEY`

## 📦 Установленные зависимости

### Node.js и npm
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 startup
pm2 save
```

### Nginx
- Конфигурация: `/etc/nginx/sites-available/`
- Симлинки: `/etc/nginx/sites-enabled/`
- Логи: `/var/log/nginx/`

## 🚀 Деплой приложений

### ikea_front (Frontend)

**Директория**: `/home/deploy/apps/ikea_front`

**Процесс деплоя**:
1. Автоматический через GitHub Actions (при push в main/master)
2. Ручной через скрипт `scripts/deploy.sh`

**Управление процессом**:
```bash
# Запуск
pm2 start ecosystem.config.js

# Перезапуск
pm2 restart ikea_front

# Остановка
pm2 stop ikea_front

# Логи
pm2 logs ikea_front

# Статус
pm2 status
```

**Порт**: `3000`

### ikea_api (Backend API)

**Технология**: Docker/Kamal

**Управление**:
```bash
cd /home/deploy/apps/ikea_api
kamal deploy
```

### ikea_parser

**Старое приложение** (детали уточнить у команды)

## 🔧 Nginx конфигурация

### Основные конфигурационные файлы

1. **ikea_front** - `/etc/nginx/sites-available/ikea_front.conf`
2. **ikea_parser** - `/etc/nginx/sites-available/ikea_parser.conf` (предположительно)
3. **ikea_api** - `/etc/nginx/sites-available/ikea_api.conf` (предположительно)

### Управление Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка конфигурации
sudo systemctl reload nginx

# Перезапуск
sudo systemctl restart nginx

# Статус
sudo systemctl status nginx
```

### Структура конфигурации

```nginx
# Основной сервер
server {
    listen 80;
    server_name 45.135.234.22;
    
    # ikea_parser
    location /ikea_parser/ { ... }
    
    # ikea_api
    location /api-docs/ { ... }
    
    # ikea_front
    location /ikea_front { ... }
}
```

## 📊 Мониторинг

### PM2 мониторинг

```bash
# Дашборд
pm2 monit

# Список процессов
pm2 list

# Информация о процессе
pm2 show ikea_front
```

### Логи

**Приложения**:
- `ikea_front`: `/home/deploy/apps/ikea_front/logs/`

**Nginx**:
- Access: `/var/log/nginx/ikea_front_access.log`
- Error: `/var/log/nginx/ikea_front_error.log`

**Системные**:
```bash
# Системные логи
journalctl -u nginx
journalctl -u pm2
```

## 🔄 CI/CD

### GitHub Actions

Workflow файл: `.github/workflows/deploy.yml`

**Триггеры**:
- Push в ветки `main` или `master`
- Ручной запуск через `workflow_dispatch`

**Secrets в GitHub**:
- `DEPLOY_HOST` - `45.135.234.22`
- `DEPLOY_USER` - `deploy`
- `DEPLOY_SSH_KEY` - приватный SSH ключ

### Процесс деплоя

1. Checkout кода
2. Установка Node.js
3. Установка зависимостей (`npm ci`)
4. Линтинг (`npm run lint`)
5. Сборка проекта (`npm run build`)
6. Копирование на сервер (SCP)
7. Установка зависимостей на сервере
8. Перезапуск через PM2

## 🛠️ Полезные команды

### Проверка портов

```bash
# Проверка занятых портов
sudo netstat -tulpn | grep LISTEN
# или
sudo ss -tulpn | grep LISTEN
```

### Проверка процессов

```bash
# Процессы Node.js
ps aux | grep node

# Процессы PM2
pm2 list
```

### Дисковое пространство

```bash
# Использование диска
df -h

# Размер директорий
du -sh /home/deploy/apps/*
```

### Перезапуск всех сервисов

```bash
# PM2 процессы
pm2 restart all

# Nginx
sudo systemctl restart nginx
```

## 🚨 Устранение неполадок

### Приложение не запускается

1. Проверить логи PM2:
```bash
pm2 logs ikea_front --lines 50
```

2. Проверить порт:
```bash
netstat -tulpn | grep 3000
```

3. Проверить права доступа:
```bash
ls -la /home/deploy/apps/ikea_front
```

### Nginx не проксирует запросы

1. Проверить конфигурацию:
```bash
sudo nginx -t
```

2. Проверить логи:
```bash
sudo tail -f /var/log/nginx/ikea_front_error.log
```

3. Проверить, что приложение запущено:
```bash
curl http://localhost:3000
```

### Проблемы с деплоем

1. Проверить SSH доступ:
```bash
ssh deploy@45.135.234.22
```

2. Проверить права на директорию:
```bash
ls -la /home/deploy/apps/
```

3. Проверить GitHub Secrets в настройках репозитория

## 📝 Чеклист первоначальной настройки

- [ ] Установлен Node.js >= 18
- [ ] Установлен npm
- [ ] Установлен PM2 глобально
- [ ] Настроен PM2 startup
- [ ] Создана директория `/home/deploy/apps/ikea_front`
- [ ] Настроены права доступа для пользователя `deploy`
- [ ] Добавлена конфигурация Nginx
- [ ] Создан симлинк в `sites-enabled`
- [ ] Перезагружен Nginx
- [ ] Настроены GitHub Secrets для CI/CD
- [ ] Протестирован деплой

## 📞 Контакты и поддержка

При возникновении проблем:
1. Проверить логи приложения и Nginx
2. Проверить статус процессов PM2
3. Проверить конфигурацию Nginx
4. Обратиться к команде DevOps

---

**Последнее обновление**: 2024

