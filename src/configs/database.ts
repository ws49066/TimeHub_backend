// src/config/sequelize.ts
import { Sequelize } from "sequelize";
import 'dotenv/config';

// Configurações do Railway
const database = process.env.MYSQL_DATABASE!;
const username = process.env.MYSQLUSER!;
const password = process.env.MYSQL_ROOT_PASSWORD!;
const host = process.env.MYSQLHOST!;
const port = Number(process.env.MYSQLPORT || 3306);

// Criação da instância Sequelize
export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  dialectOptions: {
    charset: "utf8mb4",
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  logging: false, // set true se quiser ver as queries no console
});

// Função para testar conexão
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao MySQL no Railway com sucesso!");
  } catch (err) {
    console.error("❌ Erro na conexão com MySQL:", err);
  }
}

// Chama o teste automaticamente
testConnection();
