# ===== Build stage =====
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


RUN npm run build

# ===== Runtime stage =====
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeders ./seeders
COPY --from=builder /app/config ./config
COPY --from=builder /app/.env ./
COPY --from=builder /app/.sequelizerc ./
COPY --from=builder /app/*.json ./
COPY --from=builder /app/tsconfig.json ./ 


RUN apk add --no-cache bash netcat-openbsd
RUN apk add --no-cache tzdata

CMD ["sh", "-c", "\
  echo 'Awaiting MySQL...' && \
  until nc -z $DB_HOST $DB_PORT; do sleep 1; done && \
  echo 'MySQL ready, running migrations...' && \
  npx sequelize db:migrate && \
  echo 'Running seeds...' && \
  npx sequelize db:seed:all && \
  echo 'Starting app...' && \
  node -r module-alias/register dist/server.js \
"]

