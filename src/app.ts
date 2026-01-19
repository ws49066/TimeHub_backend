import express from "express"
import routes from "./routes"
import { sequelize } from "./configs/database"
import './models/index'
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors({
    origin: process.env.HOST_FE,
    credentials: true
}))


app.use("/api", routes)

export async function startApp() {
    try {
        await sequelize.authenticate()
        console.log("Database Connected")

        return app

    } catch (error) {
        console.error("Database connection failed: ", error)
        process.exit(1)
    }
}

