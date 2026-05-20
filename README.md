# TimeHub Backend API

**RESTful API for appointment scheduling system** built with Node.js, Express, and MySQL.

## 🚀 Quick Start (5 minutes)

```bash
# Clone and install
git clone https://github.com/seu-usuario/timehub-backend.git
cd timehub-backend
npm install

# Setup environment
cp .env.example .env

# Start MySQL (Docker)
docker run -d --name timehub-mysql \
  -e MYSQL_ROOT_PASSWORD=admin123 \
  -e MYSQL_DATABASE=timehub_db \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 3306:3306 mysql:8.0

sleep 10

# Database setup
npx sequelize db:migrate --env development
npx sequelize db:seed:all --env development

# Start server
npm run dev
```

Server: `http://localhost:3001`

---

## 📋 Requirements

- Node.js 18+
- npm/yarn
- Docker (for MySQL)

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | MySQL 8.0 |
| **ORM** | Sequelize |
| **Auth** | JWT |
| **Security** | Bcrypt |
| **Container** | Docker |

---

## 📚 API Endpoints

### **Authentication**

```bash
# Login
POST /auth/login
{ "email": "admin@timehub.com", "password": "admin123" }

# Refresh token
POST /auth/refresh
{ "refreshToken": "..." }
```

### **Clients** (Admin)

```bash
GET /clients                    # List
POST /clients                   # Create
PUT /clients/:id               # Update
DELETE /clients/:id            # Delete
```

### **Rooms** (Admin)

```bash
GET /rooms                     # List
POST /rooms                    # Create
GET /rooms/:id/availability   # Get available slots
```

### **Appointments**

```bash
GET /scheduling                # List (filter by date/status)
POST /scheduling              # Create
PATCH /scheduling/:id/cancel  # Cancel
```

---

## ⚙️ Environment Variables

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

CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Testing with cURL

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@timehub.com","password":"admin123"}' \
  | jq -r '.token')

# List clients
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/clients

# Create client
curl -X POST http://localhost:3001/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"(11)98765-4321"}'
```

---

## 🔐 Business Rules

**Scheduling:**
- Minimum 30 minutes in advance required
- Can cancel up to 2 hours before
- No overlapping appointments
- Must be within room operating hours

**Permissions:**
- Admin: Full access
- Manager: Manage appointments & clients
- Receptionist: View & create appointments
- Client: Own appointments only

---

## 📦 Scripts

```bash
npm run dev      # Development with hot reload
npm run build    # Build TypeScript
npm start        # Run production

# Database
npx sequelize db:migrate --env development
npx sequelize db:seed:all --env development
```

---

## 🚀 Production Deployment

### Deploy to Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect GitHub repo (select `TimeHub_backend` folder)
4. Set environment variables (use strong passwords!)
5. Deploy

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `kill -9 $(lsof -t -i:3001)` |
| MySQL error | `docker start timehub-mysql` |
| Module not found | `rm -rf node_modules && npm install` |
| Migration failed | `npx sequelize db:migrate:undo --env development` |

---

## 📖 More Info

- [Frontend Repository](https://github.com/ws49066/TimeHub_frontend)
- [Installation Guide](./INSTALLATION.md)
- [Live Demo](https://timehub-frontend.vercel.app)

---

## 📄 License

ISC License

---

**Start coding! 🚀**
