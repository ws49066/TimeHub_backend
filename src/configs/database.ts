// src/config/sequelize.ts
import { Sequelize } from "sequelize";
import "dotenv/config";

// Detecta se estamos rodando localmente
const isLocal = !process.env.RAILWAY_ENV; // variável do Railway existe quando está no deploy

let sequelize: Sequelize;

if (isLocal) {
  // DEV local — usar a URL pública do Railway
  if (!process.env.MYSQL_PUBLIC_URL) {
    throw new Error("❌ MYSQL_PUBLIC_URL não definido no .env");
  }

  sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL!, {
    dialect: "mysql",
    dialectOptions: { charset: "utf8mb4" },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    logging: false,
  });
  console.log("🌍 Conectando ao MySQL usando URL pública (DEV LOCAL)");
} else {
  // PROD / Railway interno — usar host privado
  const database = process.env.MYSQL_DATABASE!;
  const username = process.env.MYSQLUSER!;
  const password = process.env.MYSQL_ROOT_PASSWORD!;
  const host = process.env.MYSQLHOST!;
  const port = Number(process.env.MYSQLPORT || 3306);

  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: "mysql",
    dialectOptions: { charset: "utf8mb4" },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    logging: false,
  });
  console.log("🚀 Conectando ao MySQL usando host privado (RAILWAY PROD)");
}

// Função para testar a conexão
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao MySQL com sucesso!");
  } catch (err) {
    console.error("❌ Erro na conexão com MySQL:", err);
  }
}

// Testa automaticamente ao iniciar
testConnection();

export default sequelize;
