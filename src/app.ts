import express from "express"
import routes from "./routes"
import { sequelize } from "./configs/database"

const app = express()

app.use(express.json())

app.use("/api", routes)

export async function startApp(){
    try {
        await sequelize.authenticate()
        console.log("Database Connected")

        return app

    } catch (error) {
        console.error("Database connection failed: ", error)
        process.exit(1)        
    }
}

