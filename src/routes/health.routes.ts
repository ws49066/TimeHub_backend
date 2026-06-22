import { sequelize } from "@/configs/database"
import { Router } from 'express'

const healthRoutes = Router()

healthRoutes.get('/', async (_, res) => {
  try {
    await sequelize.authenticate()

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    })
  }
})


healthRoutes.head('/', async (_, res) => {
  try {
    await sequelize.authenticate()

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    })
  }
})

export default healthRoutes