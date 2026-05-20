# Backend Installation Guide

Complete step-by-step guide for installing TimeHub Backend locally.

## Prerequisites

### **Node.js & npm**

```bash
# Check if installed
node --version  # Should be v18+
npm --version

# If not installed, download from:
# https://nodejs.org/ (LTS version)
```

### **Git**

```bash
git --version  # Should show version

# If not installed:
# https://git-scm.com/
```

### **Docker (Recommended)**

```bash
docker --version        # Should show version
docker-compose --version

# Download:
# https://www.docker.com/products/docker-desktop
```

---

## Installation Steps (15 minutes)

### **1. Clone Repository**

```bash
git clone https://github.com/seu-usuario/timehub-backend.git
cd timehub-backend
```

### **2. Install Dependencies**

```bash
npm install
```

This installs all packages from `package.json` (Express, TypeScript, MySQL, Sequelize, etc.)

### **3. Create Environment File**

```bash
cp .env.example .env
```

Edit `.env` and set your values (or use defaults for development):

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=timehub_db
DB_USER=admin
DB_PASSWORD=admin123

JWT_SECRET=your_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

CORS_ORIGIN=http://localhost:3000
```

### **4. Start MySQL with Docker**

```bash
# Create and run MySQL container
docker run -d \
  --name timehub-mysql \
  -e MYSQL_ROOT_PASSWORD=admin123 \
  -e MYSQL_DATABASE=timehub_db \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 3306:3306 \
  mysql:8.0

# Wait for MySQL to start
sleep 10

# Verify it's running
docker ps | grep timehub-mysql
```

Or use docker-compose:

```bash
docker-compose up -d mysql
```

### **5. Run Database Migrations**

```bash
npx sequelize db:migrate --env development
```

You should see:
```
== 20260113104410-create-clients: migrating =======
== 20260113104410-create-clients: migrated
...
```

### **6. Run Seeders (Initial Data)**

```bash
npx sequelize db:seed:all --env development
```

This creates default admin user:
- Email: `admin@timehub.com`
- Password: `admin123`

### **7. Start Development Server**

```bash
npm run dev
```

You should see:
```
Server running on port 3001
Database connected successfully
```

✅ **Backend is ready!** Open `http://localhost:3001`

---

## Verify Installation

### Test 1: Check Server Response

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

### Test 2: Login API

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@timehub.com",
    "password": "admin123"
  }'

# Should return token and user data
```

### Test 3: List Clients (needs token)

```bash
# First get token from Test 2, then:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/clients
```

---

## Stopping the Server

```bash
# In the terminal running npm run dev, press:
Ctrl + C

# Stop MySQL container
docker stop timehub-mysql
```

## Restarting

```bash
# Start MySQL
docker start timehub-mysql

# Start backend
npm run dev
```

---

## Reset Database

If you need to start fresh:

```bash
# Stop and remove container
docker stop timehub-mysql
docker rm timehub-mysql

# Remove volume (delete data)
docker volume rm timehub_mysql_data

# Recreate everything
docker run -d --name timehub-mysql \
  -e MYSQL_ROOT_PASSWORD=admin123 \
  -e MYSQL_DATABASE=timehub_db \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 3306:3306 mysql:8.0

sleep 10

npx sequelize db:migrate --env development
npx sequelize db:seed:all --env development
npm run dev
```

---

## Troubleshooting

### Error: Port 3001 in use

```bash
# Find process using port
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use different port in .env
PORT=3002
```

### Error: Cannot connect to MySQL

```bash
# Check if container is running
docker ps | grep timehub-mysql

# If not running:
docker start timehub-mysql

# If container doesn't exist:
# Follow step 4 above
```

### Error: Module not found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: EADDRINUSE (address in use)

```bash
# Find what's using the port
netstat -an | grep 3001

# Kill the process or use different port
```

### Database migration errors

```bash
# Undo last migration
npx sequelize db:migrate:undo --env development

# Check migration status
npx sequelize db:migrate:status --env development

# Run again
npx sequelize db:migrate --env development
```

---

## Development Workflow

### **File Watcher (Hot Reload)**

```bash
npm run dev
```

This uses `tsx watch` to restart server on file changes.

### **Build for Production**

```bash
npm run build
```

Creates `dist/` folder with compiled JavaScript.

### **Run Production Build**

```bash
npm start
```

Runs the compiled code from `dist/` folder.

---

## Next Steps

1. ✅ Backend installed and running
2. 📖 Read [README.md](./README.md) for API documentation
3. 🔗 Install [Frontend](https://github.com/seu-usuario/timehub-frontend)
4. 🚀 Deploy to Railway when ready

---

## Common Commands

```bash
# Development
npm run dev              # Start with hot reload

# Build
npm run build            # Compile TypeScript
npm start                # Run compiled code

# Database
npx sequelize db:migrate --env development
npx sequelize db:migrate:undo --env development
npx sequelize db:migrate:status --env development
npx sequelize db:seed:all --env development

# Utilities
npm list                 # Show installed packages
npm outdated            # Check for updates
npm cache clean --force # Clear npm cache
```

---

**Backend is ready! 🚀**

Next: Install Frontend from https://github.com/seu-usuario/timehub-frontend
